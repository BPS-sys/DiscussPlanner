import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.vectorstore import VectorStore

# schema

class ConvergenceIdea(BaseModel):
    """
    アイデアの収束をすることができる

    Args:
        BaseModel(_type_): ベースモデル(Pydantic)
    """
    query: str = Field(..., description="収束済みアイデアのリスト")

@tool("ConvergenceIdea", args_schema=ConvergenceIdea, return_direct=True)
def query_convergenceidea(query: str) -> str:
    """
    アイデアの収束をするツール

    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """
    return query

