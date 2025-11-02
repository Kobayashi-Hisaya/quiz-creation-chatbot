-- データ整理問題対応のためのSupabaseスキーマ更新
-- プログラミング関連フィールドを削除し、データ分析用フィールドを追加

-- Step 1: 不要なプログラミング関連カラムを削除
ALTER TABLE problems 
DROP COLUMN IF EXISTS language,
DROP COLUMN IF EXISTS code,
DROP COLUMN IF EXISTS code_with_blanks;

-- Step 2: データ整理問題用の新しいカラムを追加
ALTER TABLE problems 
ADD COLUMN IF NOT EXISTS spreadsheet_url TEXT,
ADD COLUMN IF NOT EXISTS spreadsheet_id TEXT,
ADD COLUMN IF NOT EXISTS problem_category TEXT DEFAULT 'data_analysis',
ADD COLUMN IF NOT EXISTS session_id UUID,
ADD COLUMN IF NOT EXISTS table_data JSONB;

-- Step 3: 既存データの問題カテゴリを更新（必要に応じて）
UPDATE problems 
SET problem_category = 'data_analysis' 
WHERE problem_category IS NULL;

-- Step 4: インデックス追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_problems_session_id ON problems(session_id);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(problem_category);
CREATE INDEX IF NOT EXISTS idx_problems_spreadsheet_id ON problems(spreadsheet_id);

-- Step 5: RLS (Row Level Security) ポリシーの更新
-- 既存のポリシーを確認して、新しいカラムに対応

-- 注意: 既存のproblemsテーブルにデータがある場合は、
-- 事前にバックアップを取ることを強く推奨します

-- Step 6: テーブル構造確認用クエリ
-- \d problems; -- PostgreSQLコマンドライン用
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'problems' 
-- ORDER BY ordinal_position;