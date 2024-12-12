from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Union
import uvicorn

app = FastAPI()

class Chat(BaseModel):
    message: str

    class Config:
        json_schema_extra = {
            "chat": {
                "message": "アイデアを考えてください。"
            }
        }

class InputItem(BaseModel):
    chat: Chat

@app.post("/chat/")
async def create_chat(chat: InputItem):
    results = {
        "chat": {
            "message": chat.message
        }
    }
    return results


if __name__ == "__main__":
    uvicorn.run("Q1_fastAPI:app", host="127.0.0.1", port=3000, reload=True)
