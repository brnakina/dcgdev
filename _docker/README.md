**Docker操作**


**Windows上**

```bash
■dockerディレクトリへ移動
cd {project_root}/_dcoker

■起動
docker-compose up -d

■Node.jsコンテナへ接続
docker exec -it docker_node_1 bash

■終了
docker-compose down
```

**Linux上（コンテナ内）**

```bash
■コンテナ再構築後初回だけnpmからパッケージを再取得する
npm install express;
npm install socket_io;
npm install forever;
npm install mysql;

■プロジェクトルートへ移動
cd /home/docker/dcgdev

■環境変数を適用
source /root/.profile

■アプリケーションの起動

・実行中bashに処理が戻らない（その代わりログがコンソールに出力される）
node ./exp/bin/www
<ctrl+Cで停止>

・実行中bashに処理が戻る（デーモン起動）
forever start ./exp/bin/www
```
