import os
import sys
from dotenv import load_dotenv
import requests
import json
from typing import List
from pprint import pprint
import firebase_admin
from firebase_admin import credentials, firestore

# local
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))  # 2つ上の階層を指定
from api.schema import *

load_dotenv("../../../backend/.env")  # 環境変数をロード


class FirestoreAPI:
    """
    Firestore API を利用するクラス
    """

    def __init__(
        self,
    ):
        pass

    def get_notion_api_data(self, meeting_id: str) -> NotionItem:
        """
        Firestore から Notion API のデータを取得する

        Returns:
            NotionItem: Notion API のデータ
        """

        # ここに Firestore からデータを取得する処理を記述
        # 以下はダミーのデータを返す処理
        item = NotionItem(
            access_token="ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  # アクセストークン
            duplicated_template_id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",  # 複製されたテンプレートのID
        )
        return item
