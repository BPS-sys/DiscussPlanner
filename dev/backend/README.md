# Langchain開発
### 実行環境について
実行環境の管理に`rye`というツールを用いています。下記のガイドからインストールをお願いします。
インストールガイド：https://rye.astral.sh/guide/installation/

#### 利用方法
1. 本ディレクトリ内で下記のコマンドを実行する事でpythonの`.venv`を作る事ができます。
```bash
rye sync
```
2. `.venv`をアクティベートし検証したいファイルを実行してください。

windowsの場合
```bash
.venv\Scripts\activate
```
macの場合
```bash
source .venv/bin/activate
```

### .envについて
main.pyと同一ディレクトリに.envを作成。
内容は下記の通り。

```bash
AZURE_OPENAI_ENDPOINT = "xxxxxxxxxx"
AZURE_OPENAI_API_KEY = "xxxxxxxxxx"
AZURE_OPENAI_API_VERSION = "xxxxxxxxxx"

OPENAI_API_KEY = "xxxxxxxxxx" # なくてもOK
```