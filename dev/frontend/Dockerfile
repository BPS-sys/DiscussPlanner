
FROM node:20-alpine as build
ENV NODE_ENV=development



# ファイルをコピー
RUN mkdir -p /app
COPY ./react_app /app

WORKDIR /app

RUN npm install
RUN npm run build


FROM nginx:alpine
COPY --from=build /app/build /var/www
COPY ./nginx /etc/nginx/conf.d/

RUN apk update && apk add --no-cache openssl

# 証明書と秘密鍵の生成
RUN mkdir -p /etc/ssl/private /etc/ssl/certs && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost"

# アプリケーションを起動
# CMD ["npm", "start"]

WORKDIR /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
EXPOSE 443
