from dotenv import load_dotenv

# local
from lib.vectorstore import VectorStore
from lib.chain import LangchainBot
from lib.schema import FilePath, TextSplitConfig

load_dotenv()

if __name__ == "__main__":
    # path = FilePath()

    # with open(path.input_document, "r", encoding="utf-8") as f:
    #     text = f.read()

    # # create vectorstore
    # config = TextSplitConfig()  # テキスト分割手法の設定

    # vs = VectorStore(path=path, split_config=config)
    # vs.load()

    # execute chatbot
    bot = LangchainBot()
    res = bot.invoke("大学はどんな大学ですか？")

    print("● チャットボットの応答")
    print(res)
