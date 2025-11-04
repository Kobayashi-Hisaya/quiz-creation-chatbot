# GAS (Google Apps Script) 現在の使用状況まとめ

## 📊 現在のフロー

### 1️⃣ `/create-quiz` (問題作成)
```
action: 'createSheet'
→ テンプレートからスプシ①を作成
→ スプシ①のID: sessionStorage.currentSpreadsheetId に保存
```

**使用する GAS 関数:**
- `createDataProblemSheet(userEmail, sessionId)`
- テンプレートIDからコピーして新規シート作成
- TARGET_FOLDER_ID のフォルダに配置

---

### 2️⃣ `/add-explanation` (解説入力)
```
スプシ①のデータを表示（埋め込みビュー）
↓
タイトル入力 & 送信
↓
action: 'copySpreadsheetForAssessment'
→ スプシ①をコピーしてスプシ②を作成
→ スプシ②に【修正後】カラムを3つ追加:
   - 【修正後】問題文
   - 【修正後】コード
   - 【修正後】解説
→ スプシ②のID: sessionStorage.problemDataForAssessment.assessment_spreadsheet_id に保存
```

**使用する GAS 関数:**
- `copySpreadsheetForAssessment(originalSpreadsheetId, userEmail, sessionId)`
- スプシ①の完全コピーを作成
- 【修正後】カラムを追加（修正前/修正後の比較用）
- TARGET_FOLDER_ID のフォルダに配置

---

### 3️⃣ `/agent-assessment` (自動診断 & 修正)

#### 左側パネル: 自動診断結果
```
action: 'getSheetData' (スプシ②のデータ取得)
↓
/api/agent-assessment (gpt-5-nano で診断)
↓
フィードバックと修正案を表示
```

**使用する GAS 関数:**
- `getSheetData(spreadsheetId)` ← スプシ②を読み取り
- 全シートの全データを取得
- problemText, answerText, quizData を返す

#### 右側パネル: 修正作業
```
スプシ②の埋め込みビュー（編集可能）
または
フォームフィールドで編集
↓
「💾 スプシに保存」ボタンクリック
↓
action: 'updateAssessmentSheet'
→ 編集内容をスプシ②の【修正後】カラムに保存
```

**使用する GAS 関数:**
- `updateAssessmentSheet(spreadsheetId, updatedData)`
- updatedData: { problemText, code, explanation }
- スプシ②の【修正後】カラムに書き込み

---

## 🔧 必要な GAS 関数一覧

### ✅ 既に実装済み（code.gs.txt に存在）
1. ✅ `createDataProblemSheet(userEmail, sessionId)`
2. ✅ `getSheetData(spreadsheetId)`

### 🆕 追加が必要（COMPLETE_GAS_CODE.gs に記載）
3. 🆕 `copySpreadsheetForAssessment(originalSpreadsheetId, userEmail, sessionId)`
4. 🆕 `updateAssessmentSheet(spreadsheetId, updatedData)`
5. 🆕 `getAssessmentSheetData(spreadsheetId)` ← オプション（修正前/修正後を分けて取得）

---

## 🎯 スプレッドシートの役割分担

### スプシ① (元のスプレッドシート)
- **作成タイミング**: `/create-quiz` で問題作成時
- **役割**: 修正前のオリジナルデータを保持
- **保存場所**: `sessionStorage.currentSpreadsheetId`
- **特徴**: 読み取り専用（参照用）

### スプシ② (診断用コピー)
- **作成タイミング**: `/add-explanation` でタイトル送信時
- **役割**: 診断対象 & 修正作業用
- **保存場所**: `sessionStorage.problemDataForAssessment.assessment_spreadsheet_id`
- **特徴**: 
  - 元データ（スプシ①と同じ内容）
  - 【修正後】カラム（修正内容を保存）
  - 編集可能

---

## 📋 doPost に追加する switch case

```javascript
function doPost(e) {
  try {
    const requestBody = JSON.parse(e.postData.contents);
    const action = requestBody.action;
    
    let result;
    
    switch (action) {
      case 'createSheet':
        result = createDataProblemSheet(
          requestBody.userEmail, 
          requestBody.sessionId
        );
        break;
        
      case 'getSheetData':
        result = getSheetData(requestBody.spreadsheetId);
        break;
      
      // 🆕 追加1: スプレッドシートコピー
      case 'copySpreadsheetForAssessment':
        result = copySpreadsheetForAssessment(
          requestBody.originalSpreadsheetId,
          requestBody.userEmail,
          requestBody.sessionId
        );
        break;
      
      // 🆕 追加2: 修正内容保存
      case 'updateAssessmentSheet':
        result = updateAssessmentSheet(
          requestBody.spreadsheetId,
          requestBody.updatedData
        );
        break;
      
      // 🆕 追加3: 診断用データ取得（オプション）
      case 'getAssessmentSheetData':
        result = getAssessmentSheetData(requestBody.spreadsheetId);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('doPost error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 🚀 デプロイ手順

### オプションA: 差分追加（推奨）
1. Google Apps Script エディタで現在の `Code.gs` を開く
2. `docs/COMPLETE_GAS_CODE.gs` の以下の部分をコピー:
   - `copySpreadsheetForAssessment` 関数（行138-213）
   - `updateAssessmentSheet` 関数（行215-282）
   - `getAssessmentSheetData` 関数（行284-341）← オプション
3. `Code.gs` の既存関数の後ろに貼り付け
4. `doPost` 関数の `switch` 文に3つの `case` を追加（上記参照）
5. 「デプロイ」→「新しいデプロイ」→「バージョン」を作成

### オプションB: 完全置き換え
1. 共同作業者に確認: 「Code.gs に最近変更を加えましたか?」
2. 問題なければ、`docs/COMPLETE_GAS_CODE.gs` の内容で完全置き換え
3. 定数値（`TEMPLATE_SPREADSHEET_ID`, `TARGET_FOLDER_ID`）を確認
4. 「デプロイ」→「新しいデプロイ」

---

## 🧪 テスト方法

### 1. ローカル環境で Next.js 起動
```powershell
npm run dev
```

### 2. フローをテスト
1. `/create-quiz` で問題作成 → スプシ①が作成される
2. `/add-explanation` で解説入力 → タイトル送信
   - コンソールで「スプシ②作成完了」ログを確認
3. `/agent-assessment` に自動遷移
   - 左側: AI診断結果が表示される
   - 右側: スプシ②の埋め込みビュー or 編集フォーム
4. 右側で修正を加えて「💾 スプシに保存」
5. スプシ②を開いて【修正後】カラムに内容が保存されているか確認

---

## 📊 データフロー図

```
┌─────────────────┐
│  /create-quiz   │
│  問題作成       │
└────────┬────────┘
         │ createSheet
         ↓
    ┌─────────┐
    │ スプシ① │ ← 元のスプレッドシート（修正前データ）
    └────┬────┘
         │
         │ sessionStorage.currentSpreadsheetId
         ↓
┌─────────────────┐
│ /add-explanation│
│  解説入力       │
└────────┬────────┘
         │ タイトル送信
         │ copySpreadsheetForAssessment(スプシ①のID)
         ↓
    ┌─────────┐
    │ スプシ② │ ← 診断用コピー（修正後データも保存）
    └────┬────┘   - 元データ（A列～）
         │         - 【修正後】カラム（X列～）
         │
         │ sessionStorage.problemDataForAssessment.assessment_spreadsheet_id
         ↓
┌──────────────────┐
│ /agent-assessment│
│  自動診断 & 修正  │
├──────────┬───────┤
│左側      │右側   │
│AI診断    │修正   │
│結果      │作業   │
└──────────┴───────┘
    ↑          ↓
    │          │ updateAssessmentSheet
    │          └→ スプシ②の【修正後】カラムに保存
    │
    └─ getSheetData(スプシ②のID)
       /api/agent-assessment
       gpt-5-nano で診断
```

---

## ⚠️ 注意点

### 共同作業時の衝突回避
- 相手が `Code.gs` を編集している可能性があるため、**差分追加（オプションA）を推奨**
- 定数値（`TEMPLATE_SPREADSHEET_ID`, `TARGET_FOLDER_ID`）が異なる可能性
- デプロイ前にバージョン履歴を確認

### スプレッドシートID管理
- スプシ①: `currentSpreadsheetId` (create-quiz で作成)
- スプシ②: `assessment_spreadsheet_id` (add-explanation で作成)
- 混同しないように注意

### タイムアウト対策
- 診断時は `saveToDb: false` で DB 保存をスキップ
- スプレッドシートコピーに時間がかかる可能性があるため、ローディング表示を追加済み
