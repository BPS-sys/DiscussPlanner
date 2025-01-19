import os
from typing import Optional
from dotenv import load_dotenv
import time
from datetime import datetime
from langchain_core.documents import Document
from langchain_community.vectorstores.faiss import FAISS
from langchain.text_splitter import CharacterTextSplitter

from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams

# local
from lib.schema import FilePath, TextSplitConfig
from lib.models import AzureModels, OpenAIModels

# load environment variables
load_dotenv("../.env")

class VectorStoreQdrant:
    """
    VectorStore を生成するクラス
    """

    def __init__(
        self,
        split_config: Optional[TextSplitConfig] = TextSplitConfig()
    ):
        """
        初期化
        """
        self.split_config = split_config
        self.vectorstore = None
        self.models = AzureModels()
        self.embeddings = self.models.embeddings # Azure OpenAI のEmbeddingsを使用
        
        print("QdrantClientを初期化します")
        print(f"QDRANT_ENDPOINT: {os.getenv('QDRANT_ENDPOINT')}")
        print(f"QDRANT_PORT: {os.getenv('QDRANT_PORT')}")
        
        self.client = QdrantClient(
            host = os.getenv("QDRANT_ENDPOINT"),
            port = os.getenv("QDRANT_PORT"),
            prefer_grpc = True, # gRPCを優先して使用するか
            timeout = 5.0, # timeout(秒)
        )
    
    def create(self, meeting_id: str) -> None:
        """
        Qdrant Collection を新規生成する

        Args:
            config (TextSplitConfig): テキストを分割する際の設定. Defaults to None.
            text (str): 分割するテキスト. Defaults to None.

        Returns:
            None
        """
        sample_embedding = self.embeddings.embed_query("サンプルテキスト")
        embedding_dim = len(sample_embedding)
        print(f"embedding_dim: {embedding_dim}")
    
        self.client.create_collection(
            collection_name = meeting_id, # コレクション名 = meeting_id として管理
            vectors_config=VectorParams(
                size = self.models.params.dimension, # ベクトルの次元数
                distance = Distance.COSINE, # 距離計算方法 : cosine similarity
            )
        )
        return None
    
    def load(self, meeting_id: str) -> QdrantVectorStore:
        """
        meeting_id に対応する
        Qdrant Collection をロードする

        Args:
            load_path (str): ロードするフォルダのパス

        Returns:
            None
        """
        self.vectorstore = QdrantVectorStore(
            client = self.client,
            collection_name = meeting_id, # コレクション名 = meeting_id として管理
            embedding = self.embeddings
        )
        return self.vectorstore
    
    def update(self, meeting_id: str, input_text: str) -> None:
        """
        Qdrant Collection を更新する

        Args:
            meeting_id (str): 更新するコレクション名
            input_text (str): 更新するテキスト

        Returns:
            None
        """
        print("QdrantVectorStoreを更新します")
        print(f"input_text: {input_text}")
        texts = self.split_text(input_text)
        # self.vectorstore.add_documents([Document(page_content=txt) for txt in texts])
        print("QdrantVectorStoreを更新します")
        print(f"texts: {texts}")
        
        documents = [
            Document(
                page_content=txt, 
                metadata={
                    "meeting_id": meeting_id,
                    "created_at": datetime.now().isoformat()
                }
            ) for txt in texts
        ]
        
        print(f"documents: {documents}")
        
        self.load(meeting_id)
        self.vectorstore.add_documents(documents)
        
        return None
    
    # sub functions
    def split_text(self, input_text: str) -> list[str]:
        """
        テキストを分割する

        Args:
            input_text (str): 分割するテキスト

        Returns:
            list[str]: 分割されたテキストのリスト
        """
        splitter = CharacterTextSplitter(
            separator=self.split_config.separator,
            chunk_size=self.split_config.chunk_size,
            chunk_overlap=self.split_config.chunk_overlap,
        )
        texts = splitter.split_text(input_text)
        return texts
    
    def add_testdata(self, meeting_id: str = "111", datapath: str = "../data/test.txt") -> None:
        """
        テストデータを追加する

        Args:
            meeting_id (str): 追加するコレクション名

        Returns:
            None
        """
        with open(datapath, "r", encoding="utf-8") as f:
            text = f.read()
        self.update(meeting_id, text)
        return None
    
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
        self.models = AzureModels()
        self.embeddings = self.models.embeddings

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
            print("[sys] VectorStoreが見つかりません。新規生成します。")
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

    def update(self, input_text: str) -> FAISS:
        """
        VectorStore を更新と保存を行う

        Args:
            input_text (str): 更新するテキスト

        Returns:
            FAISS: VectorStore
        """
        texts = self.text_split(
            input_text, self.split_config
        )  # 量が多い場合は分割（既存要素と異なる為）
        self.vectorstore.add_documents([Document(page_content=txt) for txt in texts])
        self.save(self.path.vectorstore_path)  # 保存


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
