import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---

# ここにtoolデコレータを使って関数を定義してください

class ArgsCategory(BaseModel):
    """
    カテゴリに関する引数のスキーマ
    """
    category: str = Field(..., description="カテゴリ")

@tool("category", args_schema=ArgsCategory, return_direct=True)
def tool_category(category: str) -> str:
    """
    カテゴリ情報から適切なプロンプトを返す
    """
    
    # ここに処理を記載
    
    return "私は適切なプロンプトです。"