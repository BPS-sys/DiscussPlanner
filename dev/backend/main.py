from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Union
import uvicorn

# local
from lib.vectorstore import VectorStore
from lib.chain import LangchainBot
from lib.schema import FilePath, TextSplitConfig

load_dotenv()
app = FastAPI()


class Chat(BaseModel):
    message: str

    class Config:
        json_schema_extra = {"chat": {"message": "アイデアを考えてください。"}}


class InputItem(BaseModel):
    chat: Chat


bot = LangchainBot()


@app.post("/chat/")
async def create_chat(input_item: InputItem):
    input_message = str(input_item.chat.message)
    print(f"input_message: {input_message}")
    res = bot.invoke(input_message)

    results = {"chat": {"message": res}}
    return results


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000, reload=True, log_level="debug")
