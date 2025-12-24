# TODO App - Nuxt 4 + PostgreSQL

Nuxt 4とPostgreSQLを使用したフルスタックTODOアプリケーション

## 機能

### フロントエンド
- TODOの追加・削除・完了チェック
- TODO編集機能（ダブルクリックまたは編集ボタン）
- フィルタリング（全て/進行中/完了済み）
- 残タスク数の表示
- レスポンシブデザイン

### バックエンド
- RESTful API（GET/POST/PUT/DELETE）
- PostgreSQLによるデータ永続化
- UUID主キー
- Drizzle ORMによるタイプセーフなDB操作

## 技術スタック

### フロントエンド
- Nuxt 4.2.2
- Vue 3.5.26 (Composition API)
- TypeScript

### バックエンド
- Node.js 22.21.1
- Express
- TypeScript
- PostgreSQL
- Drizzle ORM

### インフラ
- Docker
- Docker Compose

## 起動方法

### 前提条件
- Docker & Docker Compose がインストールされていること

### Docker Compose で全サービスを起動（推奨）

```bash
# プロジェクトルートで実行
docker-compose up -d
```

これにより以下のサービスが起動します：
- PostgreSQL（ポート: 5432）
- バックエンドサーバー（ポート: 3001）
- フロントエンド（ポート: 3000）

### ブラウザでアクセス

http://localhost:3000 を開いてTODOアプリを使用できます

### ローカル開発（Dockerを使わない場合）

#### 1. バックエンドとDBを起動

```bash
docker-compose up -d db backend
```

#### 2. フロントエンドをローカルで起動

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは http://localhost:3000 で起動します

## API エンドポイント

バックエンドAPIは http://localhost:3001/api/todos で利用できます

### GET /api/todos
全てのTODOを取得

### POST /api/todos
新しいTODOを作成

リクエストボディ：
```json
{
  "text": "TODOのテキスト"
}
```

### PUT /api/todos/:id
TODOを更新

リクエストボディ：
```json
{
  "text": "更新後のテキスト",
  "completed": true
}
```

### DELETE /api/todos/:id
TODOを削除

## 開発

### 個別サービスの起動

```bash
# バックエンドのみ
cd backend
npm run dev

# フロントエンドのみ
cd frontend
npm run dev
```

### マイグレーション

```bash
cd backend
npm run db:generate  # スキーマからマイグレーションを生成
npm run db:migrate   # マイグレーションを実行
```

### ログ確認

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### サービス停止

```bash
docker-compose down
```

### データベースリセット

```bash
docker-compose down -v  # ボリュームも削除
docker-compose up -d
```

## プロジェクト構成

```
.
├── frontend/
│   ├── app.vue             # Nuxt メインコンポーネント
│   ├── nuxt.config.ts      # Nuxt設定
│   ├── Dockerfile
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── index.ts        # Expressサーバー
│   │   ├── routes/
│   │   │   └── todos.ts    # TODOルート (CRUD API)
│   │   └── db/
│   │       ├── schema.ts   # DBスキーマ (UUID主キー)
│   │       ├── index.ts    # DB接続
│   │       └── migrate.ts  # マイグレーション
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # 全サービスの統合管理
└── README.md
```

## ライセンス

MIT
