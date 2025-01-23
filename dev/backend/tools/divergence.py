import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.vectorstore import VectorStore

# schema


class DivergenceIdea(BaseModel):
    """
    アイデアの発散

    Args:
        BaseModel(_type_): ベースモデル(Pydantic)
    """

    divergenced_idea: list = Field([""], description="カンマ区切りのアイデアリスト")


@tool("DivergenceIdea", args_schema=DivergenceIdea, return_direct=True)
def query_divergenceidea(divergenced_idea: str) -> str:
    """
    質問に対応するコンテキストを検索する
    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """
    return divergenced_idea
