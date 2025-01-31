# Pythonベースのイメージを使用
FROM python:3.10.14-slim

# ファイルをコピー
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
RUN mkdir -p /app
COPY ./ /app

# パッケージをインストール
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを設定
WORKDIR /app

# Pythonの依存関係をインストール
RUN uv pip install --no-cache --system -r requirements.lock

# アプリケーションを起動
CMD ["python", "main.py"]

# 必要なポートを開放
EXPOSE 8080
