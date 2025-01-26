import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.vectorstore import VectorStore

# schema


class AnswerToQuestion(BaseModel):
    """
    与えられた質問に回答できる

    Args:
        BaseModel(_type_): ベースモデル(Pydantic)
    """

    query: str = Field(..., description="回答文")


@tool("AnswerToQuestion", args_schema=AnswerToQuestion, return_direct=False)
def query_answertoquestion(query: str) -> str:
    """
    質問に回答できる

    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """
    return query
