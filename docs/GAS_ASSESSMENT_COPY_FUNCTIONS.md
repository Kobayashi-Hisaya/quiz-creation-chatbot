# Google Apps Script - Assessment Spreadsheet Copy Functions

診断・修正機能用に、既存のスプレッドシートをコピーして修正前/修正後のデータを保持する機能を追加します。

## 追加する関数

以下のコードを **Code.gs** に追加してください。

```javascript
/**
 * 診断用に既存スプレッドシートをコピー
 * 目的: 修正前のデータを保持したまま、修正後のデータを別カラムに保存できるようにする
 * 
 * @param {string} originalSpreadsheetId - コピー元のスプレッドシートID
 * @param {string} userEmail - ユーザーのメールアドレス
 * @param {string} sessionId - セッションID
 * @return {object} 新しいスプレッドシートの情報
 */
function copySpreadsheetForAssessment(originalSpreadsheetId, userEmail, sessionId) {
  try {
    console.log('Copying spreadsheet for assessment:', originalSpreadsheetId);
    
    // 元のスプレッドシートを開く
    const originalSheet = SpreadsheetApp.openById(originalSpreadsheetId);
    
    // 新しい名前でコピー作成
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const newSheetName = `Assessment-Copy-${sessionId}-${timestamp}`;
    
    console.log('Creating copy with name:', newSheetName);
    const newSheet = originalSheet.copy(newSheetName);
    
    // 最初のシートを取得して修正用カラムを追加
    const sheet = newSheet.getSheets()[0];
    const lastRow = sheet.getLastRow();
    const lastColumn = sheet.getLastColumn();
    
    console.log('Original sheet dimensions:', lastRow, 'rows x', lastColumn, 'columns');
    
    // 「修正後」カラムのヘッダーを追加
    // 既存のデータ構造に応じて適切な位置に配置
    const modifiedColumnStart = lastColumn + 1;
    
    // ヘッダー行を作成（問題文、コード、解説用の修正後カラム）
    sheet.getRange(1, modifiedColumnStart).setValue('【修正後】問題文');
    sheet.getRange(1, modifiedColumnStart + 1).setValue('【修正後】コード');
    sheet.getRange(1, modifiedColumnStart + 2).setValue('【修正後】解説');
    
    // ヘッダーのスタイル設定
    const headerRange = sheet.getRange(1, modifiedColumnStart, 1, 3);
    headerRange.setBackground('#FFE4B5'); // 薄いオレンジ色
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // 列幅を自動調整
    sheet.autoResizeColumns(modifiedColumnStart, 3);
    
    // 編集権限を付与
    if (userEmail && userEmail.includes('@')) {
      try {
        newSheet.addEditor(userEmail);
        console.log('Added editor:', userEmail);
      } catch (e) {
        console.warn('Could not add editor:', e.message);
      }
    }
    
    const result = {
      spreadsheetId: newSheet.getId(),
      spreadsheetUrl: newSheet.getUrl(),
      editUrl: newSheet.getUrl() + '#gid=0',
      embedUrl: `https://docs.google.com/spreadsheets/d/${newSheet.getId()}/edit?usp=sharing`,
      originalSpreadsheetId: originalSpreadsheetId,
      sheetName: newSheetName,
      created: new Date().toISOString(),
      modifiedColumnsAdded: {
        problemTextColumn: modifiedColumnStart,
        codeColumn: modifiedColumnStart + 1,
        explanationColumn: modifiedColumnStart + 2
      }
    };
    
    console.log('Assessment copy created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error copying spreadsheet for assessment:', error);
    throw new Error(`Failed to copy spreadsheet: ${error.message}`);
  }
}

/**
 * 修正内容をスプレッドシートに反映
 * 修正後のデータを専用カラムに書き込む
 * 
 * @param {string} spreadsheetId - 修正対象のスプレッドシートID
 * @param {object} updatedData - 修正後のデータ
 * @return {object} 更新結果
 */
function updateAssessmentSheet(spreadsheetId, updatedData) {
  try {
    console.log('Updating assessment sheet:', spreadsheetId);
    console.log('Updated data:', updatedData);
    
    const sheet = SpreadsheetApp.openById(spreadsheetId);
    const firstSheet = sheet.getSheets()[0];
    const lastColumn = firstSheet.getLastColumn();
    
    // 修正後データを書き込む開始カラムを計算
    // ヘッダー行から「【修正後】」で始まるカラムを探す
    const headerRow = firstSheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    let modifiedColumnStart = -1;
    
    for (let i = 0; i < headerRow.length; i++) {
      if (headerRow[i] && headerRow[i].toString().includes('【修正後】')) {
        modifiedColumnStart = i + 1; // 1-indexed
        break;
      }
    }
    
    if (modifiedColumnStart === -1) {
      throw new Error('Modified columns not found in spreadsheet');
    }
    
    console.log('Writing to modified columns starting at:', modifiedColumnStart);
    
    // データの開始行（通常は2行目から）
    const dataStartRow = 2;
    
    // 修正後の問題文
    if (updatedData.problemText !== undefined && updatedData.problemText !== null) {
      firstSheet.getRange(dataStartRow, modifiedColumnStart).setValue(updatedData.problemText);
      console.log('Updated problem text');
    }
    
    // 修正後のコード
    if (updatedData.code !== undefined && updatedData.code !== null) {
      firstSheet.getRange(dataStartRow, modifiedColumnStart + 1).setValue(updatedData.code);
      console.log('Updated code');
    }
    
    // 修正後の解説
    if (updatedData.explanation !== undefined && updatedData.explanation !== null) {
      firstSheet.getRange(dataStartRow, modifiedColumnStart + 2).setValue(updatedData.explanation);
      console.log('Updated explanation');
    }
    
    // タイムスタンプを記録（オプション）
    if (lastColumn + 4 <= 26) { // Z列までの範囲内
      firstSheet.getRange(dataStartRow, lastColumn + 4).setValue(new Date().toISOString());
    }
    
    const result = {
      success: true,
      spreadsheetId: spreadsheetId,
      updatedAt: new Date().toISOString(),
      updatedFields: Object.keys(updatedData)
    };
    
    console.log('Assessment sheet updated successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error updating assessment sheet:', error);
    throw new Error(`Failed to update assessment sheet: ${error.message}`);
  }
}

/**
 * 診断用スプレッドシートからデータを取得（修正前/修正後の両方）
 * 
 * @param {string} spreadsheetId - スプレッドシートID
 * @return {object} スプレッドシートのデータ（修正前/修正後）
 */
function getAssessmentSheetData(spreadsheetId) {
  try {
    console.log('Getting assessment sheet data:', spreadsheetId);
    
    const sheet = SpreadsheetApp.openById(spreadsheetId);
    const firstSheet = sheet.getSheets()[0];
    const lastRow = firstSheet.getLastRow();
    const lastColumn = firstSheet.getLastColumn();
    
    // 全データを取得
    let allData = [];
    if (lastRow >= 1 && lastColumn >= 1) {
      const dataRange = firstSheet.getRange(1, 1, lastRow, lastColumn);
      allData = dataRange.getValues();
    }
    
    // ヘッダー行から修正後カラムの位置を特定
    const headerRow = allData[0] || [];
    let originalDataEnd = -1;
    let modifiedColumnStart = -1;
    
    for (let i = 0; i < headerRow.length; i++) {
      if (headerRow[i] && headerRow[i].toString().includes('【修正後】')) {
        modifiedColumnStart = i;
        originalDataEnd = i - 1;
        break;
      }
    }
    
    // 修正前データ（元のカラム）
    const originalData = allData.map(row => 
      originalDataEnd > 0 ? row.slice(0, originalDataEnd + 1) : row
    );
    
    // 修正後データ（追加されたカラム）
    let modifiedData = [];
    if (modifiedColumnStart > 0) {
      modifiedData = allData.map(row => row.slice(modifiedColumnStart));
    }
    
    const result = {
      spreadsheetId: spreadsheetId,
      originalData: originalData,
      modifiedData: modifiedData,
      hasModifications: modifiedColumnStart > 0,
      lastRow: lastRow,
      lastColumn: lastColumn,
      lastModified: new Date().toISOString()
    };
    
    console.log('Assessment sheet data retrieved successfully');
    return result;
    
  } catch (error) {
    console.error('Error getting assessment sheet data:', error);
    throw new Error(`Failed to get assessment sheet data: ${error.message}`);
  }
}
```

## doPost 関数への追加

既存の `doPost` 関数の `switch` 文に以下のケースを追加してください：

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

case 'getAssessmentSheetData':
  result = getAssessmentSheetData(requestBody.spreadsheetId);
  break;
```

## 使用方法

### 1. スプレッドシートをコピー

```javascript
// リクエスト
{
  "action": "copySpreadsheetForAssessment",
  "originalSpreadsheetId": "1abc...",
  "userEmail": "user@example.com",
  "sessionId": "session-123"
}

// レスポンス
{
  "success": true,
  "data": {
    "spreadsheetId": "1xyz...",
    "spreadsheetUrl": "https://...",
    "originalSpreadsheetId": "1abc...",
    "modifiedColumnsAdded": {
      "problemTextColumn": 5,
      "codeColumn": 6,
      "explanationColumn": 7
    }
  }
}
```

### 2. 修正内容を保存

```javascript
// リクエスト
{
  "action": "updateAssessmentSheet",
  "spreadsheetId": "1xyz...",
  "updatedData": {
    "problemText": "修正後の問題文",
    "code": "修正後のコード",
    "explanation": "修正後の解説"
  }
}

// レスポンス
{
  "success": true,
  "data": {
    "success": true,
    "spreadsheetId": "1xyz...",
    "updatedAt": "2025-11-04T12:00:00.000Z"
  }
}
```

## 注意事項

- スプレッドシートのコピーには Google Drive の容量を消費します
- コピー処理には数秒かかる場合があります
- 修正前のデータは元のカラムに、修正後のデータは新しいカラムに保存されます
- ヘッダー行は「【修正後】」という接頭辞で識別されます
