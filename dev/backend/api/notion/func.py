import json
import os
import sys
from pprint import pprint
from typing import List, Optional, Tuple

import requests
from dotenv import load_dotenv

# local
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))  # 2つ上の階層を指定
from api.notion.schema import PageModel
from api.schema import *

load_dotenv("../../../backend/.env")  # 環境変数をロード


class NotionAPI:
    """
    Notion API を利用するクラス
    """

    def __init__(self, notion_item: NotionItem):
        self.url = "https://api.notion.com/v1"
        self.notion_client_id = os.getenv("NOTION_CLIENT_ID")
        self.notion_client_secret = os.getenv("NOTION_CLIENT_SECRET")
        self.notion_redirect_uri = os.getenv("NOTION_REDIRECT_URI")
        self.notion_item = notion_item
        self.headers = {
            "Content-Type": "application/json",
            "Notion-Version": os.getenv("NOTION_API_VERSION"),
            "Authorization": notion_item.access_token,
        }
        # ["title", "RNFf", "%3AUvN"]

    def add_database_contents(self, insert_data: InsertDataSchema):
        """
        データベースに対して新規のコンテンツを追加する（議事録の内容を追加する）

        Args:
            insert_data (InsertDataSchema): 挿入するデータのスキーマ
        """
        properties_keys = [
            insert_data.properties_name.title,
            insert_data.properties_name.agenda,
            insert_data.properties_name.summary,
        ]
        database_id, status_code = self.search_database_id()
        database_properties_id, status_code = self.search_database_properties_id(
            database_id, properties_keys
        )
        res, status_code = self.create_page(
            database_id=database_id,
            database_properties_id=database_properties_id,
            title=insert_data.minutes.title,  # 議事録のタイトル
            agenda=insert_data.minutes.agenda,  # 議事録の議題（アジェンダ）
            summary=insert_data.minutes.summary,  # 議事録の要約
            body=insert_data.minutes.body,  # 議事録の内容（マークダウン記法）
        )
        return res, status_code

    def create_page(
        self,
        database_id: str,
        database_properties_id: List[str],
        title: str,  # 議事録のタイトル
        agenda: str,  # 議事録の議題（アジェンダ）
        summary: str,  # 議事録の要約
        body: str,  # 議事録の内容（マークダウン記法）
    ) -> requests.models.Response:
        """
        Notion にページを作成する

        Returns:
            requests.models.Response: レスポンス情報
        """
        property_data = PageModel.create(
            page_keys=database_properties_id,  # NotionDBのプロパティのキー
            page_contents=[  # ページのコンテンツ
                [title],
                [agenda],
                [summary],
            ],
        ).model_dump()
        # pprint(property_data)

        url = f"{self.url}/pages"
        payload = json.dumps(
            {
                "parent": {
                    "database_id": database_id,
                },
                "properties": property_data["properties"],
                "children": [  ## ページの内容（後にLangchainで生成した議事録を入れる）
                    {
                        "object": "block",
                        "type": "paragraph",
                        "paragraph": {
                            "rich_text": [
                                {
                                    "type": "text",
                                    "text": {
                                        "content": body,  # このままだとマークダウン記法がそのまま表示される
                                    },
                                },
                            ],
                        },
                    },
                ],
            }
        )

        response = requests.request(
            "POST",
            url,
            headers=self.headers,
            data=payload,
            timeout=30,
        )
        # print(response.text)  # レスポンスの内容を表示
        if response.status_code != 200:
            return response.json(), response.status_code

        return response.json(), response.status_code

    def search_database_id(self):
        """
        任意のページの中からデータベースのIDを取得する
        """
        page_id = (
            self.notion_item.duplicated_template_id
        )  # ページID（議事録のテンプレート）を取得
        url = f"{self.url}/blocks/{page_id}/children?page_size=100"
        response = requests.request("GET", url, headers=self.headers, timeout=30)
        status_code = response.status_code
        response = response.json()

        # 受け取れない場合はそのまま返す
        if "object" not in response or status_code != 200:
            return (
                response,
                status_code,
            )  # レスポンスとステータスコードを返す

        # レスポンスの中からデータベースのIDを取得
        results = response["results"]
        for result in results:
            # データベースを示すブロックのtypeが`child_database`であるかつ、titleが`議事録`であるものを取得
            if (
                result["type"] == "child_database"
                and result["child_database"]["title"] == "議事録"
            ):
                return (
                    result["id"],
                    status_code,
                )  # データベースのIDとステータスコード(200)を返す

    def retrieve_database(self, database_id: str):
        """
        データベースの内容を取得する
        """
        url = f"{self.url}/databases/{database_id}"
        response = requests.request("GET", url, headers=self.headers, timeout=30)

        if response.status_code != 200:
            return response.json(), response.status_code

        return response.json(), response.status_code

    def search_database_properties_id(
        self,
        database_id: str,
        properties_keys: List[str],
    ):
        """
        データベース内のプロパティIDを取得する
        """
        res, status_code = self.retrieve_database(database_id=database_id)

        if status_code != 200:
            # データベースの内容が取得できない場合はエラーコードを返す
            pprint(res)
            return None, status_code

        properties_id = {key: None for key in properties_keys}
        properties = res["properties"]
        for prop in properties:
            if properties[prop]["name"] in properties_keys:
                properties_keys.remove(properties[prop]["name"])
                # プロパティIDと入れ替え
                properties_id[properties[prop]["name"]] = properties[prop]["id"]

        # self.database_properties_id = properties_id  # プロパティIDを更新
        return list(properties_id.values()), status_code

    def search_page_url(self, page_id: str) -> Tuple[Optional[str], int]:
        """
        page_idを基にNotion APIを用いてpageのurlを取得する
        """
        url = f"{self.url}/pages/{page_id}/"
        response = requests.request("GET", url, headers=self.headers, timeout=30)
        status_code = response.status_code
        response = response.json()

        if status_code != 200:
            # urlの内容が取得できない場合はエラーコードを返す
            return None, status_code

        page_url = response["url"]

        return page_url, status_code


if __name__ == "__main__":
    # テスト用
    run_test_num = int(input("run test number: "))

    if run_test_num == 1:
        print("■ test 1 : create_page")
        test_access_token = input("access_token: ")
        test_page_id = input("page_id: ")

        # 1. ページIDからデータベースIDを取得
        notion_item = NotionItem(
            access_token=test_access_token,
            duplicated_template_id=test_page_id,
        )
        notion_api = NotionAPI(notion_item=notion_item)
        test_database_id, test_status_code = notion_api.search_database_id()

        if test_status_code != 200:
            print("データベースのIDが取得できませんでした")
            sys.exit(1)

        # 2. DB内にページを作成
        notion_item = NotionItem(access_token=test_access_token)
        notion_api = NotionAPI(notion_item=notion_item)
        print(
            notion_api.create_page(
                database_id=test_database_id,  # データベースID
                database_properties_id=[
                    "title_id",
                    "agenda_id",
                    "summary_id",
                ],  # プロパティID（ダミー）
                title="This is a test",  # 議事録のタイトル
                agenda="agenda",  # 議事録の議題（アジェンダ）
                summary="summary",  # 議事録の要約
                body="body",  # 議事録の内容（マークダウン記法）
            )
        )
    elif run_test_num == 2:
        print("■ test 2 : retrieve_page")
        test_access_token = input("access_token: ")
        test_page_id = input("page_id: ")

        notion_item = NotionItem(
            access_token=test_access_token,
            duplicated_template_id=test_page_id,
        )
        notion_api = NotionAPI(notion_item=notion_item)
        res = notion_api.search_database_id()
        pprint(res)
    elif run_test_num == 3:
        print("■ test 3 : get_page_url")
        test_access_token = input("access_token: ")
        test_page_id = input("page_id: ")
        notion_item = NotionItem(access_token=test_access_token)
        notion_api = NotionAPI(notion_item=notion_item)
        res = notion_api.search_page_url(page_id=test_page_id)
        pprint(res)
