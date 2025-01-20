import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.vectorstore import VectorStore

# schema

class SummaryInfomation(BaseModel):
    """
    情報を要約できる

    Args:
        BaseModel(_type_): ベースモデル(Pydantic)
    """
    query: str = Field(..., description="要約済みの文章")

@tool("SummaryInformation", args_schema=SummaryInfomation, return_direct=True)
def query_summaryinformation(query: str) -> str:
    """
    与えられた情報を要約するツール

    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """
    return query
