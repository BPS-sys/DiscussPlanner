FROM node:20-alpine
ENV NODE_ENV=development

# ファイルをコピー
RUN mkdir -p /app
COPY . /app

WORKDIR /app

RUN npm install

# アプリケーションを起動 another:`npx docsaurus start`
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "8888"]

# ポート3000を開放
EXPOSE 8888