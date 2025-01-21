from pprint import pprint

from pydantic import BaseModel, Field
from typing import List, Dict, Union, Optional


#
# create_page
#
class TextContent(BaseModel):
    """
    PageModel で用いるコンテンツのデータモデル
    """

    content: str = Field(default="", description="テキスト")


class RichTextElement(BaseModel):
    """
    PageModel で用いるリッチテキストのデータモデル
    """

    text: TextContent = Field(default=TextContent(), description="テキスト")

    @classmethod
    def create(cls, content: str) -> "RichTextElement":
        """
        リッチテキストを生成するためのヘルパーメソッド
        """
        return cls(text=TextContent(content=content))


class TitleWrapper(BaseModel):
    """
    PageModelで用いる "Title" のリッチテキストを格納するためのモデル

    例："title": { "text": { "content": "テキスト" } }
    """

    title: List[RichTextElement] = Field(default=[], description="タイトル")

    @classmethod
    def create(cls, contents: List[str]) -> "TitleWrapper":
        """
        タイトルを生成するためのヘルパーメソッド
        """
        elements = [RichTextElement.create(content) for content in contents]
        return cls(title=elements)


class RichTextWrapper(BaseModel):
    """
    PageModelで用いる "Agenda" と "Summary" のリッチテキストを格納するためのモデル

    例： "properties_id": { "text": { "content": "テキスト" } }
    """

    rich_text: List[RichTextElement] = Field(
        default=[RichTextElement()], description="リッチテキスト"
    )

    @classmethod
    def create(cls, contents: List[str]) -> "RichTextWrapper":
        elements = [RichTextElement.create(content) for content in contents]
        return cls(rich_text=elements)


# main model
class PageModel(BaseModel):
    """
    Notion API を用いて Notion DB に議事録を送信する為に用いるデータ

    Args:
        BaseModel (_type_): ベースモデル
    """

    properties: Dict[str, Union[TitleWrapper, RichTextWrapper]] = Field(
        {}, description="データ"
    )

    @classmethod
    def create(
        cls,
        page_keys: List[str],
        page_contents: List[List[str]],
    ) -> "PageModel":
        """
        ページモデルを生成するためのヘルパーメソッド

        Args:
            page_keys (List[str]): NotionAPIから取得したDBのPropertyのキー
            page_contents (List[List[str]]): Propertyの下図に対応するコンテンツデータ（議事録）

        Returns:
            PageModel: ページモデル
        """
        data = {
            key: (
                TitleWrapper.create(content)  # titleの場合はTitleWrapperを用いて生成
                if key == "title"
                else RichTextWrapper.create(
                    content
                )  # それ以外の場合はRichTextWrapperを用いて生成
            )
            for key, content in zip(page_keys, page_contents)
        }  # 内包表記を用いてデータを生成
        return cls(properties=data)


if __name__ == "__main__":
    keys = ["title", "agenda", "summary"]
    contents = [
        ["会議タイトル"],
        ["議題例"],
        ["サマリは AA です"],
    ]
    page = PageModel.create(page_keys=keys, page_contents=contents)

    # 確認
    p = page.model_dump()
    pprint(p, indent=2, sort_dicts=False, width=120)
    print()
    pprint(p["properties"], indent=2, sort_dicts=False, width=120)
    print()
    pprint(page.properties, indent=2, sort_dicts=False, width=120)
