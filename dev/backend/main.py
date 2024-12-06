from dotenv import load_dotenv
from lib.vectorstore import *
from lib.chain import *

load_dotenv()

if __name__ == "__main__":
    bot = LangchainBot()
    res = bot.invoke("大阪国際工科専門職大学はどんな大学ですか？")
    
    print("● チャットボットの応答")
    print(res)