# Vercelデプロイメントガイド

このドキュメントは、Quiz Creation ChatbotアプリケーションをVercelにデプロイするための完全なガイドです。

## 目次

1. [前提条件](#前提条件)
2. [初回セットアップ](#初回セットアップ)
3. [環境変数の設定](#環境変数の設定)
4. [Supabase統合](#supabase統合)
5. [GitHub連携](#github連携)
6. [ローカル開発環境](#ローカル開発環境)
7. [デプロイメントワークフロー](#デプロイメントワークフロー)
8. [トラブルシューティング](#トラブルシューティング)
9. [よく使うコマンド](#よく使うコマンド)

---

## 前提条件

- Node.js 20以上がインストールされていること
- Vercelアカウントを作成済み（https://vercel.com）
- Proプラン契約済み（API routeの30秒タイムアウトに必要）
- GitHubリポジトリが作成済み
- Supabaseプロジェクトが作成済み

---

## 初回セットアップ

### 1. Vercel CLIのインストール

```bash
# グローバルにインストール
npm install -g vercel

# バージョン確認
vercel --version
```

### 2. Vercelにログイン

```bash
vercel login
```

ブラウザが開くので、GitHub、GitLab、Bitbucket、またはEmailでログインしてください。

### 3. プロジェクトをVercelにリンク

```bash
vercel link
```

対話形式で以下のように答えてください：

- `? Set up and deploy?` → **N** (No)
- `? Which scope?` → **quiz-creation-chatbot** (Proプランのチーム名)
- `? Link to existing project?` → **N** (No - 新規作成)
- `? What's your project's name?` → **quiz-creation-chatbot**
- `? In which directory is your code located?` → **.** または **./** (現在のディレクトリ)
- `? Want to modify these settings?` → **N** (No)
- `? Do you want to change additional project settings?` → **N** (No)

これで `.vercel` ディレクトリが作成され、プロジェクト情報が保存されます。

**注意**: `.vercel`ディレクトリは既に`.gitignore`に含まれているため、Gitにコミットされません。

---

## 環境変数の設定

### 必要な環境変数

このプロジェクトには以下の環境変数が必要です：

| 変数名 | 説明 | 公開/秘密 | 必須 |
|--------|------|-----------|------|
| `OPENAI_API_KEY` | OpenAI APIキー | 秘密（サーバー専用） | 必須 |
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトURL | 公開 | 必須 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名キー | 公開 | 必須 |
| `GAS_WEB_APP_URL` | Google Apps ScriptのWebアプリURL | 公開 | オプション |

### Vercelダッシュボードで環境変数を設定

#### 手順

1. **Vercelダッシュボードを開く**
   ```
   https://vercel.com/quiz-creation-chatbot/quiz-creation-chatbot/settings/environment-variables
   ```

2. **環境変数を追加**

   各環境変数について以下を実行：

   - **「Add New」ボタンをクリック**
   - **Key**: 変数名を入力（例: `OPENAI_API_KEY`）
   - **Value**: 実際の値を入力
   - **Environment**: 以下をすべて選択
     - ☑️ Production（本番環境）
     - ☑️ Preview（プレビュー環境 - PR用）
     - ☑️ Development（ローカル開発用）
   - **「Save」をクリック**

#### 設定する環境変数の詳細

##### 1. OPENAI_API_KEY

```
Key: OPENAI_API_KEY
Value: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Environments: Production, Preview, Development
```

**取得方法**:
- OpenAI Platform（https://platform.openai.com/api-keys）でAPIキーを作成
- サーバー側専用なので`NEXT_PUBLIC_`プレフィックスは**不要**

##### 2. NEXT_PUBLIC_SUPABASE_URL

```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxxxxxxxxxx.supabase.co
Environments: Production, Preview, Development
```

**取得方法**:
- Supabaseダッシュボード → Project Settings → API → Project URL

##### 3. NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxx
Environments: Production, Preview, Development
```

**取得方法**:
- Supabaseダッシュボード → Project Settings → API → Project API keys → anon public

##### 4. GAS_WEB_APP_URL（オプション）

```
Key: GAS_WEB_APP_URL
Value: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
Environments: Production, Preview, Development
```

**取得方法**:
- Google Apps Scriptでスプレッドシート連携用のWebアプリを作成
- デプロイ後に取得できるURL

### 環境変数をローカルにダウンロード

環境変数を設定したら、ローカル開発用にダウンロードします：

```bash
vercel env pull .env.local
```

既存の`.env.local`がある場合は上書き確認が出ます。`y`（Yes）で上書きしてください。

**確認**:
```bash
cat .env.local
```

すべての環境変数がダウンロードされていることを確認してください。

---

## Supabase統合

Vercel公式のSupabase統合を使うと、環境変数を自動的に同期できます（推奨）。

### Supabase統合の追加手順

1. **Vercel Integrationsページを開く**
   ```
   https://vercel.com/integrations
   ```

2. **Supabaseを検索**
   - 検索ボックスに「Supabase」と入力
   - 「Supabase」統合を選択

3. **統合を追加**
   - 「Add Integration」をクリック
   - Vercelアカウント/チームを選択: **quiz-creation-chatbot**
   - 「Continue」をクリック

4. **Supabaseにログイン**
   - Supabaseアカウントでログイン
   - プロジェクトを選択
   - アクセス権限を承認

5. **プロジェクトを接続**
   - Vercelプロジェクト: **quiz-creation-chatbot**
   - Supabaseプロジェクト: 使用中のプロジェクトを選択
   - 「Connect」をクリック

### 統合のメリット

- **自動同期**: Supabaseの環境変数が自動的にVercelに同期
- **追加の変数**: `SUPABASE_SERVICE_ROLE_KEY`なども自動追加
- **プレビュー環境**: ブランチごとに別のSupabaseインスタンスを設定可能
- **更新の自動反映**: Supabaseで変更すると自動的にVercelに反映

### 注意事項

統合を追加すると、以下の環境変数が自動的に追加されます：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- その他のデータベース接続文字列

手動で設定した環境変数と重複する場合は、統合が優先されます。

---

## GitHub連携

VercelネイティブのGitHub統合を使用すると、GitHubへのプッシュで自動デプロイされます。

### GitHub連携の設定手順

#### 1. GitHubリポジトリの準備

リポジトリがまだGitHubにない場合は、プッシュしてください：

```bash
# 既存のリモートリポジトリを確認
git remote -v

# リモートリポジトリが設定されていない場合
git remote add origin https://github.com/YOUR_USERNAME/quiz-creation-chatbot.git

# 最初のプッシュ
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### 2. VercelでGitHubリポジトリを接続

##### 方法A: Vercelダッシュボードから（推奨）

1. **プロジェクト設定を開く**
   ```
   https://vercel.com/quiz-creation-chatbot/quiz-creation-chatbot/settings/git
   ```

2. **GitリポジトリをConnect**
   - 「Connect Git Repository」をクリック
   - GitHub を選択
   - Vercelに必要な権限を付与
   - リポジトリを検索: `quiz-creation-chatbot`
   - 「Connect」をクリック

3. **ブランチ設定**
   - Production Branch: **main**
   - その他のブランチは自動的にプレビューデプロイメント

##### 方法B: CLIから

```bash
vercel git connect
```

対話形式でGitHubリポジトリを選択します。

### 自動デプロイの仕組み

GitHub連携後、以下のように自動デプロイされます：

#### Productionデプロイ
- `main`ブランチへのプッシュ → 自動的に本番デプロイ
- デプロイURL: `https://quiz-creation-chatbot.vercel.app`

#### Previewデプロイ
- `main`以外のブランチへのプッシュ → プレビューデプロイ
- Pull Requestの作成 → プレビューデプロイ + PR コメントにURLが投稿される
- デプロイURL: `https://quiz-creation-chatbot-<branch>-<hash>.vercel.app`

### GitHub Pull Request ワークフロー

```bash
# 1. フィーチャーブランチを作成
git checkout -b feature/new-feature

# 2. 変更をコミット
git add .
git commit -m "Add new feature"

# 3. GitHubにプッシュ
git push origin feature/new-feature

# 4. GitHubでPull Requestを作成
# → Vercelが自動的にプレビューデプロイメントを作成
# → PR コメントにプレビューURLが投稿される

# 5. レビュー後、mainにマージ
# → 自動的に本番デプロイメント
```

---

## ローカル開発環境

### 開発サーバーの起動

#### 通常の開発モード

```bash
npm run dev
```

- ポート: `http://localhost:3000`
- ホットリロード有効
- Turbopack使用（高速）

#### Vercel環境で開発

```bash
vercel dev
```

- Vercelの本番環境に近い状態で実行
- サーバーレス関数の動作を再現
- 環境変数を自動的にVercelから取得

### 本番ビルドのテスト

本番環境と同じビルドをローカルでテストする場合：

```bash
# 本番用ビルド
npm run build

# 本番モードで起動
npm start
```

ポート: `http://localhost:3000`

### 環境変数の管理

#### ローカル開発用の環境変数

1. **Vercelからダウンロード**（推奨）
   ```bash
   vercel env pull .env.local
   ```

2. **手動で作成**
   ```bash
   cp .env.example .env.local
   ```
   その後、`.env.local`を編集して実際の値を入力

#### 環境変数の優先順位

Next.jsは以下の順序で環境変数を読み込みます：

1. `process.env`（システム環境変数）
2. `.env.local`（すべての環境、Gitに含めない）
3. `.env.development`（開発環境のみ）
4. `.env.production`（本番環境のみ）
5. `.env`（デフォルト値）

Vercelでは、ダッシュボードの環境変数がすべてに優先されます。

---

## デプロイメントワークフロー

### 標準的な開発フロー

```bash
# 1. 最新のmainブランチを取得
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

# 6. GitHubでPull Requestを作成
# → Vercelが自動的にプレビューデプロイメントを作成

# 7. プレビューURLでテスト
# → PR コメントに投稿されたURLで動作確認

# 8. レビュー後、mainにマージ
# → 自動的に本番デプロイメント

# 9. 本番環境で動作確認
# → https://quiz-creation-chatbot.vercel.app
```

### 手動デプロイ

GitHubを経由せず、CLIから直接デプロイすることも可能です：

#### プレビューデプロイ

```bash
vercel
```

一時的なプレビューURLが生成されます。

#### 本番デプロイ

```bash
vercel --prod
```

現在のコードを本番環境にデプロイします。

**注意**: 通常はGitHub連携による自動デプロイを使用してください。手動デプロイはテストや緊急時のみ使用します。

### デプロイの確認

#### Vercelダッシュボードで確認

```
https://vercel.com/quiz-creation-chatbot/quiz-creation-chatbot
```

- デプロイ履歴
- ビルドログ
- ランタイムログ
- パフォーマンスメトリクス

#### CLIで確認

```bash
# 最新のデプロイメント一覧
vercel ls

# デプロイメント詳細
vercel inspect <deployment-url>

# リアルタイムログ
vercel logs --follow
```

### ロールバック

デプロイに問題がある場合、即座にロールバックできます：

#### 方法A: Vercelダッシュボード（推奨）

1. Vercelダッシュボード → Deployments
2. 問題のない過去のデプロイメントを探す
3. 「⋯」メニュー → 「Instant Rollback」
4. 確認して実行

**メリット**: 即座にロールバック（再ビルド不要）

#### 方法B: CLI

```bash
# 直前のデプロイメントにロールバック
vercel rollback

# 特定のデプロイメントにロールバック
vercel rollback <deployment-url>
```

#### 方法C: Gitでrevert

```bash
# 問題のあるコミットをrevert
git revert <commit-hash>
git push origin main
# → 自動的に新しいデプロイメントが作成される
```

---

## トラブルシューティング

### よくある問題と解決方法

#### 1. ビルドエラー: "Module not found"

**原因**: 依存関係がインストールされていない

**解決方法**:
```bash
# ローカルで確認
npm install

# package-lock.jsonをコミット
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

#### 2. 環境変数が読み込まれない

**原因**: 環境変数の設定が間違っている、またはプレフィックスが間違っている

**解決方法**:
- クライアント側でアクセスする変数には`NEXT_PUBLIC_`プレフィックスが必要
- サーバー側専用の変数（`OPENAI_API_KEY`）にはプレフィックス不要
- Vercelダッシュボードで正しい環境（Production/Preview/Development）に設定されているか確認

```bash
# ローカルで環境変数を再ダウンロード
vercel env pull .env.local
```

#### 3. API Routeがタイムアウトする

**原因**: デフォルトのタイムアウト（10秒）を超えている

**解決方法**:
- Proプランが必要（Hobbyプランは10秒まで）
- `vercel.json`で`maxDuration`を設定（既に30秒に設定済み）
- 処理を最適化してタイムアウトを短縮

#### 4. Supabaseに接続できない

**原因**: 環境変数が正しく設定されていない、またはRLSポリシーの問題

**解決方法**:
```bash
# 環境変数を確認
vercel env ls

# Supabase統合を使用している場合は再接続
# Vercelダッシュボード → Integrations → Supabase → Reconnect
```

Supabaseダッシュボードで以下を確認：
- Row Level Security (RLS) ポリシーが正しく設定されているか
- 匿名キーの権限が適切か

#### 5. デプロイは成功するが404エラー

**原因**: ルーティング設定が間違っている

**解決方法**:
- Next.js App Routerの構造を確認（`app/`ディレクトリ）
- `vercel.json`の設定を確認
- ビルドログで警告がないか確認

#### 6. プレビューデプロイメントが作成されない

**原因**: GitHub連携が正しく設定されていない

**解決方法**:
```bash
# GitHub連携を確認
vercel git ls

# 再接続
vercel git connect
```

Vercelダッシュボード → Settings → Git で接続状態を確認

#### 7. "Failed to connect GitHub repository"

**原因**: リポジトリ名が間違っている、またはVercelに権限がない

**解決方法**:
- GitHubでVercelアプリの権限を確認
- リポジトリ名を正確に入力（大文字小文字を区別）
- プライベートリポジトリの場合、Vercelに適切な権限を付与

GitHub Settings → Applications → Vercel → Repository access を確認

### ログの確認方法

#### ビルドログ

```bash
# 特定のデプロイメントのビルドログを表示
vercel logs <deployment-url>
```

または、Vercelダッシュボード → Deployments → 該当デプロイメント → Build Logs

#### ランタイムログ

```bash
# リアルタイムでログを監視
vercel logs --follow

# 特定の関数のログのみ表示
vercel logs --follow --filter="app/api/chat"
```

または、Vercelダッシュボード → Functions → 該当関数 → Logs

#### デバッグのヒント

本番環境でのデバッグには、コード内で`console.log()`を使用：

```typescript
// API Routeの例
export async function POST(request: Request) {
  console.log('Request received:', request.url);
  // ログはVercelのFunction Logsに表示される
}
```

---

## よく使うコマンド

### Vercel CLI基本コマンド

```bash
# ログイン
vercel login

# プロジェクトをリンク
vercel link

# プレビューデプロイ
vercel

# 本番デプロイ
vercel --prod

# 強制デプロイ（キャッシュ無視）
vercel --force

# デプロイメント一覧
vercel ls

# デプロイメント詳細
vercel inspect <deployment-url>

# デプロイメント削除
vercel remove <deployment-url>
```

### 環境変数管理

```bash
# 環境変数一覧
vercel env ls

# 環境変数をダウンロード
vercel env pull .env.local

# 環境変数を追加
vercel env add VARIABLE_NAME production

# 環境変数を削除
vercel env rm VARIABLE_NAME production
```

### ログとモニタリング

```bash
# リアルタイムログ監視
vercel logs --follow

# 特定のデプロイメントのログ
vercel logs <deployment-url>

# 特定の関数のログのみ
vercel logs --follow --filter="app/api/*"

# 本番環境のログのみ
vercel logs --follow --prod
```

### プロジェクト管理

```bash
# プロジェクト一覧
vercel project ls

# プロジェクト情報
vercel project <project-name>

# Git連携確認
vercel git ls

# Git連携を設定
vercel git connect
```

### ロールバック

```bash
# 直前のデプロイメントにロールバック
vercel rollback

# 特定のデプロイメントにロールバック
vercel rollback <deployment-url>
```

### ローカル開発

```bash
# 通常の開発サーバー
npm run dev

# Vercel環境で開発サーバー
vercel dev

# 本番ビルド
npm run build

# 本番モードで起動
npm start
```

### Git操作

```bash
# 現在のブランチを確認
git branch

# 新しいブランチを作成して切り替え
git checkout -b feature/new-feature

# 変更をステージング
git add .

# コミット
git commit -m "feat: Add new feature"

# GitHubにプッシュ
git push origin feature/new-feature

# mainブランチに戻る
git checkout main

# 最新のmainを取得
git pull origin main
```

---

## 本番環境チェックリスト

デプロイ前に以下を確認してください：

### セキュリティ

- [ ] `.env.local`が`.gitignore`に含まれている
- [ ] 秘密情報（APIキー、パスワード）がコードに含まれていない
- [ ] Supabase RLSポリシーが適切に設定されている
- [ ] OpenAI APIキーの使用量制限を設定している

### 環境変数

- [ ] すべての必須環境変数がVercelダッシュボードに設定されている
- [ ] Production、Preview、Development環境すべてに設定されている
- [ ] クライアント側変数に`NEXT_PUBLIC_`プレフィックスが付いている
- [ ] サーバー側専用変数に`NEXT_PUBLIC_`プレフィックスが付いていない

### ビルドとテスト

- [ ] `npm run build`がローカルで成功する
- [ ] `npm start`で本番ビルドが正常に動作する
- [ ] TypeScriptのエラーがない（`npm run lint`）
- [ ] 主要機能が動作することを確認

### デプロイ設定

- [ ] `vercel.json`が正しく設定されている
- [ ] GitHub連携が設定されている
- [ ] Supabase統合が追加されている（推奨）
- [ ] Proプランが有効（30秒タイムアウトに必要）

### モニタリング

- [ ] Vercelダッシュボードでデプロイ成功を確認
- [ ] 本番URLにアクセスして動作確認
- [ ] エラーログをチェック
- [ ] パフォーマンスメトリクスを確認

---

## 参考リンク

### 公式ドキュメント

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Supabase Integration](https://vercel.com/integrations/supabase)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
- [Deploying Next.js](https://nextjs.org/docs/deployment)

---

## サポート

問題が解決しない場合は以下をご確認ください：

- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Supabase Discord](https://discord.supabase.com/)

---

**最終更新**: 2025-11-05