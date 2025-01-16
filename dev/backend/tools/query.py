import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.vectorstore import VectorStore

# schema
class QueryVectorstore(BaseModel):
    """
    クエリに関する引数のスキーマ
    """
    query: str = Field(..., description="クエリ文")

@tool("QueryVectorstore", args_schema=QueryVectorstore, return_direct=True)
def query_vectorstore(query: str, path: Optional[FilePath] = FilePath()) -> str:
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