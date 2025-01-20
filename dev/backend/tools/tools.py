import os
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel, Field
from langchain_core.tools import tool


# --- tool functions import ---
from tools.query import QueryVectorstore, query_vectorstore

from tools.category import query_category
from tools.divergence import DivergenceIdea, query_divergenceidea
from tools.convergence import ConvergenceIdea, query_convergenceidea
from tools.summaryinformation import SummaryInfomation, query_summaryinformation
from tools.answertoquestion import AnswerToQuestion, query_answertoquestion


# tools

class QandATools(BaseModel):
    """
    AIへ質問がされた際に回答を返す際用いるツール
    """
    tools: list = Field([QueryVectorstore, query_category], description="ツールのリスト")
    functions: dict = Field({
        "QueryVectorstore": query_vectorstore,
        "ChoiceIntent": query_category
    }, description="ツールの関数")

class DivergenceIdeaTools(BaseModel):
    """
    アイデアの発散
    """
    tools: list = Field([DivergenceIdea], description="カンマ区切りのリスト")
    functions: dict = Field({
        "DivergenceIdea": query_divergenceidea
    }, description="アイデア発散の関数")

class ConvergenceIdeaTools(BaseModel):
    """
    アイデアの収束
    """
    tools: list = Field([ConvergenceIdea], description="収束されたアイデアリスト")
    function: dict = Field({
        "ConvergenceIdea": query_convergenceidea
    }, description="アイデア収束の関数")

class SummaryInformationTools(BaseModel):
    """
    アイデアの要約
    """
    tools: str = Field([SummaryInfomation], description="要約された情報")
    function: dict = Field({
        "SummaryInformation": query_summaryinformation
    }, description="情報を要約する関数")

class AnswerToQuestionTools(BaseModel):
    """
    質問への回答
    """
    tools: str = Field([AnswerToQuestion], description="回答")
    function: dict = Field({
        "AnswerToQuestion": query_answertoquestion
    }, description="質問へ回答する関数")