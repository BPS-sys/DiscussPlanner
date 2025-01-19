import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field

# langchain
from langchain_openai.chat_models import AzureChatOpenAI, ChatOpenAI
from langchain_openai.embeddings import AzureOpenAIEmbeddings, OpenAIEmbeddings

# 環境変数の読み込み
load_dotenv("../.env", override=True)


class OpenAIModels(BaseModel):
    """
    Azure OpenAI モデルの設定を一括管理するクラス
    """

    compose_model: ChatOpenAI = Field(None, description="クエリ用モデルのインスタンス")
    stream_model: ChatOpenAI = Field(
        None, description="ストリームチャットモデルのインスタンス"
    )
    embeddings: OpenAIEmbeddings = Field(
        None, description="埋め込みモデルのインスタンス"
    )

    def __init__(self, **data):
        super().__init__(**data)
        # モデルの初期化
        self.compose_model = ChatOpenAI(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model="gpt-4o-mini",
        )

        self.stream_model = ChatOpenAI(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model="gpt-4o-mini",
        )

        self.embeddings = OpenAIEmbeddings(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            model="text-embedding-3-small",
        )


class AzureModels(BaseModel):
    """
    Azure OpenAI モデルの設定を一括管理するクラス
    """

    compose_model: AzureChatOpenAI = Field(
        None, description="クエリ用モデルのインスタンス"
    )
    stream_model: AzureChatOpenAI = Field(
        None, description="ストリームチャットモデルのインスタンス"
    )
    embeddings: AzureOpenAIEmbeddings = Field(
        None, description="埋め込みモデルのインスタンス"
    )

    def __init__(self, **data):
        super().__init__(**data)

        # モデルの初期化
        self.compose_model = AzureChatOpenAI(
            deployment_name="gpt-4o-mini",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            openai_api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        )

        self.stream_model = AzureChatOpenAI(
            deployment_name="gpt-4o-mini",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            openai_api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        )

        self.embeddings = AzureOpenAIEmbeddings(
            deployment="text-embedding-3-small",
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
            openai_api_key=os.getenv("AZURE_OPENAI_API_KEY"),
            openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        )


if __name__ == "__main__":
    # 環境変数から設定を読み込み
    openai_models = OpenAIModels()
    azure_models = AzureModels()

    # モデル情報を確認
    print("1. OpenAI Compose Model:\n", openai_models.compose_model, "\n")
    print("2. OpenAI Stream Model:\n", openai_models.stream_model, "\n")
    print("3. OpenAI Embeddings:\n", openai_models.embeddings, "\n")
    print("4. Azure Compose Model:\n", azure_models.compose_model, "\n")
    print("5. Azure Stream Model:\n", azure_models.stream_model, "\n")
    print("6. Azure Embeddings:\n", azure_models.embeddings, "\n")
