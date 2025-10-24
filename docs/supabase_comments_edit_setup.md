# Supabase コメント編集機能の設定ガイド

## 必要なセットアップ手順

### 1. テーブルカラムの確認と追加

Supabase SQL エディタで以下を実行してください：

```sql
-- problem_commentsテーブルに必要なカラムを追加（既に存在する場合はスキップされます）
ALTER TABLE problem_comments
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT false;

-- updated_atを自動更新するトリガーを削除（重複防止）
DROP TRIGGER IF EXISTS update_problem_comments_updated_at ON problem_comments;

-- トリガー関数を作成
CREATE OR REPLACE FUNCTION update_problem_comments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成
CREATE TRIGGER update_problem_comments_updated_at
  BEFORE UPDATE ON problem_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_problem_comments_updated_at_column();
```

### 2. RLS ポリシーの更新

以下の UPDATE ポリシーが必要です：

```sql
-- UPDATE ポリシーを追加（自分のコメントのみ編集可能）
DROP POLICY IF EXISTS "Users can update own comments" ON problem_comments;
CREATE POLICY "Users can update own comments" ON problem_comments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 3. 完全なセットアップ（テーブルを一から作り直す場合）

既存のテーブルを削除して再作成する場合は以下を実行：

```sql
-- 既存のテーブルを削除
DROP TABLE IF EXISTS problem_comments CASCADE;

-- 新しいテーブルを作成
CREATE TABLE problem_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_edited BOOLEAN DEFAULT false
);

-- RLS を有効化
ALTER TABLE problem_comments ENABLE ROW LEVEL SECURITY;

-- SELECT ポリシー（全員が閲覧可能）
CREATE POLICY "Users can view comments" ON problem_comments
  FOR SELECT USING (true);

-- INSERT ポリシー（自分のコメントのみ作成）
CREATE POLICY "Users can create comments" ON problem_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE ポリシー（自分のコメントのみ編集）
CREATE POLICY "Users can update own comments" ON problem_comments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE ポリシー（自分のコメント + 管理者が削除可能）
CREATE POLICY "Users can delete own comments" ON problem_comments
  FOR DELETE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- トリガー関数を作成
CREATE OR REPLACE FUNCTION update_problem_comments_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成
CREATE TRIGGER update_problem_comments_updated_at
  BEFORE UPDATE ON problem_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_problem_comments_updated_at_column();
```

## 動作確認手順

1. **assessment ページにアクセス**
   ```
   localhost:3001/assessment?problemId=<問題ID>
   ```

2. **コメントを投稿**

3. **自分のコメントに「編集」ボタンが表示されることを確認**

4. **編集ボタンをクリック**して内容を変更

5. **「保存」ボタンをクリック**

6. **ブラウザの開発者ツール（F12）**で以下のログを確認：
   ```
   [Assessment] コメント編集開始: {...}
   [problemService] updateComment 開始: {...}
   [problemService] 更新データ: {...}
   [problemService] updateComment API 結果: {...}
   [Assessment] コメント編集成功、コメント一覧をリロード
   ```

7. **Supabase のテーブルを確認** して、`updated_at` が変更され、`is_edited` が `true` になっていることを確認

## トラブルシューティング

### エラー: `new row violates row-level security policy`

**原因**: UPDATE ポリシーが存在しないか、正しく設定されていない

**解決策**: 「2. RLS ポリシーの更新」のセクションを実行

### `is_edited` が `false` のまま

**原因**: トリガーが `is_edited` をリセットしている可能性

**解決策**: トリガーを削除し、手動で設定するように変更

```sql
DROP TRIGGER IF EXISTS update_problem_comments_updated_at ON problem_comments;
```

### コメントが画面に反映されない

**原因**: `getProblemComments` が新しいデータを取得できていない

**解決策**: 
- ブラウザのコンソールでエラーを確認
- Supabase のネットワークタブで API リクエスト/レスポンスを確認
