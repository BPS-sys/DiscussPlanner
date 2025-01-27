import os
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel, Field
from jsonpath_ng import parse
import json

# langchain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.runnables import (
    Runnable,
    RunnablePassthrough,
    RunnableParallel,
    RunnableLambda,
)
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool
from langfuse.callback import CallbackHandler
from operator import itemgetter

# openai
from langchain_openai.chat_models import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings

# local
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.models import AzureModels, OpenAIModels
from lib.vectorstore import VectorStore

# tools
from tools.tools import QandATools

# api
from api.schema import MeetingProperties  # 会議進行に利用するプロパティ

# load environment variables
load_dotenv("../.env")


class LangchainBot:
    """
    Langchainを利用したチャットボット
    """

    def __init__(
        self,
        retriever_config: Optional[RetrieverConfig] = RetrieverConfig(),
        compose_tools: Optional[BaseModel] = QandATools(),
        stream_tools: Optional[BaseModel] = QandATools(),
        meeting_id: Optional[str] = "111",
    ):
        """
        初期化

        Args:
            retriever_config (Optional[RetrieverConfig], optional): リトリーバの設定. Defaults to None.
        """
        # meeting_id
        self.meeting_id = meeting_id

        # tools
        self.compose_tools = compose_tools
        self.stream_tools = stream_tools

        # config
        self.retriever_config = retriever_config

        # langfuse
        self.langfuse_handler = CallbackHandler(
            public_key=str(os.getenv("LANGFUSE_PUBLIC_KEY")),
            secret_key=str(os.getenv("LANGFUSE_SECRET_KEY")),
            host=str(os.getenv("LANGFUSE_ENDPOINT")),
        )

        # model
        self.models = AzureModels()  # モデルの初期化
        self.compose_llm = self.models.compose_model
        self.stream_llm = self.models.stream_model
        self.embeddings = self.models.embeddings

        # stream_llm prompt
        self.system_prompt = SystemMessagePromptTemplate.from_template(
            """
            {prompt}
            
            以下の`context`の情報に基づいて、質問に回答してください。
            必ずチャット形式（口語調）で回答してください。
            
            context:
            {context}
            
            // メタデータ //
            1. プロジェクトの説明: 
            {project_description}
                    
            2. 会議の説明: 
            {meeting_description}
            
            3. 途中回答:
            {tool_result}
            """
        )
        self.human_prompt = HumanMessagePromptTemplate.from_template("{question}")
        self.prompt = ChatPromptTemplate.from_messages(
            [self.system_prompt, self.human_prompt]
        )

        # compose_llm prompt
        self.compose_llm_prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate.from_template(
                    """
                    現在会議を進行中です。
                    メタデータと質問からユーザーの意図を汲み取って、適切な回答を生成してください。
                    質問からコンテキストを検索するための文章を提供してください。
                    
                    // メタデータ //
                    1. プロジェクトの説明: 
                    {project_description}
                    
                    2. 会議の説明: 
                    {meeting_description}
                    
                    3. meeting_id: {meeting_id}
                    
                    4. 現在のアイデア: 
                    {ideas}
                    """
                ),
                HumanMessagePromptTemplate.from_template("{question}"),
            ]
        )

    def compose_data(
        self,
        question: str,
        meeting_id: str,
        ideas: str,
        prompt: ChatPromptTemplate,
        tools_model: BaseModel,
        prompt_args: dict = {
            "prompt": "",
            "context": "",
            "propaties": MeetingProperties(),
        },
        tool_result: dict = {},  # 前回のツールの結果
        settings: dict = {
            "langfuse": False,
        },
    ) -> dict:
        """
        回答前に用意する必要があるデータを生成、処理する

        Args:
            question (str): 質問

        Returns:
            dict: データ
        """

        if tools_model is None:
            return {}

        # tool_resultの辞書が空の場合は、空文字列に変換
        if tool_result == {}:
            tool_result = ""
        else:
            tool_result = json.dumps(tool_result)  # 辞書を文字列に変換

        llm_with_tools = self.compose_llm.bind_tools(tools_model.tools)
        chain: Runnable = (
            {
                "question": lambda x: x["question"],
                "meeting_id": lambda x: x["meeting_id"],
                "ideas": lambda x: x["ideas"],
                "prompt": lambda x: x["prompt"],
                "context": lambda x: x["context"],
                "project_name": lambda x: x["project_name"],
                "project_description": lambda x: x["project_description"],
                "meeting_name": lambda x: x["meeting_name"],
                "meeting_description": lambda x: x["meeting_description"],
                "ai_role": lambda x: x["ai_role"],
                "maximum_time": lambda x: x["maximum_time"],
                "tool_result": lambda x: x["tool_result"],
            }
            | prompt
            | llm_with_tools
        )

        try:
            meeting_properties = prompt_args.get("propaties")

            input_data = {
                "question": question,
                "meeting_id": meeting_id,
                "ideas": ideas,
                "prompt": prompt_args.get("prompt", ""),
                "context": prompt_args.get("context", ""),
                "project_name": meeting_properties.project_name,  # プロジェクト名
                "project_description": meeting_properties.project_description,  # プロジェクトの説明
                "meeting_name": meeting_properties.meeting_name,  # 会議名
                "meeting_description": meeting_properties.meeting_description,  # 会議の説明
                "ai_role": meeting_properties.ai_role,  # AIの役割
                "maximum_time": meeting_properties.maximum_time,  # 会議の最大時間
                "tool_result": tool_result,  # 前回のツールの結果
            }
            
            if settings["langfuse"]:
                chain_res = chain.invoke(input_data, config={"callbacks": [self.langfuse_handler]},).additional_kwargs
            else:
                chain_res = chain.invoke(input_data).additional_kwargs

            jsonpath_expr = parse("$..function")
            res = [match.value for match in jsonpath_expr.find(chain_res)]

            results = {"context": "", "prompt": ""}  # デフォルト値  # デフォルト値

            for usefunc in res:
                try:
                    args = (
                        json.loads(usefunc["arguments"])
                        if isinstance(usefunc["arguments"], str)
                        else usefunc["arguments"]
                    )
                    args.update(
                        {"question": question, "meeting_id": meeting_id, "ideas": ideas}
                    )
                    print(f"● args: {args}")
                    print(type(args))

                    function = tools_model.functions[usefunc["name"]]
                    results[usefunc["name"]] = function.invoke(args)
                except (KeyError, json.JSONDecodeError) as e:
                    print(f"Error processing function {usefunc['name']}: {e}")
                    continue

            return results

        except Exception as e:
            print(f"Error in compose_data: {e}")
            return {"context": "", "prompt": ""}

    def chat(
        self,
        question: str,
        context: str,
        prompt: str,
        tool_result: dict,  # ツールの結果
        meeting_properties: MeetingProperties = MeetingProperties(),
    ) -> str:
        """
        チャットボットの応答を生成する

        Args:
            response (str): チャットボットの応答
            metadata (dict): メタデータ

        Returns:
            str: チャットボットの応答
        """
        chain: Runnable = (
            {
                "question": lambda x: x["question"],
                "tool_result": lambda x: x[
                    "tool_result"
                ],  # ツールの結果 dict -> str に変換した後
                "context": lambda x: x.get("context", ""),
                "prompt": lambda x: x.get("prompt", ""),
                "project_description": lambda x: x[
                    "project_description"
                ],  # プロジェクトの説明
                "meeting_description": lambda x: x["meeting_description"],  # 会議の説明
            }
            | self.prompt
            | self.stream_llm
            | StrOutputParser()
        )

        chat_response = chain.invoke(
            {
                "question": question,
                "tool_result": str(tool_result),
                "context": context,
                "prompt": prompt,
                "project_description": meeting_properties.project_description,
                "meeting_description": meeting_properties.meeting_description,
            }
        )
        return chat_response

    def invoke(
        self,
        question: str = "こんにちは",
        meeting_id: Optional[str] = "111",
        ideas: Optional[list] = ["idea a", "idea b"],
        meeting_properties: Optional[MeetingProperties] = MeetingProperties(),
    ) -> str:
        """
        チャットボットを起動する

        Args:
            question (str, optional): 質問. Defaults to "こんにちは".
            meeting_id (Optional[str], optional): ミーティングID. Defaults to "111".
            ideas (Optional[list], optional): アイデア. Defaults to ["idea a", "idea b"].

        Returns:
            str: チャットボットの応答
        """

        ideas = "\n・".join(ideas)  # アイデアをリストから文字列に変換

        # generate answer
        chain: Runnable = (
            {
                "question": lambda x: x["question"],
                "meeting_id": lambda x: x["meeting_id"],
                "ideas": lambda x: x["ideas"],
                "meeting_properties": lambda x: x["meeting_properties"],
                "composed_data": lambda x: self.compose_data(
                    question=x["question"],
                    meeting_id=x["meeting_id"],
                    ideas=x["ideas"],
                    tools_model=self.compose_tools,
                    prompt=self.compose_llm_prompt,
                    prompt_args={
                        "propaties": x["meeting_properties"],
                    },
                ),
            }
            | RunnableParallel(
                context=lambda x: x["composed_data"].get("QueryVectorstore", ""),
                prompt=lambda x: x["composed_data"]
                .get("ChoiceIntent", {})
                .get("prompt", ""),
                tool=lambda x: x["composed_data"]
                .get("ChoiceIntent", {})
                .get("tool", None),
                question=lambda x: x["question"],
                tool_result=lambda x: self.compose_data(
                    question=x["question"],
                    meeting_id=x["meeting_id"],
                    ideas=x["ideas"],
                    prompt=self.prompt,
                    tools_model=x["composed_data"]
                    .get("ChoiceIntent", {})
                    .get("tool", None),  # ここでtoolを指定！！
                    prompt_args={
                        "prompt": x["composed_data"]
                        .get("ChoiceIntent", {})
                        .get("prompt", ""),  # カテゴリに対応する追加プロンプト
                        "context": x["composed_data"].get(
                            "QueryVectorstore", ""
                        ),  # VectorStore 検索結果
                        "propaties": x["meeting_properties"],
                    },
                ),
                meeting_properties=lambda x: x["meeting_properties"],
            )
            | RunnableParallel(
                context=lambda x: x["context"],
                prompt=lambda x: x["prompt"],
                text_response=lambda x: self.chat(
                    question=x["question"],
                    context=x["context"],
                    prompt=x["prompt"],
                    tool_result=x["tool_result"],
                    meeting_properties=x["meeting_properties"],
                ),
                tool_result=RunnableLambda(lambda x: x["tool_result"]),
            )
        )

        result = chain.invoke(
            {
                "question": question,
                "meeting_id": meeting_id,
                "ideas": ideas,
                "meeting_properties": meeting_properties,
            },
            config={"callbacks": [self.langfuse_handler]},
        )

        answer = result["text_response"]  # チャットボットの応答を取得
        metadata = result["tool_result"]  # ツールの結果を取得

        print("● ツールの結果")
        print(metadata)

        return answer, metadata


if __name__ == "__main__":
    bot = LangchainBot()
    res = bot.invoke("どんな大学ですか？")

    print("● チャットボットの応答")
    print(res)
