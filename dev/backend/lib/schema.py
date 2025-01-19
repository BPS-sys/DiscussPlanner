from pydantic import BaseModel, Field
from typing import Optional


class FilePath(BaseModel):
    """
    ファイルのパス
    Args:
        BaseModel (_type_): ベースモデル（Pydantic）
    """

    input_document: str = Field(
        "./data/test.txt", description="vectorstoreの入力ファイルのパス"
    )
    vectorstore_path: str = Field(
        "./data/vectorstore", description="vectorstoreを保存するフォルダのパス"
    )


# vectorstore用のスキーマ
class TextSplitConfig(BaseModel):
    """
    テキストを分割する際の設定

    Args:
        BaseModel (_type_): ベースモデル（Pydantic）
    """

    separator: str = "。"
    chunk_size: int = 140
    chunk_overlap: int = 0


# tool用のスキーマ

class RetrieverConfig(BaseModel):
    """
    リトリーバの設定

    Args:
        BaseModel (_type_): ベースモデル（Pydantic）
    """

    search_type: str = "similarity_score_threshold"  # 類似度を閾値で検索
    search_kwargs: Optional[dict] = {
        "score_threshold": 0.6,  # 類似度の閾値（以上）
        "k": 2,  # 検索結果の上位n件を返す
    }
