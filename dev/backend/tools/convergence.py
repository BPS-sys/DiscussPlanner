import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.vectorstore import VectorStore


# schema
class ConvergenceIdeaItem(BaseModel):
    """
    ※ 現在は利用しない。
    アイデアの収束をすることができる

    Args:
        BaseModel(_type_): ベースモデル(Pydantic)
    """

    idea_name: str = Field(..., description="アイデア名")
    idea_detail: str = Field(..., description="アイデアの詳細")


class ConvergenceIdea(BaseModel):
    """
    アイデアの収束をすることができる

    Args:
        BaseModel(_type_): ベースモデル(Pydantic)
    """

    converged_ideas: list = Field([""], description="収束済みアイデアのリスト")


@tool("ConvergenceIdea", args_schema=ConvergenceIdea, return_direct=True)
def query_convergenceidea(converged_ideas: list) -> str:
    """
    アイデアの収束をするツール

    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """
    # ideas = " , ".join(converged_ideas)
    return converged_ideas
