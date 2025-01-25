import os
from dotenv import load_dotenv
from typing import Optional
import time

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---


# schema
class ScheduleConetnts(BaseModel):
    """
    スケジュールの内容に関する引数のスキーマ
    """

    topic: str = Field(..., description="トピック")
    description: str = Field(..., description="本フェーズで行う事の説明")
    duration_minutes: int = Field(..., description="フェーズの所要時間（minutes）")


class ScheduleTimeTable(BaseModel):
    """
    ミーティングで話し合う内容をスケジュールを作成する
    """

    timetable: list[ScheduleConetnts] = Field(..., description="スケジュールの内容")


@tool("ScheduleTimeTable", args_schema=ScheduleTimeTable, return_direct=True)
def schedule_timetable(timetable: list[ScheduleConetnts] = None) -> str:
    """
    質問に対応するコンテキストを検索する
    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """

    return timetable
