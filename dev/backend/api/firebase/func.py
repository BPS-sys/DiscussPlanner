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
        if not firebase_admin._apps:
            self.cred = credentials.Certificate({
                "type": os.getenv("FIREBASE_TYPE"),
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
                "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
                "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
                "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
            })
            self.app = firebase_admin.initialize_app(self.cred)
        else:
            self.app = firebase_admin.get_app()
        self.db = firestore.client()

    def get_notion_api_data(self, user_id: str, project_id: str) -> NotionItem:
        """
        Firestore から Notion API のデータを取得する
        
        Args:
            user_id (str): ユーザーID
            project_id (str): プロジェクトID

        Returns:
            NotionItem: Notion API のデータ
        """
        
        query = self.db.collection(user_id).document(project_id)
        doc = query.get()
        
        # ここに Firestore からデータを取得する処理を記述
        
        if doc.exists: # ドキュメントが存在する場合
            data = doc.to_dict()
            notion_api_data = data["notion_api"]
            item = NotionItem(**notion_api_data)
            return item
        else:
            # 以下はダミーのデータを返す処理
            item = NotionItem(
                access_token="ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  # アクセストークン
                duplicated_template_id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",  # 複製されたテンプレートのID
            )
            return item
        
    def insert_notion_api_data(self, user_id: str, project_id: str, notion_item: NotionItem):
        """
        Firestore に Notion API のデータを挿入す    
        Args:
            user_id (str): ユーザーID
            project_id (str): プロジェクトID
            notion_item (NotionItem): Notion API のデータ
        """
        notion_item = notion_item.dict()
        
        data = {
            "notion_api": notion_item
        }
        dic_ref = self.db.collection(user_id).document(project_id)
        res = dic_ref.set(data) # Firestore にデータを挿入
        
        return res, 200
    