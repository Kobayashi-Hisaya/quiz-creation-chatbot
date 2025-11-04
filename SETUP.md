# 開発環境セットアップガイド

このドキュメントは、共同開発者が開発環境をセットアップするための手順です。

## 前提条件

- Node.js 20以上がインストールされていること
- GitHubアカウントを持っていること
- Vercelチームに招待されていること（管理者から招待メールが届きます）

## セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/quiz-creation-chatbot.git
cd quiz-creation-chatbot
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. Vercel CLIをインストール

```bash
npm install -g vercel
```

### 4. Vercelにログイン

```bash
vercel login
```

ブラウザが開くので、GitHubアカウントでログインしてください。

### 5. プロジェクトにリンク

```bash
vercel link
```

以下のように答えてください：
- `? Set up and deploy?` → **N** (No)
- `? Which scope?` → **quiz-creation-chatbot** を選択
- `? Link to existing project?` → **Y** (Yes)
- `? What's your project's name?` → **quiz-creation-chatbot**

### 6. 環境変数をダウンロード

```bash
vercel env pull .env.local
```

これでVercelに設定されている環境変数がローカルにダウンロードされます。

### 7. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いて動作確認してください。

---

## よく使うコマンド

### 開発

```bash
# 開発サーバー起動（ホットリロード有効）
npm run dev

# 本番ビルド
npm run build

# 本番モードで起動
npm start

# Lintチェック
npm run lint
```

### Git操作

```bash
# 最新のmainブランチを取得
git checkout main
git pull origin main

# 新しいブランチを作成
git checkout -b feature/new-feature

# 変更をコミット
git add .
git commit -m "feat: Add new feature"

# GitHubにプッシュ
git push origin feature/new-feature

# その後、GitHubでPull Requestを作成
```

### Vercelデプロイ

```bash
# プレビューデプロイ
vercel

# 本番デプロイ
vercel --prod

# デプロイ一覧
vercel ls

# ログ確認
vercel logs --follow
```

---

## プロジェクト構造

```
quiz-creation-chatbot/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ルートページ（認証ルーター）
│   ├── login/             # ログインページ
│   ├── dashboard/         # ダッシュボード
│   ├── create-mcq/        # 問題作成ページ
│   ├── create-quiz/       # クイズ作成ページ
│   ├── problem/[id]/      # 問題詳細ページ
│   └── api/               # API Routes
├── src/
│   ├── components/        # Reactコンポーネント
│   ├── contexts/          # React Context（認証、問題状態）
│   ├── services/          # ビジネスロジック（AI、DB操作）
│   └── types/             # TypeScript型定義
├── .env.local             # 環境変数（Gitignore、各自で取得）
├── .env.example           # 環境変数テンプレート
├── vercel.json            # Vercel設定
├── DEPLOYMENT.md          # デプロイメントガイド
└── CLAUDE.md              # プロジェクト概要
```

---

## 環境変数について

### 必要な環境変数

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `OPENAI_API_KEY` | OpenAI APIキー | `vercel env pull`で自動取得 |
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトURL | `vercel env pull`で自動取得 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | `vercel env pull`で自動取得 |
| `GAS_WEB_APP_URL` | Google Apps Script URL | `vercel env pull`で自動取得 |

### 環境変数の更新

環境変数が更新された場合は、再度ダウンロードしてください：

```bash
vercel env pull .env.local --force
```

---

## 開発ワークフロー

### 1. 機能開発の流れ

```bash
# 1. 最新のmainを取得
git checkout main
git pull origin main

# 2. フィーチャーブランチを作成
git checkout -b feature/new-feature

# 3. ローカルで開発
npm run dev

# 4. 変更をコミット
git add .
git commit -m "feat: Add new feature"

# 5. GitHubにプッシュ
git push origin feature/new-feature

# 6. Pull Requestを作成
# → GitHubでPRを作成
# → Vercelが自動的にプレビューデプロイメントを作成

# 7. レビュー後、mainにマージ
# → 自動的に本番デプロイメント
```

### 2. コミットメッセージの規約

Conventional Commitsに従ってください：

```
feat: 新機能
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正（動作に影響なし）
refactor: リファクタリング
test: テスト追加・修正
chore: ビルドプロセスやツールの変更
```

例：
```bash
git commit -m "feat: Add quiz generation feature"
git commit -m "fix: Resolve authentication bug"
git commit -m "docs: Update README with setup instructions"
```

---

## トラブルシューティング

### ビルドエラーが出る

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# 型エラーをチェック
npm run lint
```

### 環境変数が読み込まれない

```bash
# 環境変数を再ダウンロード
vercel env pull .env.local --force

# .env.localが存在するか確認
cat .env.local
```

### Vercelへのアクセス権限がない

管理者にVercelチームへの招待を依頼してください。

### Supabaseに接続できない

1. `.env.local`の環境変数を確認
2. Supabaseダッシュボードでプロジェクトアクセス権限を確認
3. RLSポリシーが正しく設定されているか確認

---

## 参考ドキュメント

- [CLAUDE.md](CLAUDE.md) - プロジェクト概要とアーキテクチャ
- [DEPLOYMENT.md](DEPLOYMENT.md) - デプロイメントガイド
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## サポート

質問や問題があれば、以下の方法で連絡してください：

- GitHub Issues: プロジェクトのIssuesページで報告
- Slack/Discord: チームチャンネルで質問
- 管理者に直接連絡

---

**最終更新**: 2025-11-05
