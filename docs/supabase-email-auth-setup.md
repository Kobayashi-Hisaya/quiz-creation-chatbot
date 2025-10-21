# Supabaseメール認証設定ガイド

このドキュメントでは、Google OAuthからSupabaseメール認証への移行に必要なSupabaseダッシュボードでの設定手順を説明します。

## 前提条件

- Supabaseプロジェクトが作成済みであること
- Supabaseダッシュボードにアクセス権限があること

## 1. Authentication設定の変更

### 1.1 Google OAuth設定の無効化

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 左メニューから「Authentication」→「Providers」を選択
4. 「Google」プロバイダーを見つける
5. 「Enable sign in with Google」のトグルを**オフ**にする
6. 「Save」ボタンをクリック

### 1.2 Email認証の設定確認・調整

1. 「Authentication」→「Providers」で「Email」プロバイダーを確認
2. 「Enable email confirmations」を**オフ**にする
   - 理由: 管理者が事前にユーザーを作成するため、メール確認は不要
3. 「Enable email invites」は**オン**のまま（オプション）
4. 「Save」ボタンをクリック

### 1.3 セキュリティ設定の確認

1. 「Authentication」→「Settings」を選択
2. 以下の設定を確認・調整：

**Site URL:**
- 本番環境: `https://your-domain.com`
- 開発環境: `http://localhost:3000`

**Redirect URLs:**
- 本番環境: `https://your-domain.com/dashboard`
- 開発環境: `http://localhost:3000/dashboard`

**Password Requirements:**
- Minimum password length: 8文字以上を推奨
- Password complexity: 必要に応じて設定

## 2. RLS (Row Level Security) 設定の確認

既存の設定を確認し、Email認証でも正常に動作することを確認します。

### 2.1 profilesテーブルのRLS設定確認

1. 「Table Editor」→「profiles」テーブルを選択
2. 「RLS」タブを確認
3. 以下のポリシーが設定されていることを確認：
   - ユーザーは自分のプロファイルのみ参照可能
   - ユーザーは自分のプロファイルのみ更新可能
   - 管理者は全プロファイル参照可能

### 2.2 problemsテーブルのRLS設定確認

1. 「Table Editor」→「problems」テーブルを選択
2. 「RLS」タブを確認
3. 以下のポリシーが設定されていることを確認：
   - ユーザーは自分の問題のみ作成・参照・削除可能
   - 管理者は全問題参照・削除可能

## 3. 設定完了後の確認事項

### 3.1 設定の保存確認

1. すべての変更が保存されていることを確認
2. エラーメッセージが表示されていないことを確認

### 3.2 API キーの確認

1. 「Settings」→「API」を選択
2. 以下のキーが正しく設定されていることを確認：
   - `Project URL`
   - `anon/public key`

これらの値が`.env.local`ファイルの以下の環境変数と一致していることを確認：
```
NEXT_PUBLIC_SUPABASE_URL="YOUR_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

## 4. トラブルシューティング

### よくある問題と解決方法

**問題: ログインできない**
- Email confirmationが有効になっていないか確認
- パスワードの複雑さ要件を満たしているか確認
- ユーザーがSupabaseのAuthenticationに正しく作成されているか確認

**問題: リダイレクトが正しく動作しない**
- Site URLとRedirect URLが正しく設定されているか確認
- URLにポート番号が含まれている場合は正確に記述

**問題: RLSエラーが発生する**
- Row Level Securityのポリシーが正しく設定されているか確認
- ユーザーIDがprofilesテーブルに正しく作成されているか確認

## 5. 次のステップ

設定が完了したら、[user-management-guide.md](./user-management-guide.md)を参照してユーザーを作成してください。