import os
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel, Field
from langchain_core.tools import tool


# --- tool functions import ---
from tools.query import QueryVectorstore, query_vectorstore
from tools.schedule_timetable import (
    ScheduleConetnts,
    ScheduleTimeTable,
    schedule_timetable,
)

from tools.category import ChoiceIntent, query_category
from tools.divergence import DivergenceIdea, query_divergenceidea
from tools.convergence import ConvergenceIdea, query_convergenceidea
from tools.summaryinformation import SummaryInformation, query_summaryinformation
from tools.answertoquestion import AnswerToQuestion, query_answertoquestion


# tools


class QandATools(BaseModel):
    """
    AIへ質問がされた際に回答を返す際用いるツール
    """

    tools: list = Field([QueryVectorstore, ChoiceIntent], description="ツールのリスト")
    functions: dict = Field(
        {"QueryVectorstore": query_vectorstore, "ChoiceIntent": query_category},
        description="ツールの関数",
    )


class DivergenceIdeaTools(BaseModel):
    """
    アイデアの発散
    """

    tools: list = Field([DivergenceIdea], description="カンマ区切りのリスト")
    functions: dict = Field(
        {"DivergenceIdea": query_divergenceidea}, description="アイデア発散の関数"
    )


class ConvergenceIdeaTools(BaseModel):
    """
    アイデアの収束
    """

    tools: list = Field([ConvergenceIdea], description="収束されたアイデアリスト")
    functions: dict = Field(
        {"ConvergenceIdea": query_convergenceidea}, description="アイデア収束の関数"
    )


class SummaryInformationTools(BaseModel):
    """
    アイデアの要約
    """

    tools: str = Field([SummaryInformation], description="要約された情報")
    functions: dict = Field(
        {"SummaryInformation": query_summaryinformation},
        description="情報を要約する関数",
    )


class AnswerToQuestionTools(BaseModel):
    """
    質問への回答
    """

    tools: str = Field([AnswerToQuestion], description="回答")
    functions: dict = Field(
        {"AnswerToQuestion": query_answertoquestion}, description="質問へ回答する関数"
    )

    tools: list = Field([QueryVectorstore], description="ツールのリスト")
    functions: dict = Field(
        {"QueryVectorstore": query_vectorstore}, description="ツールの関数"
    )


class ScheduleTimeTableTools(BaseModel):
    """
    ミーティングで話し合う内容をスケジュールを作成するツール
    """

    tools: list = Field([ScheduleTimeTable], description="ツールのリスト")
    functions: dict = Field(
        {"ScheduleTimeTable": schedule_timetable}, description="ツールの関数"
    )
