import os
from typing import Optional
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_community.vectorstores.faiss import FAISS
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter

# local
from lib.schema import FilePath, TextSplitConfig

# load environment variables
load_dotenv("../.env")


class VectorStore:
    """
    VectorStore を生成するクラス
    """

    def __init__(
        self,
        path: Optional[FilePath] = FilePath(),
        split_config: Optional[TextSplitConfig] = TextSplitConfig(),
    ):
        """
        初期化
        """
        self.path = path
        self.split_config = split_config
        self.vectorstore = Optional[FAISS]
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

    def create(
        self,
        split_config: Optional[TextSplitConfig] = TextSplitConfig(),
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

        self.vectorstore = FAISS.from_documents(
            documents=docs, embedding=self.embeddings
        )
        self.save(self.path.vectorstore_path)  # save vectorstore
        return self.vectorstore

    def load(self) -> FAISS:
        """
        VectorStore をロードする

        Args:
            load_path (str): ロードするフォルダのパス

        Returns:
            FAISS: VectorStore
        """
        try:
            self.vectorstore = FAISS.load_local(
                folder_path=self.path.vectorstore_path,
                embeddings=self.embeddings,
                allow_dangerous_deserialization=True,
            )
        except:
            print("VectorStoreが見つかりません。新規生成します。")
            try:
                input_text = self.open_file(self.path.input_document)
                create_res = self.create(
                    split_config=self.split_config,
                    input_text=input_text,
                )
            except Exception as e:
                return e
            return create_res
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

    def open_file(self, file_path: str) -> str:
        """
        ファイルを開く

        Args:
            file_path (str): ファイルのパス

        Returns:
            str: ファイルの中身
        """
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
        return text


if __name__ == "__main__":
    vs = VectorStore()
    config = TextSplitConfig(separator="。", chunk_size=140, chunk_overlap=0)

    file_path = input("ファイルのパスを入力: ")  # ../data/test.txt
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print("ファイルが見つかりません")
        exit()

    vs.create(split_config=config, input_text=text)
    vs.save("../data/vectorstore")  # 保存先のパス

    print("Vector store created and saved.")
