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
    metadata: dict = Field(default_factory=dict)


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


class NotionAuthItem(BaseModel):
    """
    '{host}/auth/notion/{meetingId}' にて受け取る一時キー情報を格納するためのデータ

    Args:
        BaseModel (_type_): ベースモデル
    """

    code: str  # 一時キー


class NotionItemOwnerUser(BaseModel):
    """
    Notion API を利用する際に用いるデータのオーナーのユーザー情報
    """

    object: str = Field(default="", description="オブジェクトの種類")
    id: str = Field(default="", description="ユーザーID")
    name: str = Field(default="", description="ユーザー名")
    avatar_url: str = Field(default="", description="ユーザーアバターのURL")
    type: str = Field(default="", description="ユーザーの種類")
    person: dict = Field(
        default={}, description="その他ユーザー情報"
    )  # 例：{"email": "mail@example.com"}


class NotionItemOwner(BaseModel):
    """
    Notion API を利用する際に用いるデータのオーナー情報
    """

    type: str = Field(default="", description="オーナーの種類")
    user: NotionItemOwnerUser = Field(NotionItemOwnerUser(), description="ユーザー情報")


class NotionItem(BaseModel):
    """
    Notion API を利用する際に用いる
    Notionの認証情報を格納するためのデータ

    Args:
        BaseModel (_type_): ベースモデル
    """

    access_token: str = Field(
        default="", description="NotionAPIにアクセスする為の認証トークン"
    )
    token_type: str = Field(default="", description="トークンの種類")
    workspace_name: str = Field(
        default="", description="認証されたワークスペースの名前"
    )
    workspace_icon: str = Field(
        default="", description="認証されたワークスペースのアイコン"
    )
    workspace_id: str = Field(default="", description="認証されたワークスペースのID")
    owner: NotionItemOwner = Field(NotionItemOwner(), description="オーナー情報")
    duplicated_template_id: str = Field(
        default="", description="複製されたテンプレートのID"
    )
    request_id: str = Field(default="", description="リクエストID")


class MinutesPropertiesNameElement(BaseModel):
    """
    議事録のIDを格納するためのデータのスキーマ
    """

    title: str = Field("タイトル", description="データベースのタイトルの名前")
    agenda: str = Field("議題", description="データベースの議題の名前")
    summary: str = Field("Summary", description="データベースのサマリの名前")


class MinutesContentsElement(BaseModel):
    """
    議事録の要素を格納するためのデータのスキーマ
    """

    title: str = Field(..., description="タイトル")
    agenda: str = Field(..., description="議題")
    summary: str = Field(..., description="サマリ")
    body: str = Field(..., description="本文")


class InsertDataSchema(BaseModel):
    """
    Notion API で用いる
    議事録の保存のために共有するデータのスキーマ

    Args:
        BaseModel (_type_): ベースモデル
    """

    # properties_name
    properties_name: MinutesPropertiesNameElement = Field(
        MinutesPropertiesNameElement(), description="データベースのプロパティ名"
    )
    # contents
    minutes: MinutesContentsElement = Field(..., description="議事録の要素")
