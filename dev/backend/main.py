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

firestore_api = FirestoreAPI()


@app.post("/chat/{meeting_id}")
async def create_chat(meeting_id: str, input_item: InputChatItem) -> OutputChatItem:
    """
    質問に対してチャットボットが応答するエンドポイント

    Args:
        input_item (InputItem): チャットに対するリクエストの入力データ

    Returns:
        dict: チャットに対するリクエストの出力データ
    """
    print("session: ", meeting_id)

    bot = LangchainBot()
    ans, metadata = bot.invoke(
        question=str(input_item.chat.message),
        meeting_id=meeting_id,
        ideas=input_item.details.ideas,
        meeting_properties=input_item.propaties,
    )
    output_item = OutputChatItem(chat=Chat(message=ans), metadata=metadata)
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


@app.post("/FB/WriteUserId")
async def FBWriteUserId(user_item: UserItem):
    """
    ユーザーIDを基にユーザー情報テンプレートをfiresotreに書き込むためのエンドポイント

    args:
        user_item(UserItem): ユーザーID階層までをみるために必要なデータ
    """
    if user_item.user_id:
        firestore_api.setup_user_account(user_item.user_id)


@app.post("/FB/WriteProjectId")
async def FBWriteProjectId(project_item: ProjectItem):
    """
    プロジェクトIDを基にプロジェクト情報テンプレートをfiresotreに書き込むためのエンドポイント

    args:
        project_item(ProjectItem): プロジェクトID階層までをみるために必要なデータ
    """
    user_id = project_item.user_id
    project_id = project_item.project_id
    project_name = project_item.project_name
    project_description = project_item.project_description
    ai_role = project_item.ai_role
    if project_id:
        firestore_api.setup_project(
            user_id=user_id,
            project_id=project_id,
            project_name=project_name,
            project_description=project_description,
            ai_role=ai_role
        )


@app.post("/FB/WriteMeetingId")
async def FBWriteMeetingId(meeting_item: MeetingItem):
    """
    ミーティングIDを基にミーティング情報テンプレートをfiresotreに書き込むためのエンドポイント

    args:
        meeting_item(MeetingItem): ミーティングID階層までをみるために必要なデータ
    """
    user_id = meeting_item.user_id
    project_id = meeting_item.project_id
    meeting_id = meeting_item.meeting_id
    meeting_name = meeting_item.meeting_name
    meeting_description = meeting_item.meeting_description
    if meeting_id:
        firestore_api.setup_meeting(
            user_id=user_id,
            project_id=project_id,
            meeting_id=meeting_id,
            meeting_name=meeting_name,
            meeting_description=meeting_description,
        )


@app.post("/FB/GetALLProjectId")
async def FBALLProjectId(request: RequestUserId):
    """
    FireStoreからユーザーIDに対応した、全プロジェクトIDを返すエンドポイント

    args:
        user_id(str): ユーザーID

    returns:
        (dict) :全プロジェクトID
    """
    user_id = request.user_id
    docs = firestore_api.get_allproject_id(user_id=user_id)
    l = []
    for doc in docs:
        l.append(doc.id)
    return {"ALLProjectId": l}


@app.post("/FB/GetALLMeetingId")
async def FBALLMeetingId(request: RequestUserIdAndProjectId):
    """
    FireStoreからプロジェクトIDに対応した、全ミーティングIDを返すエンドポイント

    args:
        user_id(str): ユーザーID
        project_id(str): プロジェクトID

    returns:
        (dict) :全ミーティングID
    """
    docs = firestore_api.get_allmeeting_id(
        user_id=request.user_id,
        project_id=request.project_id,
    )
    l = []
    for doc in docs:
        l.append(doc.id)
    return {"ALLMeetingId": l}


@app.post("/FB/GetProjectInfoFromId")
async def FBGetProjectInfoFromId(request: RequestUserIdAndProjectId):
    """
    ユーザーIDとプロジェクトIDからプロジェクト情報を取得するためのエンドポイント

    args:
        user_id(str): ユーザーID
        project_id(str): プロジェクトID

    returns:
        (dict): プロジェクト情報一覧
    """
    user_id = request.user_id
    project_id = request.project_id
    docs = firestore_api.get_project_info_from_id(
        user_id=user_id,
        project_id=project_id,
    )
    return docs.to_dict()


@app.post("/FB/GetMeetingInfoFromId")
async def FBGetMeetingInfoFromId(request: RequestUserAllItem):
    """
    ユーザーID、プロジェクトID、ミーティングIDからミーティング情報を取得するためのエンドポイント

    args:
        request(RequestUserAllItem): ユーザーID、プロジェクトID、ミーティングIDが含まれる情報

    returns:
        (dict): ミーティング情報一覧
    """
    docs = firestore_api.get_meeting_info_from_id(
        user_id=request.user_id,
        project_id=request.project_id,
        meeting_id=request.meeting_id,
    )
    return docs.to_dict()


@app.post("/InitializeMeeting")
async def InitializeMeeting(
    project_name: str,
    project_description: str,
    meeting_name: str,
    meeting_description: str,
    AIsRole: str,
):
    """
    会議のスケジュールを組むためのエンドポイント

    args:
        project_name(str): プロジェクト名
        project_description(str): プロジェクトの説明
        meeting_name(str): ミーティング名
        meeting_description(str): ミーティングの説明
        AIsRole(str): AIの役割

    returns:
        (dict): タスクリストと時間
    """
    return {
        "TaskList": [
            {"name": "aaa", "metadata": {"time": 300}},
            {"name": "aaa", "metadata": {"time": 300}},
        ]
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True, log_level="debug")
