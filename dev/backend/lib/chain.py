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
from langchain_core.runnables import Runnable, RunnablePassthrough, RunnableParallel
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
            

            context:
            {context}
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
                    メタデータと質問からユーザーの意図を汲み取って、適切な回答を生成してください。
                    
                    質問からコンテキストを検索するための文章を提供してください。
                    コンテキストに含まれる文章は説明調の文章であるる為、下記の例を参考にしてください。
                    
                    下記に例を示します。
                    例: 
                    質問: `A`とは何のことを示しますか？
                    output: `A`はBBBのことを示します。BBBはCCCの事です。
                    
                    // メタデータ //
                    meeting_id: {meeting_id}
                    ideas: {ideas}
                    """
                ),
                HumanMessagePromptTemplate.from_template("{question}"),
            ]
        )

    def compose_data(self, question: str, meeting_id: str, ideas: list) -> dict:
        """
        回答前に用意する必要があるデータを生成、処理する

        Args:
            question (str): 質問

        Returns:
            dict: データ
        """
        llm_with_tools = self.compose_llm.bind_tools(self.compose_tools.tools)

        # generate context
        chain: Runnable = (
            {
                "question": itemgetter("question"),
                "meeting_id": itemgetter("meeting_id"),
                "ideas": itemgetter("ideas"),
            }
            | self.compose_llm_prompt
            | llm_with_tools
        )
        
        chain_res = chain.invoke(
            {
                "question": question,
                "meeting_id": meeting_id,
                "ideas": ideas
            }
        ).additional_kwargs # コンテキスト生成結果を取得
        
        jsonpath_expr = parse('$..function') # jsonpathの式を定義
        res = [match.value for match in jsonpath_expr.find(chain_res)]
        
        print("● res")
        print(res)

        results: dict = {}
        for usefunc in res:
            print("● usefunc")
            print(usefunc)
            print(usefunc["arguments"])
            args = json.loads(usefunc["arguments"])
            print("● args")
            print(args)
            print(type(args))
            function = self.compose_tools.functions[usefunc["name"]]
            functon_result = {usefunc["name"]: function.invoke(args)}
            results.update(functon_result)  # 実行結果を追加

        return results

    def invoke(
        self,
        question: str = "こんにちは",
        meeting_id: Optional[str] = "111",
        ideas: Optional[list] = ["idea a", "idea b"],
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
            RunnablePassthrough.assign(
                composed_data=lambda x: self.compose_data(
                    question = x['question'],
                    meeting_id = x['meeting_id'],
                    ideas = x['ideas']
                )
            )
            | RunnableParallel(
                context=lambda x: x['composed_data'].get("QueryVectorstore", ""),
                prompt=lambda x: x['composed_data'].get("ChoiceIntent", {}).get("prompt", ""),
                tool=lambda x: x['composed_data'].get("ChoiceIntent", {}).get("tool", None),
                question=lambda x: x['question'],
            )
            | self.prompt
            | self.stream_llm
            | StrOutputParser()
        )
        answer = chain.invoke(
            {
                "question": question,
                "meeting_id": meeting_id,
                "ideas": ideas
            },
            config={"callbacks": [self.langfuse_handler]}
        )
        return answer


if __name__ == "__main__":
    bot = LangchainBot()
    res = bot.invoke("どんな大学ですか？")

    print("● チャットボットの応答")
    print(res)
