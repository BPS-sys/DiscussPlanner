import os
from dotenv import load_dotenv
from typing import Optional

from pydantic import BaseModel, Field
from langchain_core.tools import tool


# --- functions import ---

# ここにtoolデコレータを使って関数を定義してください


class ChoiceIntent(BaseModel):
    """

    以下からユーザーの求めている適切な意図を1つだけ選んでください。重複は許しません。
    ・アイデアの発散
    ・アイデアの収束
    ・要約
    ・質問への回答

    Args:
        BaseModel(_type_): ベースモデル(Pydantic)

    """

    divergence_idea: bool = Field(False, description="アイデアの発散の場合はTrueが入る")
    convergence_idea: bool = Field(
        False, description="アイデアの収束の場合はTrueが入る"
    )
    summary: bool = Field(False, description="要約の場合はTrueが入る")
    answer_to_question: bool = Field(
        False, description="質問への回答の場合はTrueが入る"
    )


@tool("ChoiceIntent", args_schema=ChoiceIntent, return_direct=False)
def query_category(
    divergence_idea: bool = False,
    convergence_idea: bool = False,
    summary: bool = False,
    answer_to_question: bool = False,
) -> str:
    """
    カテゴリ情報から適切なプロンプトを返す
    """
    print("カテゴリ情報")

    from tools.tools import (
        DivergenceIdeaTools,
        ConvergenceIdeaTools,
        SummaryInformationTools,
        AnswerToQuestionTools,
    )

    print("発散：", divergence_idea)
    print("収束：", convergence_idea)
    print("要約：", summary)
    print("回答：", answer_to_question)
    if divergence_idea:
        prompt = "与えられた情報から考えられるアイデアを発散し、カンマ区切りで出力してください"
        tool = DivergenceIdeaTools()
    elif convergence_idea:
        prompt = "与えられたアイデアを収束させてください。収束させたアイデアをカンマ区切りで出力せよ"
        tool = ConvergenceIdeaTools()
    elif summary:
        prompt = "これまでの話を時系列順に要約し簡潔にまとめてください。"
        tool = SummaryInformationTools()
    elif answer_to_question:
        prompt = "これまでの情報を加味して、もっとも最善だと考えられる回答を出力せよ"
        tool = AnswerToQuestionTools()

    return {"prompt": prompt, "tool": tool}
