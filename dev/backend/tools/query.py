import os
from dotenv import load_dotenv
from typing import Optional
import time

from pydantic import BaseModel, Field
from langchain_core.tools import tool

# --- functions import ---
from lib.schema import FilePath, RetrieverConfig, TextSplitConfig
from lib.vectorstore import VectorStore, VectorStoreQdrant


# schema
class QueryVectorstore(BaseModel):
    """
    クエリに関する引数のスキーマ
    """

    query: str = Field(..., description="クエリ文")
    meeting_id: str = Field(..., description="会議ID")


@tool("QueryVectorstore", args_schema=QueryVectorstore, return_direct=True)
def query_vectorstore(query: str, meeting_id: str, path: Optional[FilePath] = FilePath()) -> str:
    """
    質問に対応するコンテキストを検索する
    Args:
        question (str): 質問
    Returns:
        str: コンテキスト
    """
    # meeting_id = "111"
    config = TextSplitConfig()
    vectorstore_manager = VectorStoreQdrant(split_config=config)
    
    try:
        vectorstore = vectorstore_manager.load(meeting_id=meeting_id)
    except:
        # データが存在しない場合は新規作成
        vectorstore_manager.create(meeting_id=meeting_id)
        vectorstore_manager.add_testdata(meeting_id=meeting_id, datapath="./data/test.txt")
        vectorstore = vectorstore_manager.load(meeting_id=meeting_id)
    
    retriever = vectorstore.as_retriever(**vars(RetrieverConfig))
    
    test = retriever.invoke(query)
    
    print("● test")
    print(test)
    
    # search context
    context = ",".join([content.page_content for content in retriever.invoke(query)])
    return context