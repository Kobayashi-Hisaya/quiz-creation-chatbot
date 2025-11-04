# 診断・修正機能の実装完了

## 📋 実装概要

**目的**: 問題作成時のスプレッドシートと修正後のスプレッドシートを別々に保持し、修正前後の変化を比較できるようにする

**実装方針**: `/agent-assessment` 画面に遷移したときに元のスプレッドシートをコピーし、修正内容を新しいスプレッドシートの専用カラムに保存

---

## ✅ 完了した実装

### 1. **GAS 関数の追加** (`docs/GAS_ASSESSMENT_COPY_FUNCTIONS.md`)

新しい3つの GAS 関数を追加：

#### `copySpreadsheetForAssessment(originalSpreadsheetId, userEmail, sessionId)`
- 元のスプレッドシートをコピー
- 「【修正後】問題文」「【修正後】コード」「【修正後】解説」の3つのカラムを追加
- 新しいスプレッドシート ID を返す

#### `updateAssessmentSheet(spreadsheetId, updatedData)`
- 修正内容を「【修正後】」カラムに書き込み
- 元のデータは元のカラムに保持されたまま

#### `getAssessmentSheetData(spreadsheetId)`
- 修正前/修正後の両方のデータを取得

**doPost に追加するケース**:
```javascript
case 'copySpreadsheetForAssessment':
  result = copySpreadsheetForAssessment(
    requestBody.originalSpreadsheetId,
    requestBody.userEmail,
    requestBody.sessionId
  );
  break;

case 'updateAssessmentSheet':
  result = updateAssessmentSheet(
    requestBody.spreadsheetId,
    requestBody.updatedData
  );
  break;
```

---

### 2. **GAS クライアントサービスの拡張** (`src/services/gasClientService.ts`)

新しいメソッドを追加：

```typescript
async copySpreadsheetForAssessment(
  originalSpreadsheetId: string,
  userEmail: string,
  sessionId: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; editUrl: string } | null>

async updateAssessmentSheet(
  spreadsheetId: string,
  updatedData: {
    problemText?: string;
    code?: string;
    explanation?: string;
  }
): Promise<{ success: boolean; updatedAt: string } | null>
```

---

### 3. **API ルートの追加**

#### `app/api/gas/copy-for-assessment/route.ts`
- GAS の `copySpreadsheetForAssessment` を呼び出すエンドポイント
- POST: `/api/gas/copy-for-assessment`

#### `app/api/gas/update-assessment/route.ts`
- GAS の `updateAssessmentSheet` を呼び出すエンドポイント
- POST: `/api/gas/update-assessment`

---

### 4. **`/agent-assessment` ページの実装** (`app/agent-assessment/page.tsx`)

#### 追加した State
```typescript
const [assessmentSpreadsheetId, setAssessmentSpreadsheetId] = useState<string | null>(null);
const [isCreatingCopy, setIsCreatingCopy] = useState(false);
const [isSavingEdits, setIsSavingEdits] = useState(false);
```

#### 初期化処理（useEffect）
1. SessionStorage から問題データを取得
2. 元のスプレッドシート ID (`spreadsheet_id`) を取得
3. **スプレッドシートをコピー**（`copySpreadsheetForAssessment`）
4. 新しい `assessmentSpreadsheetId` を保存
5. コピー完了後、自動診断を実行

#### 新しい関数
```typescript
// 修正内容をスプレッドシートに保存
const handleSaveEdits = async () => {
  await gasClientService.updateAssessmentSheet(
    assessmentSpreadsheetId,
    {
      problemText: editedProblemText,
      code: editedCode,
      explanation: editedExplanation,
    }
  );
}
```

#### 右パネルの UI 変更
- **以前**: スプレッドシート埋め込み表示
- **現在**: 編集フィールド（問題文、コード、解説）
- **保存ボタン**: 「💾 スプシに保存」で修正内容をスプレッドシートに反映

---

## 🔄 動作フロー

### 1. 問題作成フロー
```
/create-quiz
  ↓ スプレッドシート作成（spreadsheet_id: "ABC123"）
/add-explanation
  ↓ タイトル入力・解説追加
  ↓ SessionStorage に保存
/agent-assessment（遷移時）
```

### 2. 診断・修正フロー（実装完了）
```
/agent-assessment 遷移
  ↓
① スプレッドシートをコピー
   元: "ABC123" → 新: "XYZ789"
   新しいシートに「【修正後】」カラムを追加
  ↓
② 自動診断実行
   OpenAI gpt-5-nano で診断結果を取得
  ↓
③ 左パネル: AI診断結果を表示
   右パネル: 編集フィールドを表示
  ↓
④ ユーザーが修正内容を編集
  ↓
⑤ 「💾 スプシに保存」クリック
   修正内容を「XYZ789」の【修正後】カラムに保存
  ↓
⑥ スプレッドシートで比較
   元のカラム: 修正前のデータ
   【修正後】カラム: 修正後のデータ
```

---

## 📊 スプレッドシート構造

### コピー後のスプレッドシート

| A列      | B列    | C列    | ... | X列（例）        | Y列（例）      | Z列（例）      |
|----------|--------|--------|-----|------------------|----------------|----------------|
| 元データ | 元データ | 元データ | ... | 【修正後】問題文 | 【修正後】コード | 【修正後】解説 |
| 問題文A  | コードA | 解説A  | ... | （空白）         | （空白）       | （空白）       |

### 修正保存後

| A列      | B列    | C列    | ... | X列              | Y列            | Z列            |
|----------|--------|--------|-----|------------------|----------------|----------------|
| 元データ | 元データ | 元データ | ... | 【修正後】問題文 | 【修正後】コード | 【修正後】解説 |
| 問題文A  | コードA | 解説A  | ... | **問題文B**      | **コードB**    | **解説B**      |

**比較可能**: 同じ行で修正前（A～C列）と修正後（X～Z列）を並べて確認できる

---

## 🚀 次のステップ（デプロイ前の確認事項）

### 1. GAS コードのデプロイ
1. Google Apps Script エディタを開く
2. `docs/GAS_ASSESSMENT_COPY_FUNCTIONS.md` のコードをコピー
3. `doPost` 関数に新しいケースを追加
4. 再デプロイ（「デプロイ」→「デプロイを管理」→「新しいバージョン」）

### 2. 環境変数の確認
```env
GAS_WEB_APP_URL=https://script.google.com/macros/s/.../exec
OPENAI_API_KEY=sk-...
```

### 3. ローカルテスト
```powershell
npm run dev
```

1. 問題作成画面で問題を作成
2. `/agent-assessment` に遷移
3. スプレッドシートが自動コピーされることを確認
4. 診断結果が表示されることを確認
5. 右パネルで編集 → 「💾 スプシに保存」
6. スプレッドシートを開いて「【修正後】」カラムに保存されていることを確認

---

## 💡 注意事項

### スプレッドシートコピーについて
- コピー処理には数秒かかる場合があります
- Google Drive の容量を消費します
- 元のスプレッドシートは変更されません

### 修正内容の保存
- 「💾 スプシに保存」ボタンで明示的に保存する必要があります
- DB への正式登録は「✅ 登録」ボタンで行います

### データの持続性
- 修正前: 元のスプレッドシート（`spreadsheet_id`）
- 修正後: 診断用スプレッドシート（`assessmentSpreadsheetId`）
- 両方とも Google Drive に保存されるため、いつでも比較可能

---

## 🎯 達成した機能

✅ スプレッドシートの自動コピー（遷移時）  
✅ 修正前/修正後のデータを別カラムに保存  
✅ 診断結果を見ながら編集できる UI  
✅ 修正内容をスプレッドシートに保存  
✅ 元のスプレッドシートは変更されない  
✅ 比較用に両方のスプレッドシートを保持  

これで実験時に「作成段階」と「修正段階」のデータを比較できます！
