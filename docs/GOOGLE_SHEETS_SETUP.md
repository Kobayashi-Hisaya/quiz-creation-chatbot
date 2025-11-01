# Google Sheets API セットアップ手順

このドキュメントでは、Google Sheets APIを使用するために必要なGCP（Google Cloud Platform）の設定手順を説明します。

## 📋 必要な作業の概要

1. Google Cloud Platformプロジェクトの作成
2. Google Sheets APIの有効化
3. サービスアカウントの作成
4. 認証情報の取得
5. 環境変数の設定

---

## 🚀 詳細手順

### Step 1: Google Cloud Platformプロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 右上の「プロジェクトを選択」をクリック
3. 「新しいプロジェクト」をクリック
4. プロジェクト名を入力（例: `quiz-creation-app`）
5. 「作成」をクリック

### Step 2: Google Sheets APIの有効化

1. 作成したプロジェクトを選択
2. 左側メニューから「APIとサービス」→「ライブラリ」を選択
3. 検索バーで「Google Sheets API」を検索
4. 「Google Sheets API」をクリック
5. 「有効にする」をクリック

### Step 3: サービスアカウントの作成

1. 左側メニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「サービスアカウント」をクリック
3. サービスアカウント名を入力（例: `sheets-service-account`）
4. サービスアカウントIDが自動生成されることを確認
5. 「作成して続行」をクリック
6. ロールの選択で「編集者」を選択（または「プロジェクト」→「編集者」）
7. 「続行」をクリック
8. 「完了」をクリック

### Step 4: サービスアカウントキーの作成

1. 作成されたサービスアカウントの行にある「✏️」（編集）アイコンをクリック
2. 「キー」タブをクリック
3. 「鍵を追加」→「新しい鍵を作成」をクリック
4. 「JSON」を選択
5. 「作成」をクリック
6. **JSONファイルがダウンロードされます（重要: 安全に保管してください）**

### Step 5: 環境変数の設定

ダウンロードしたJSONファイルを開き、以下の情報を確認してください：

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "sheets-service-account@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

プロジェクトの `.env` ファイルに以下の環境変数を追加してください：

```env
# Google Sheets API 設定
GOOGLE_SERVICE_ACCOUNT_EMAIL=sheets-service-account@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

⚠️ **重要な注意事項:**
- `GOOGLE_PRIVATE_KEY` の値は必ずダブルクォートで囲んでください
- 改行文字（`\n`）はそのまま文字列として含めてください
- JSONファイルは機密情報です。Gitにコミットしないでください

---

## 🔧 環境変数の設定例

`.env.example` ファイルに以下を追加してください：

```env
# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

実際の `.env` ファイルには、ダウンロードしたJSONファイルから取得した実際の値を設定してください。

---

## ✅ 設定確認方法

設定が正しく完了しているかを確認するには：

1. プロジェクトを再起動: `npm run dev`
2. create-quiz ページにアクセス
3. 右パネルでGoogle Sheetsの接続オプションが表示されることを確認
4. 「新しいシートを作成」ボタンをクリック
5. Googleスプレッドシートが作成され、テンプレートが適用されることを確認

---

## 🚨 トラブルシューティング

### エラー: "Google Sheets authentication not configured"
- 環境変数が正しく設定されているか確認
- `.env` ファイルがプロジェクトルートに配置されているか確認
- Next.js を再起動（`npm run dev`）

### エラー: "Failed to create spreadsheet"
- サービスアカウントに適切な権限が付与されているか確認
- Google Sheets API が有効になっているか確認
- インターネット接続を確認

### JSONキーファイルが見つからない
- Google Cloud Console でサービスアカウントのキーを再作成
- ダウンロードしたJSONファイルの内容を確認

---

## 📞 サポート

設定に問題がある場合は、以下の情報と一緒に報告してください：
- エラーメッセージの全文
- ブラウザのコンソールログ
- 環境変数の設定状況（機密情報は除く）

設定が完了したら、開発を続行できます！