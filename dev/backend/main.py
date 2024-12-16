from dotenv import load_dotenv
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Union
import uvicorn

# local
from lib.vectorstore import VectorStore
from lib.chain import LangchainBot
from lib.schema import FilePath, TextSplitConfig
from api.schema import *

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
    print("session: ", meeting_id)

    # vectorstoreの更新
    input_text = input_item.text
    vs = VectorStore(path=FilePath(), split_config=TextSplitConfig())
    vs.load()
    vs.update(input_text=input_text)  # データベースの更新と保存を行う
    # タイマー処理
    minits = len(input_item.text)
    result = AssistantState(face="angry", timer=TimerState(flag=True, time=minits))
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True, log_level="debug")
