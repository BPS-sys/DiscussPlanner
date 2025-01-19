import os
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel, Field
from jsonpath_ng import parse

# langchain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool
from langfuse.callback import CallbackHandler

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
    ):
        """
        初期化

        Args:
            retriever_config (Optional[RetrieverConfig], optional): リトリーバの設定. Defaults to None.
        """
        # tools
        self.compose_tools = compose_tools

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
            以下の`context`の情報に基づいて、質問に回答してください。
            

            context:
            {data}
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
                    質問からコンテキストを検索するための文章を提供してください。
                    コンテキストに含まれる文章は説明調の文章であるる為、下記の例を参考にしてください。
                    
                    下記に例を示します。
                    例: 
                    質問: `A`とは何のことを示しますか？
                    output: `A`はBBBのことを示します。BBBはCCCの事です。
                    """
                ),
                HumanMessagePromptTemplate.from_template("{question}"),
            ]
        )

    def compose_data(self, question: str) -> str:
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
                "question": RunnablePassthrough(),
            }
            | self.compose_llm_prompt
            | llm_with_tools
        )
        chain_res = chain.invoke(question).additional_kwargs # コンテキスト生成結果を取得
        
        jsonpath_expr = parse('$..function') # jsonpathの式を定義
        res = [match.value for match in jsonpath_expr.find(chain_res)]

        results: dict = {}
        for usefunc in res:
            args = usefunc["arguments"]
            function = self.compose_tools.functions[usefunc["name"]]
            functon_result = {usefunc["name"]: function.invoke(args)}
            results.update(functon_result)  # 実行結果を追加

        return results

    def invoke(self, question: str = "こんにちは") -> str:
        """
        チャットボットを起動する

        Args:
            query (str, optional): ユーザーの入力. Defaults to "こんにちは".

        Returns:
            str: チャットボットの応答
        """

        # generate answer
        chain: Runnable = (
            {
                "data": self.compose_data,
                "question": RunnablePassthrough(),
            }
            | self.prompt
            | self.stream_llm
            | StrOutputParser()
        )
        answer = chain.invoke(question, config={"callbacks": [self.langfuse_handler]})
        return answer


if __name__ == "__main__":
    bot = LangchainBot()
    res = bot.invoke("どんな大学ですか？")

    print("● チャットボットの応答")
    print(res)
