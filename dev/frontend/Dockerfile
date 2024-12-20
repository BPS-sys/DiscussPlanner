FROM node:20-alpine
ENV NODE_ENV=development

# ファイルをコピー
RUN mkdir -p /app
COPY ./react_app /app

WORKDIR /app

RUN npm install

# アプリケーションを起動
CMD ["npm", "start"]

# ポート3000を開放
EXPOSE 3000