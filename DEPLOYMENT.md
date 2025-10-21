# Vercelデプロイ手順

## 前提条件

1. Vercelアカウントが必要
2. GitHubリポジトリがpublic/privateのどちらでも可
3. 環境変数の値を準備しておく

## デプロイ手順

### 1. Vercelプロジェクト作成

1. [Vercel](https://vercel.com/)にアクセスしてログイン
2. "New Project"をクリック
3. GitHubリポジトリを選択
4. プロジェクト名を設定（任意）
5. Framework PresetでNext.jsが自動選択されることを確認

### 2. 環境変数の設定

Vercelダッシュボードの Settings > Environment Variables で以下を設定：

```
OPENAI_API_KEY = sk-proj-...（OpenAI API Key）
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要**: すべての環境で同じ値を設定してください（Production, Preview, Development）

### 3. デプロイ実行

1. "Deploy"ボタンをクリック
2. ビルドが完了するまで待機（約2-3分）
3. デプロイ完了後、URLが発行される

## ビルド設定

### 自動設定される項目

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### カスタム設定（vercel.json）

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/*/route.js": {
      "maxDuration": 30
    }
  }
}
```

## トラブルシューティング

### よくある問題

1. **ビルドエラー**: 
   - ローカルで`npm run build`が成功することを確認
   - 型エラーやESLintエラーを解決

2. **環境変数エラー**:
   - 環境変数名のスペルミスを確認
   - Supabase URLが正しく設定されているか確認

3. **API呼び出しエラー**:
   - OpenAI API Keyが正しく設定されているか確認
   - Supabase認証設定を確認

### デバッグ方法

1. Vercelダッシュボードの Functions タブでログを確認
2. Real-time Logs を有効にして本番エラーを監視
3. Preview deployments で事前テスト

## セキュリティ考慮事項

- 環境変数は`.env.local`ではなくVercelの環境変数設定で管理
- APIキーは決してコミットしない
- Supabase RLS（Row Level Security）が適切に設定されていることを確認

## 継続的デプロイ

- GitHubにpushすると自動的にデプロイが実行される
- mainブランチ → Production環境
- その他のブランチ → Preview環境

## パフォーマンス最適化

Vercelでは以下が自動的に適用されます：

- Edge Functions
- 画像最適化
- Static Site Generation（SSG）
- CDNキャッシング
- gzip圧縮