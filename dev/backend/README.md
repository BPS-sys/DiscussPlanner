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
GEMINI_API_KEY = "xxxxxxxxxx"
```

※ GeminiのAPIを発行したい場合
下記URLからAPIの発行を行う事ができます。
https://aistudio.google.com/apikey
