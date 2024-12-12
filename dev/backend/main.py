from dotenv import load_dotenv

# local
from lib.vectorstore import VectorStore
from lib.chain import LangchainBot
from lib.schema import FilePath, TextSplitConfig

load_dotenv()

if __name__ == "__main__":

    # execute chatbot
    bot = LangchainBot()
    res = bot.invoke("大学はどんな大学ですか？")

    print("● チャットボットの応答")
    print(res)
