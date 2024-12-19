# Pythonベースのイメージを使用
FROM python:3.10.14-slim

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# `rye` をインストール
RUN curl -sSL https://rye-up.com/get | python3

# 作業ディレクトリを設定
WORKDIR /app

# `rye` を使って依存関係をインストール
RUN rye install

# アプリケーションを起動
CMD ["python", "main.py"]

# 必要なポートを開放
EXPOSE 8080
