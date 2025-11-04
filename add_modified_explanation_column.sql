-- Add modified_explanation and assessment_spreadsheet_id columns to problems table
-- Run this in Supabase SQL Editor to add the new columns

ALTER TABLE problems 
ADD COLUMN IF NOT EXISTS modified_explanation TEXT;

COMMENT ON COLUMN problems.modified_explanation IS '修正後の解説（agent-assessmentページで編集された解説）';

ALTER TABLE problems 
ADD COLUMN IF NOT EXISTS assessment_spreadsheet_id TEXT;

COMMENT ON COLUMN problems.assessment_spreadsheet_id IS '自動診断用スプレッドシートのID（バックアップ用のスプシ②）';
