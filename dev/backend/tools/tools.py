import os
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel, Field
from langchain_core.tools import tool


# --- tool functions import ---
from tools.category import ArgsCategory, tool_category
from tools.query import QueryVectorstore, query_vectorstore


# tools

class QandATools(BaseModel):
    """
    AIへ質問がされた際に回答を返す際用いるツール
    """
    tools: list = Field([QueryVectorstore], description="ツールのリスト")
    functions: dict = Field({
        "QueryVectorstore": query_vectorstore
    }, description="ツールの関数")