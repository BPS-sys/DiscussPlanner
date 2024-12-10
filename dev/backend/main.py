from dotenv import load_dotenv
from pydantic import BaseModel, Field

# local
from lib.vectorstore import VectorStore
from lib.chain import LangchainBot


load_dotenv()

class FilePath(BaseModel):
    """
    ファイルのパス
    Args:
        BaseModel (_type_): ベースモデル（Pydantic）
    """
    vs_input: str = Field('./data/test.txt', description="vectorstoreの入力ファイルのパス")
    vs_savepath: str = Field('./data/vectorstore', description="vectorstoreを保存するフォルダのパス")
    
if __name__ == "__main__":
    path = FilePath()
    
    with open(path.vs_input, "r") as f:
        text = f.read()    
        
    input(text[:5]) # 確認
    
    vs = VectorStore()
    
    # create vectorstore
    config = vs.TextSplitConfig() # テキスト分割手法の設定
    vs.create(split_config=config, input_text=text)
    vs.save(path.vs_savepath) # 保存先のパス
    
    # execute chatbot
    bot = LangchainBot()
    res = bot.invoke("大阪国際工科専門職大学はどんな大学ですか？")
    
    print("● チャットボットの応答")
    print(res)