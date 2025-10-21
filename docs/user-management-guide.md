# ユーザー管理ガイド

このドキュメントでは、Supabaseダッシュボードを使用してユーザーアカウントを作成・管理する方法を説明します。

## 新しいユーザーの作成手順

### ステップ1: Supabaseでユーザーを作成

1. Supabaseダッシュボードにログイン
2. プロジェクトを選択
3. 左メニューから「Authentication」→「Users」を選択
4. 「Add user」ボタンをクリック
5. 以下の情報を入力：
   - **Email**: ユーザーのメールアドレス（ログインIDとして使用）
   - **Password**: 初期パスワード（8文字以上推奨）
   - **Auto Confirm User**: ✅ チェックを入れる（メール確認をスキップ）
6. 「Send invitation」のチェックは**外す**（招待メールを送信しない）
7. 「Add User」ボタンをクリック

### ステップ2: プロファイルレコードの作成

ユーザーがSupabaseで作成されると、自動的にUUIDが割り当てられます。このUUIDを使用してプロファイルを作成します。

1. 作成されたユーザーのUUIDをコピー（Users一覧のIDカラム）
2. 左メニューから「Table Editor」→「profiles」テーブルを選択
3. 「Insert row」ボタンをクリック
4. 以下の情報を入力：
   - **id**: コピーしたユーザーのUUID
   - **email**: 同じメールアドレス
   - **is_admin**: 管理者権限を付与する場合は`true`、一般ユーザーは`false`
   - **created_at**: 自動入力（現在日時）
5. 「Save」ボタンをクリック

## ユーザー管理の例

### 例1: 一般学生ユーザーの作成

```
Email: student001@school.edu.jp
Password: Student2024!
is_admin: false
```

### 例2: 教員（管理者）ユーザーの作成

```
Email: teacher@school.edu.jp
Password: Teacher2024!
is_admin: true
```

### 例3: 複数ユーザーの一括作成

教室で使用する場合の例：

```
student001@school.edu.jp / Pass001!
student002@school.edu.jp / Pass002!
student003@school.edu.jp / Pass003!
...
teacher001@school.edu.jp / TeachPass! (管理者)
```

## 既存ユーザーの管理

### パスワードの変更

1. 「Authentication」→「Users」でユーザーを選択
2. 該当ユーザーの行をクリック
3. 「Reset Password」ボタンをクリック
4. 新しいパスワードを入力
5. 「Update password」をクリック

### 管理者権限の変更

1. 「Table Editor」→「profiles」テーブルを選択
2. 該当ユーザーのレコードを見つける
3. `is_admin`列を編集（`true`または`false`）
4. 変更を保存

### ユーザーの削除

1. 「Authentication」→「Users」でユーザーを選択
2. 該当ユーザーの行の「...」メニューをクリック
3. 「Delete user」を選択
4. 確認ダイアログで「Delete」をクリック

**注意**: ユーザーを削除すると、関連するプロファイルと作成した問題も削除される可能性があります。

## セキュリティのベストプラクティス

### パスワードポリシー

- **最小長**: 8文字以上
- **複雑さ**: 大文字・小文字・数字・記号を含む
- **例**: `Student2024!`, `MyPass123#`

### アカウント管理

- **定期的な見直し**: 不要なアカウントの削除
- **権限の最小化**: 必要最小限の管理者権限付与
- **パスワードの定期変更**: 学期ごとなど

## 初期セットアップ例

### 教室環境での初期セットアップ

1. **管理者アカウント作成**
   ```
   teacher@class.school.jp / AdminPass2024!
   is_admin: true
   ```

2. **テスト用学生アカウント作成**
   ```
   test-student@class.school.jp / TestPass123!
   is_admin: false
   ```

3. **動作確認**
   - 両方のアカウントでログインテスト
   - 権限の動作確認
   - 問題作成・保存の動作確認

## トラブルシューティング

### よくある問題

**問題: ユーザーが作成できない**
- Email形式が正しいか確認
- パスワードが複雑さ要件を満たしているか確認
- Auto Confirm Userにチェックが入っているか確認

**問題: ログインできない**
- Email確認が無効になっているか確認（[supabase-email-auth-setup.md](./supabase-email-auth-setup.md)参照）
- profilesテーブルに対応レコードが作成されているか確認
- UUIDが正しく一致しているか確認

**問題: 管理者権限が反映されない**
- profilesテーブルの`is_admin`フィールドが正しく設定されているか確認
- ブラウザをリフレッシュしてセッションを更新

## 次のステップ

ユーザー作成が完了したら、[migration-checklist.md](./migration-checklist.md)を参照して移行作業を完了してください。