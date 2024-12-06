import os
from typing import Optional
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_core.documents import Document
from langchain_community.vectorstores.faiss import FAISS

# from langchain_openai.embeddings.azure import AzureOpenAIEmbeddings
# from langchain_community.embeddings import HuggingFaceEmbeddings  # test

from langchain_openai.embeddings import OpenAIEmbeddings

# from langchain_community.embeddings
from langchain.text_splitter import CharacterTextSplitter

# load environment variables
load_dotenv("../.env")

# print(os.getenv("OPENAI_API_KEY"))

# emb = OpenAIEmbeddings(
#     openai_api_key=os.getenv("OPENAI_API_KEY")
#     )

# print(emb.embed_documents(["hello world"]))

# exit()

class VectorStore:
    """
    VectorStore を生成するクラス
    """

    def __init__(self):
        """
        初期化
        """
        print(os.getenv("AZURE_OPENA_ENDPOINT"))
        self.vectorstore = Optional[FAISS]
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )

    class TextSplitConfig(BaseModel):
        """
        テキストを分割する際の設定

        Args:
            BaseModel (_type_): ベースモデル（Pydantic）
        """

        separator: str = "。"
        chunk_size: int = 140
        chunk_overlap: int = 0

    def create(
        self,
        split_config: Optional[TextSplitConfig] = None,
        input_text: str = None,
    ) -> FAISS:
        """
        VectorStore を新規生成する

        Args:
            config (TextSplitConfig): テキストを分割する際の設定. Defaults to None.
            text (str): 分割するテキスト. Defaults to None.

        Returns:
            FAISS: VectorStore
        """
        texts = self.text_split(input_text, split_config)  # split text into chunks
        docs = [Document(page_content=txt) for txt in texts]

        input(len(docs))

        self.vectorstore = FAISS.from_documents(
            documents=docs, embedding=self.embeddings
        )
        return self.vectorstore

    def load(self, load_path: str) -> FAISS:
        """
        VectorStore をロードする

        Args:
            load_path (str): ロードするフォルダのパス

        Returns:
            FAISS: VectorStore
        """
        try:
            self.vectorstore = FAISS.load_local(
                folder_path=load_path,
                embeddings=self.embeddings,
                allow_dangerous_deserialization=True,
            )
        except FileNotFoundError:
            return None
        return self.vectorstore

    def text_split(
        self,
        input_text: str = None,
        split_config: Optional[TextSplitConfig] = None,
    ) -> list[str]:
        """
        テキストを分割する

        Args:
            input_text (str, optional): 分割するテキスト. Defaults to None.
            split_config (Optional[TextSplitConfig], optional): テキストを分割する際の設定. Defaults to None.

        Returns:
            list[str]: _description_
        """
        splitter = CharacterTextSplitter(
            separator=split_config.separator,
            chunk_size=split_config.chunk_size,
            chunk_overlap=split_config.chunk_overlap,
        )
        texts = splitter.split_text(input_text)
        return texts

    def save(self, save_path: str) -> None:
        """
        VectorStore を保存する

        Args:
            save_path (str): 保存するフォルダのパス
        """
        self.vectorstore.save_local(folder_path=save_path)


if __name__ == "__main__":
    vs = VectorStore()
    config = vs.TextSplitConfig()

    file_path = input("ファイルのパスを入力: ") # ../data/test.txt
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print("ファイルが見つかりません")
        exit()

    vs.create(split_config=config, input_text=text)
    vs.save("../data/vectorstore") # 保存先のパス

    print("Vector store created and saved.")
