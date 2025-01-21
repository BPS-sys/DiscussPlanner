ARG APP_HOME=/home/node/app
FROM node:20-alpine as build
ENV NODE_ENV=development

# ファイルをコピー
RUN mkdir -p /app
COPY ./react_app /app

WORKDIR /app

RUN npm install

RUN yarn install
RUN yarn build

FROM nginx:alpine
COPY --from=build ${APP_HOME}/build /var/www
COPY ./nginx /etc/nginx/conf.d/

# アプリケーションを起動
# CMD ["npm", "start"]

WORKDIR /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 3000