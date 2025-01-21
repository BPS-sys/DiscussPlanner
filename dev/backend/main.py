import os
from dotenv import load_dotenv
import requests
import base64
from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Union
import uvicorn
from logging import getLogger

# local
from lib.vectorstore import VectorStore, VectorStoreQdrant
from lib.chain import LangchainBot
from lib.schema import FilePath, TextSplitConfig
from api.schema import *
from api.notion.schema import *
from api.notion.func import NotionAPI
from api.firebase.func import FirestoreAPI

load_dotenv()
app = FastAPI()
# CORSを回避するための設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = getLogger(__name__)


@app.post("/chat/{meeting_id}")
async def create_chat(meeting_id: str, input_item: ChatItem) -> ChatItem:
    """
    質問に対してチャットボットが応答するエンドポイント

    Args:
        input_item (InputItem): チャットに対するリクエストの入力データ

    Returns:
        dict: チャットに対するリクエストの出力データ
    """
    print("session: ", meeting_id)

    bot = LangchainBot()
    input_message = str(input_item.chat.message)
    ans = bot.invoke(input_message)

    output_item = ChatItem(chat=Chat(message=ans))
    print(output_item)
    return output_item


@app.post("/minutes/{meeting_id}")
async def create_minutes(meeting_id: str, input_item: MinutesItem) -> AssistantState:
    """
    議事録を受取るエンドポイント

    Args:
        input_item (MinutesItem): 議事録を受取るリクエストの入力データ

    Returns:
        AssistantState: アシスタントの状態
    """
    # init
    vs = VectorStore(path=FilePath(), split_config=TextSplitConfig())
    vs.load()  # データベースの読み込み

    print("session: ", meeting_id)

    # vectorstoreの更新
    input_text = input_item.text
    vs = VectorStoreQdrant(split_config=TextSplitConfig())

    try:
        vs.load(meeting_id=meeting_id)
    except:
        vs.create(meeting_id=meeting_id)
        vs.add_testdata(meeting_id=meeting_id, datapath="./data/test.txt")
        vs.load(meeting_id=meeting_id)

    vs.update(
        meeting_id=meeting_id, input_text=input_text
    )  # データベースの更新と保存を行う

    # タイマー処理
    minits = len(input_item.text)
    result = AssistantState(face="angry", timer=TimerState(flag=True, time=minits))

    return result


@app.post("/auth/notion/{user_id}/{project_id}", response_model=None)
async def notion_auth(
    user_id: str, project_id: str, input_item: NotionAuthItem
) -> NotionItem:
    """
    NotionのOAuth認証を行うエンドポイント
    受け取ったデータを記録し、後に利用できるようにする

    Args:
        input_item (NotionItem): Notionの認証を行うリクエストの入力データ

    Returns:
        NotionItem: Notionの認証を行うリクエストの出力データ
    """
    # print("session: ", meeting_id)
    print(input_item.code)

    client_id = os.getenv("NOTION_CLIENT_ID")
    client_secret = os.getenv("NOTION_CLIENT_SECRET")
    encoded_credentials = base64.b64encode(
        f"{client_id}:{client_secret}".encode()
    ).decode()

    # ここで認証処理を行う
    try:
        code = input_item.code
        res = requests.post(
            url="https://api.notion.com/v1/oauth/token",
            headers={
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/json",
            },
            json={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": os.getenv("NOTION_REDIRECT_URI"),
            },
            timeout=30,
        )
    except Exception as e:
        logger.error("Error: %s", str(e))
        raise HTTPException(status_code=500, detail="Notionの認証に失敗しました") from e
    # print(res.json())

    res_json = res.json()
    if res.status_code != 200:
        raise HTTPException(
            status_code=500, detail=f"Notionの認証に失敗しました{res.headers}"
        )

    notion_item = NotionItem(
        access_token=res_json["access_token"],
        token_type=res_json["token_type"],
        bot_id=res_json["bot_id"],
        workspace_name=res_json["workspace_name"],
        workspace_icon=res_json["workspace_icon"],
        workspace_id=res_json["workspace_id"],
        owner=res_json["owner"],
        duplicated_template_id=res_json["duplicated_template_id"],
        request_id=res_json["request_id"],
    )

    # FirestoreにNotionの認証情報を保存
    firestore_api = FirestoreAPI()
    firestore_api.insert_notion_api_data(
        user_id=user_id, project_id=project_id, notion_item=notion_item
    )

    return notion_item


@app.get("/get_notion_item/{meeting_id}")
async def get_notion_item(meeting_id: str) -> NotionItem:
    """
    Firebaseに保存されているNotion情報をmeeting_idを用いて取得するエンドポイント

    Args:
        meeting_id (str): 会議ID

    Returns:
        NotionItem: Notionの認証情報
    """
    print("session: ", meeting_id)

    notion_item = NotionItem(
        access_token="",
        token_type="",
        bot_id="",
        workspace_name="",
        workspace_icon="",
        workspace_id="",
        owner=NotionItemOwner(
            type="",
            user=NotionItemOwnerUser(
                object="",
                id="",
                name="",
                avatar_url="",
                type="",
                person={},
            ),
        ),
        duplicated_template_id="",
        request_id="",
    )
    return notion_item


# debug
@app.get("/")
async def read_root():
    """
    FastAPIのルートエンドポイント（動作確認用）

    Returns:
        _type_: status message
    """
    return {"message": "Hello World"}


@app.get("/test-cors")
async def test_cors():
    """
    CORSの動作確認用エンドポイント

    Returns:
        _type_: status message
    """
    return {"message": "CORS is working"}


firestore_api = FirestoreAPI()


@app.post("/test/notion/write_db/{user_id}/{project_id}")
async def test_notion_write_db(
    minutes_data: MinutesContentsElement, user_id: str, project_id: str
) -> dict:
    """
    Notionのデータをデータベースに書き込むエンドポイント

    Args:
        project_id (str): プロジェクトID
        minutes_data (MinutesContentsElement): 議事録のデータ

    Returns:
        dict: Notion APIのレスポンス
    """
    print(minutes_data)
    # b01ADn1oC6B41T57lqP6
    notion_item = firestore_api.get_notion_api_data(
        user_id=user_id, project_id=project_id
    )  # project_idを用いてFirestoreからNotionの認証データを取得

    print(notion_item)

    notion_api = NotionAPI(notion_item=notion_item)

    # Notionにデータを送信
    res, status_code = notion_api.add_database_contents(
        insert_data=InsertDataSchema(
            properties_name=MinutesPropertiesNameElement(),  # プロパティ名（固定値）
            minutes=minutes_data,
        )
    )
    print(
        "Notion API: ", status_code
    )  # データが書き込めたかどうかのステータスコードを表示

    return res


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True, log_level="debug")
