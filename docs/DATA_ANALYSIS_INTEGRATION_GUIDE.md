# データ整理問題統合ガイド

## 📋 **あなたが実行する必要がある設定手順**

### **Step 1: Googleスプレッドシートテンプレート作成**

1. **新しいGoogleスプレッドシートを作成**
   - タイトル: "Data Analysis Problem Template"
   - 以下の構造で作成:

```
A1: "データ整理問題作成シート" (太字16pt、背景色 #E3F2FD)
A2-A3: 空行
A4: "■ 問題文" (太字12pt、背景色 #F5F5F5)
A5-A15: 空セル (問題文入力エリア)
A16: 空行
A17: "■ データ・表操作エリア" (太字12pt、背景色 #F5F5F5)
A18: 空行
A19以降: 完全フリーエリア (A19～Z100)
```

2. **共有設定**
   - 「共有」→「リンクを知っている全員」
   - 権限: 「閲覧者」
   - **スプレッドシートIDをメモ** (URLの `/d/` の後の文字列)

### **Step 2: Google Apps Script セットアップ**

1. **新しいGASプロジェクト作成**
   - [script.google.com](https://script.google.com) → 「新しいプロジェクト」
   - プロジェクト名: "Data Problem Sheet Manager"

2. **コードの実装**
   - `/docs/GOOGLE_APPS_SCRIPT_CODE.md` のコードをコピー
   - `YOUR_TEMPLATE_SPREADSHEET_ID_HERE` を実際のテンプレートIDに置き換え

3. **デプロイ**
   - 「デプロイ」→「新しいデプロイ」
   - 種類: 「ウェブアプリ」
   - 実行者: 「自分」
   - アクセス: 「全員」
   - **デプロイURLをメモ**

### **Step 3: 環境変数設定**

`.env.local` ファイルに以下を追加:

```env
# Google Apps Script Web App URL
GAS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

`YOUR_SCRIPT_ID` をStep 2で取得したデプロイURLの実際のIDに置き換えてください。

### **Step 4: Supabaseスキーマ更新**

Supabaseダッシュボードで以下のSQLを実行:

```sql
-- プログラミング関連カラムを削除
ALTER TABLE problems 
DROP COLUMN IF EXISTS language,
DROP COLUMN IF EXISTS code,
DROP COLUMN IF EXISTS code_with_blanks;

-- データ整理問題用カラムを追加
ALTER TABLE problems 
ADD COLUMN IF NOT EXISTS spreadsheet_url TEXT,
ADD COLUMN IF NOT EXISTS spreadsheet_id TEXT,
ADD COLUMN IF NOT EXISTS problem_category TEXT DEFAULT 'data_analysis',
ADD COLUMN IF NOT EXISTS session_id UUID,
ADD COLUMN IF NOT EXISTS table_data JSONB;

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_problems_session_id ON problems(session_id);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(problem_category);
CREATE INDEX IF NOT EXISTS idx_problems_spreadsheet_id ON problems(spreadsheet_id);
```

## 🚀 **動作確認方法**

### **1. 開発サーバー起動**
```bash
npm run dev
```

### **2. ページアクセス**
- `http://localhost:3000/create-quiz` にアクセス
- 右パネルで「データ整理問題用シートを準備中...」表示を確認

### **3. スプレッドシート作成テスト**
- 自動的にスプレッドシートが作成される
- 作成されたシートがiframeで表示される
- 問題文入力エリアとデータ操作エリアが確認できる

### **4. 統合テスト**
- スプレッドシートに問題文を入力
- create-mcqページへの遷移を確認
- Supabaseへの保存テスト

## 🔧 **トラブルシューティング**

### **エラー: "Google Apps Script integration not configured"**
- `.env.local` の `GAS_WEB_APP_URL` が正しく設定されているか確認
- Google Apps Scriptが正しくデプロイされているか確認

### **エラー: "Failed to create sheet"**
- テンプレートスプレッドシートが「リンクを知っている全員が閲覧可能」になっているか確認
- Google Apps ScriptのテンプレートIDが正しいか確認

### **スプレッドシートが表示されない**
- ブラウザのiframe制限確認
- Google Apps Scriptの権限確認

## 🎯 **完成後の機能**

### **新しいワークフロー**
1. **create-quiz**: 自動でデータ整理問題用シート作成
2. **スプレッドシート**: 問題文 + 自由なデータ操作
3. **create-mcq**: 選択肢作成（データ操作結果を問う）
4. **Supabase**: 問題データ + スプレッドシートURL保存

### **問題例**
- 売上データから月別TOP3商品の抽出
- VLOOKUP関数での商品情報統合
- ピボットテーブルでの部門別集計
- 条件付き書式での異常値ハイライト

## 📝 **注意事項**

- Google Drive API は不要になりました
- 既存のプログラミング問題機能は無効化されます
- 各ユーザーに個別のスプレッドシートが作成されます
- スプレッドシートは永続化され、後から参照可能です