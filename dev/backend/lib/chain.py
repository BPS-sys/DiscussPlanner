import os
from dotenv import load_dotenv
from typing import Optional

# langchain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool

# openai
from langchain_openai.chat_models import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings

# local
from lib.vectorstore import VectorStore
from lib.schema import FilePath, SearchContext, RetrieverConfig, TextSplitConfig

# load environment variables
load_dotenv("../.env")


@tool("search-context", args_schema=SearchContext, return_direct=True)
def searching_context(query: str, path: Optional[FilePath] = FilePath()) -> str:
    """
    質問に対応するコンテキストを検索する
    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """
    config = TextSplitConfig()  # テキスト分割手法の設定
    vectorstore_manager = VectorStore(path=path, split_config=config)
    vectorstore = vectorstore_manager.load()  # 保存先のパス
    retriever = vectorstore.as_retriever(**vars(RetrieverConfig))
    # search context
    context = ",".join([content.page_content for content in retriever.invoke(query)])
    return context


class LangchainBot:
    """
    Langchainを利用したチャットボット
    """

    def __init__(
        self,
        retriever_config: Optional[RetrieverConfig] = RetrieverConfig(),
    ):
        """
        初期化

        Args:
            retriever_config (Optional[RetrieverConfig], optional): リトリーバの設定. Defaults to None.
        """
        # config
        self.retriever_config = retriever_config

        # model
        self.compose_llm = ChatOpenAI(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model=os.getenv("LLM_MODEL"),
        )
        self.stream_llm = ChatOpenAI(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model=os.getenv("LLM_MODEL"),
        )
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

        # # vectorstore
        # self.vectorstore_manager = VectorStore()
        # self.vectorstore = self.vectorstore_manager.load("../../data/vectorstore")
        # self.retriever = self.vectorstore.as_retriever(**vars(self.retriever_config))

        # stream_llm prompt
        self.system_prompt = SystemMessagePromptTemplate.from_template(
            """
            以下の`context`の情報に基づいて、質問に回答してください。
            また`context`に関係のない質問は無視してください。

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

        self.tools = [SearchContext]

    def searching_context_with_query(self, question: str) -> str:
        """
        質問からクエリを生成する

        Args:
            question (str): 質問

        Returns:
            str: クエリ
        """
        llm_with_tools = self.compose_llm.bind_tools(self.tools)

        # generate context
        res = llm_with_tools.invoke(question).tool_calls
        contexts = []
        for r in res:
            args = r["args"]
            contexts.append(searching_context.invoke(args))
        context = ",".join(contexts)  # ここで結合している
        return context

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
                "context": self.searching_context_with_query,
                "question": RunnablePassthrough(),
            }
            | self.prompt
            | self.stream_llm
            | StrOutputParser()
        )
        answer = chain.invoke(question)
        return answer


if __name__ == "__main__":
    bot = LangchainBot()
    res = bot.invoke("どんな大学ですか？")

    print("● チャットボットの応答")
    print(res)
