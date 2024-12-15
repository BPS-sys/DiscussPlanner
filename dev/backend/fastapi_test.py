from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/send-chatdata")
async def process_transcript(request: Request):
    data = await request.json()
    transcript = data.get("transcript", "")
    # ここでtranscriptを処理
    print(f"Received transcript: {transcript}")
    return {"message": "Transcript received", "transcript": transcript}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)