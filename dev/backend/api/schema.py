from pydantic import BaseModel, Field


#
# Assistantの状態を表すデータのスキーマ
#
class TimerState(BaseModel):
    """
    Timerの状態を表すデータのスキーマ

    Args:
        BaseModel (_type_): ベースモデル
    """

    flag: bool = Field(default=False, description="タイマーの状態管理フラグ")
    time: int = Field(default=0, description="タイマーの時間")


class AssistantState(BaseModel):
    """
    Assistantの状態を表すデータのスキーマ

    Args:
        BaseModel (_type_): ベースモデル
    """

    face: str
    timer: TimerState


#
# /chat/ に対するリクエストの入力データのスキーマ
#
class Chat(BaseModel):
    """
    '{host}/chat/' に対するチャットに対するリクエストの入力データのスキーマ

    Args:
        BaseModel (_type_): ベースモデル
    """

    message: str

    class Config:
        """
        モデルの設定
        """

        json_schema_extra = {"chat": {"message": "アイデアを考えてください。"}}

class Idea(BaseModel):
    """
    アイデアスキーマ

    Args:
        BaseModel (_type_): ベースモデル
    """
    ideas: list

class ChatItem(BaseModel):
    """
    '{host}/chat/' に対するリクエストの入力データのスキーマ

    Args:
        BaseModel (_type_): ベースモデル
    """

    chat: Chat
    details: Idea

#
# /minutes/ に対するリクエストの入力データのスキーマ
#
class MinutesItem(BaseModel):
    """
    '{host}/minutes/' に対するリクエストの入力データのスキーマ

    Args:
        BaseModel (_type_): ベースモデル
    """

    text: str
