# TODO App - Production Ready Nuxt 4 + PostgreSQL

本格的なフルスタックTODOアプリケーション（プロダクション品質）

[![CI/CD](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml)

## 特徴

### プロダクション対応機能

- ✅ **完全なテストカバレッジ** - Vitest + Supertestによる統合テスト
- ✅ **API仕様書** - OpenAPI 3.0 + Swagger UI
- ✅ **構造化ロギング** - Pino による JSON ログ出力
- ✅ **入力バリデーション** - Zod による型安全なバリデーション
- ✅ **エラーハンドリング** - 包括的なエラー処理とレスポンス
- ✅ **セキュリティ** - Helmet + CORS + レート制限
- ✅ **ヘルスチェック** - データベース接続確認付き
- ✅ **Docker最適化** - マルチステージビルド + 非rootユーザー
- ✅ **CI/CD** - GitHub Actions による自動テスト・ビルド
- ✅ **環境変数管理** - 型安全な環境変数バリデーション

### アプリケーション機能

#### フロントエンド
- TODOの追加・削除・完了チェック
- TODO編集機能（ダブルクリックまたは編集ボタン）
- フィルタリング（全て/進行中/完了済み）
- 残タスク数の表示
- レスポンシブデザイン

#### バックエンド
- RESTful API（GET/POST/PUT/DELETE）
- PostgreSQLによるデータ永続化
- UUID主キー
- Drizzle ORMによるタイプセーフなDB操作

## アーキテクチャ

```
┌─────────────┐      ┌──────────────┐      ┌────────────┐
│   Browser   │─────▶│   Frontend   │─────▶│  Backend   │
│             │◀─────│  (Nuxt 4)    │◀─────│  (Express) │
└─────────────┘      └──────────────┘      └─────┬──────┘
   Port 3000            Port 3000                 │
                                                  │
                                           ┌──────▼──────┐
                                           │ PostgreSQL  │
                                           │             │
                                           └─────────────┘
                                              Port 5432
```

## 技術スタック

### フロントエンド
- **Nuxt** 4.2.2 - Vue 3フレームワーク
- **Vue** 3.5.26 - Composition API
- **TypeScript** - 型安全性

### バックエンド
- **Node.js** 22.21.1 - ランタイム
- **Express** - Webフレームワーク
- **TypeScript** - 型安全性
- **PostgreSQL** 16 - データベース
- **Drizzle ORM** - タイプセーフORM
- **Pino** - 構造化ロギング
- **Zod** - スキーマバリデーション
- **Helmet** - セキュリティヘッダー
- **Swagger UI** - API ドキュメント

### テスト・品質
- **Vitest** - テストフレームワーク
- **Supertest** - APIテスト
- **GitHub Actions** - CI/CD

### インフラ
- **Docker** - コンテナ化
- **Docker Compose** - オーケストレーション
- **pnpm** - パッケージマネージャー

## クイックスタート

### 前提条件
- Docker & Docker Compose がインストールされていること
- Node.js 22.21.1以上（ローカル開発の場合）
- pnpm（ローカル開発の場合）

### Docker Compose で全サービスを起動

```bash
# プロジェクトルートで実行
docker-compose up -d

# ログ確認
docker-compose logs -f
```

起動するサービス:
- **PostgreSQL** - `localhost:5432`
- **バックエンド** - `localhost:3001`
- **フロントエンド** - `localhost:3000`

### アクセス

- **アプリケーション**: http://localhost:3000
- **API仕様書**: http://localhost:3001/api-docs
- **ヘルスチェック**: http://localhost:3001/health

## 環境変数

### バックエンド (backend/.env)

```bash
# アプリケーション環境
NODE_ENV=development

# サーバー設定
PORT=3001

# データベース設定
DATABASE_URL=postgres://postgres:postgres@localhost:5432/todo_db

# ログレベル
LOG_LEVEL=debug

# CORS設定
CORS_ORIGIN=http://localhost:3000
```

詳細は `backend/.env.example` を参照してください。

### フロントエンド (frontend/.env)

```bash
# API設定
NUXT_PUBLIC_API_URL=http://localhost:3001

# アプリケーション環境
NODE_ENV=development
```

詳細は `frontend/.env.example` を参照してください。

## API ドキュメント

### Swagger UI

起動後、http://localhost:3001/api-docs でインタラクティブなAPI仕様書を確認できます。

### エンドポイント一覧

| メソッド | エンドポイント | 説明 |
|---------|--------------|------|
| GET | `/health` | ヘルスチェック |
| GET | `/api/todos` | 全TODO取得 |
| POST | `/api/todos` | TODO作成 |
| PUT | `/api/todos/:id` | TODO更新 |
| DELETE | `/api/todos/:id` | TODO削除 |

### リクエスト例

#### TODO作成
```bash
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "買い物に行く"}'
```

#### TODO更新
```bash
curl -X PUT http://localhost:3001/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## 開発

### ローカル開発環境のセットアップ

#### バックエンド

```bash
cd backend

# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm run dev

# テスト実行
pnpm test

# テストウォッチモード
pnpm test:watch

# カバレッジ
pnpm test:coverage

# ビルド
pnpm run build
```

#### フロントエンド

```bash
cd frontend

# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm run dev

# ビルド
pnpm run build
```

### データベース操作

```bash
cd backend

# マイグレーション生成
pnpm run db:generate

# マイグレーション実行
pnpm run db:migrate
```

### Docker操作

```bash
# サービス起動
docker-compose up -d

# ログ確認
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# サービス停止
docker-compose down

# データベースリセット（ボリューム削除）
docker-compose down -v
docker-compose up -d

# イメージ再ビルド
docker-compose up -d --build
```

## テスト

### バックエンドテスト

```bash
cd backend

# 全テスト実行
pnpm test

# ウォッチモード
pnpm test:watch

# カバレッジレポート
pnpm test:coverage

# UIモード
pnpm test:ui
```

テストは以下をカバー:
- ✅ TODO CRUD操作
- ✅ バリデーションエラー
- ✅ 404エラーハンドリング
- ✅ データベース接続確認
- ✅ ヘルスチェック

## プロジェクト構成

```
.
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── frontend/
│   ├── app.vue                 # Nuxtメインコンポーネント
│   ├── nuxt.config.ts          # Nuxt設定
│   ├── Dockerfile              # フロントエンドコンテナ
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── app.ts              # Expressアプリケーション
│   │   ├── index.ts            # サーバーエントリーポイント
│   │   ├── openapi.ts          # OpenAPI仕様
│   │   ├── routes/
│   │   │   └── todos.ts        # TODOルート (CRUD)
│   │   ├── lib/
│   │   │   ├── logger.ts       # Pinoロガー設定
│   │   │   ├── config.ts       # 環境変数バリデーション
│   │   │   └── validation.ts   # Zodスキーマ
│   │   ├── middleware/
│   │   │   └── errorHandler.ts # エラーハンドリング
│   │   └── db/
│   │       ├── schema.ts       # Drizzleスキーマ
│   │       ├── index.ts        # DB接続
│   │       └── migrate.ts      # マイグレーション
│   ├── Dockerfile              # バックエンドコンテナ（マルチステージ）
│   ├── vitest.config.ts        # テスト設定
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── docker-compose.yml          # サービスオーケストレーション
└── README.md
```

## セキュリティ

### 実装済みセキュリティ機能

- **Helmet**: セキュリティヘッダーの設定
- **CORS**: クロスオリジンリクエストの制御
- **レート制限**: DDoS攻撃の防止 (15分間で100リクエスト)
- **入力バリデーション**: Zodによる厳密なバリデーション
- **エラーハンドリング**: 本番環境では詳細を隠蔽
- **非rootユーザー**: Dockerコンテナ内で非特権ユーザーで実行
- **環境変数**: 機密情報の安全な管理

## CI/CD

GitHub Actionsによる自動化:

- ✅ プッシュ/PR時の自動テスト
- ✅ TypeScript型チェック
- ✅ Dockerビルド検証
- ✅ バックエンドテストとカバレッジ

ワークフローファイル: `.github/workflows/ci.yml`

## トラブルシューティング

### ポートが既に使用されている

```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :3001
lsof -i :5432

# プロセスを終了
kill -9 <PID>
```

### データベース接続エラー

```bash
# PostgreSQLコンテナの状態確認
docker-compose ps db

# ログ確認
docker-compose logs db

# データベースリセット
docker-compose down -v
docker-compose up -d
```

### Dockerビルドエラー

```bash
# キャッシュをクリアして再ビルド
docker-compose build --no-cache

# 古いイメージを削除
docker system prune -a
```

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

問題が発生した場合は、[Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)で報告してください。
