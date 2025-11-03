# 修正版 Google Apps Script コード

以下のコードでGoogle Apps Scriptの**Code.gs**を完全に置き換えてください。

```javascript
/**
 * データ整理問題用スプレッドシート管理（修正版）
 * テンプレートをコピーして個人専用シートを作成
 */

// テンプレートのスプレッドシートID
const TEMPLATE_SPREADSHEET_ID = '11MO0z4zCvf2G3xdHBoLw_l7-p-IzZ-AiMDNJN-NYQ7A';

// 保存先のフォルダIDを指定
const TARGET_FOLDER_ID = '1ctTvwePc7tPj0HML3q6LxEPw9kaLOrOv';

/**
 * 新しいデータ整理問題シートを作成
 */
function createDataProblemSheet(userEmail, sessionId) {
  try {
    console.log('Creating new sheet for user:', userEmail, 'session:', sessionId);
    
    // テンプレートスプレッドシートを開く
    const templateSheet = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
    
    // 新しい名前でコピー作成
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const newSheetName = `Data-Problem-${sessionId}-${timestamp}`;
    
    // テンプレートをコピー
    const newSheet = templateSheet.copy(newSheetName);

    // ファイルを指定フォルダに移動
    try {
      const newFile = DriveApp.getFileById(newSheet.getId());
      const targetFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);
      newFile.moveTo(targetFolder);
      console.log('Moved new sheet to folder:', TARGET_FOLDER_ID);
    } catch (e) {
      console.warn('Could not move file to target folder. File remains in root.', e.message);
    }
    
    // 作成者に編集権限を付与
    if (userEmail && userEmail.includes('@')) {
      try {
        newSheet.addEditor(userEmail);
        console.log('Added editor:', userEmail);
      } catch (e) {
        console.warn('Could not add editor, will proceed without specific permissions:', e.message);
      }
    }
    
    const result = {
      spreadsheetId: newSheet.getId(),
      spreadsheetUrl: newSheet.getUrl(),
      editUrl: newSheet.getUrl() + '#gid=0',
      embedUrl: `https://docs.google.com/spreadsheets/d/${newSheet.getId()}/edit?usp=sharing`,
      sheetName: newSheetName,
      created: new Date().toISOString()
    };
    
    console.log('Sheet created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error creating sheet:', error);
    throw new Error(`Failed to create sheet: ${error.message}`);
  }
}

/**
 * スプレッドシート内の「全シート」から「全データ」を取得する
 * @param {string} spreadsheetId 調査対象のスプレッドシートID
 * @returns {Object} 全シートのデータを含むオブジェクト（各シートにproblemText, answerText, quizDataを含む）
 */
function getSheetData(spreadsheetId) {
  try {
    console.log('Getting all data from all sheets in:', spreadsheetId);

    // 対象のスプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    // すべてのシートを取得
    const allSheets = spreadsheet.getSheets();

    const sheets = []; // 全シートのデータを格納する配列

    // for...of ループですべてのシートを順番に処理
    for (const sheet of allSheets) {
      // A2: 問題文（単一セル）
      let problemText = '';
      try {
        const a2 = sheet.getRange('A2').getValue();
        problemText = a2 ? String(a2) : '';
      } catch (e) {
        console.warn('Failed to read A2 for problemText:', e && e.message ? e.message : e);
      }

      // A5: answerText（単一セル）
      let answerText = '';
      try {
        const a5 = sheet.getRange('A5').getValue();
        answerText = a5 ? String(a5) : '';
      } catch (e) {
        console.warn('Failed to read A5 for answerText:', e && e.message ? e.message : e);
      }

      // 8行目以降のデータを取得（A～Z列）
      const quizData = [];
      const lastRow = sheet.getLastRow();

      // 8行目以降にデータがある場合のみ処理
      if (lastRow >= 8) {
        // 8行目から最終行まで、A列（1）～Z列（26）のデータを取得
        const quizRange = sheet.getRange(8, 1, lastRow - 7, 26);
        const quizValues = quizRange.getValues();

        // 各セルをオブジェクトに変換（空白セルは除外）
        for (let rowIdx = 0; rowIdx < quizValues.length; rowIdx++) {
          const actualRow = rowIdx + 8; // 実際の行番号（8始まり）

          for (let colIdx = 0; colIdx < 26; colIdx++) {
            const actualCol = colIdx + 1; // 実際の列番号（1始まり）
            const colLetter = String.fromCharCode(65 + colIdx); // A～Z
            const cellAddress = colLetter + actualRow;
            const value = quizValues[rowIdx][colIdx];

            // 値を文字列に変換
            const stringValue = value !== null && value !== undefined ? String(value) : '';

            // 空白セル（空文字列またはスペースのみ）はスキップ
            if (stringValue.trim() !== '') {
              quizData.push({
                cellAddress: cellAddress,
                value: stringValue
              });
            }
          }
        }
      }

      // 現在のシートでデータが入力されている範囲全体を取得（後方互換のため保持）
      const dataRange = sheet.getDataRange();
      const tableData = dataRange.getValues();

      // 各シートの結果をオブジェクトにまとめる
      const sheetData = {
        sheetName: sheet.getName(),    // シート名
        sheetId: sheet.getSheetId(),   // シートID
        problemText: problemText,      // A2セルの値
        answerText: answerText,        // A5セルの値
        quizData: quizData,            // 8行目以降のデータ（A～Z列）
        tableData: tableData,          // シートの全データ（後方互換用）
        startRow: dataRange.getRow(),  // データ範囲の開始行（1始まり）
        startColumn: dataRange.getColumn(), // データ範囲の開始列（1始まり）
        lastRow: sheet.getLastRow(),   // 最終行
        lastColumn: sheet.getLastColumn() // 最終列
      };

      // 配列に結果を追加
      sheets.push(sheetData);
    }

    // 最終的な結果オブジェクト
    const result = {
      sheets: sheets,
      lastModified: new Date().toISOString()
    };

    console.log('All sheet data retrieved successfully.');
    console.log('==============data start=============')
    console.log(result.sheets)
    console.log('==============data end=============')
    return result;

  } catch (error) {
    console.error('Error getting all sheet data:', error);
    throw new Error(`Failed to get all sheet data: ${error.message}`);
  }
}

/**
 * Web App エンドポイント
 */
function doPost(e) {
  try {
    // リクエストボディを解析
    const requestBody = JSON.parse(e.postData.contents);
    const action = requestBody.action;
    
    console.log('Received request:', action, requestBody);
    
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
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    // 成功レスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('doPost error:', error);
    
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET リクエスト対応（テスト用）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Data Problem Sheet Manager API is running',
      timestamp: new Date().toISOString(),
      available_actions: ['createSheet', 'getSheetData']
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 🔧 **主な修正点**

1. **`.setHeaders()` メソッドを削除** - Google Apps Scriptでは未サポート
2. **CORS対応を簡素化** - Google Apps Scriptは自動的にCORS対応
3. **エラーハンドリングを簡素化**
4. **テンプレートIDを正しい値に設定**

## 📋 **更新手順**

1. **Google Apps Script エディタ**を開く
2. **Code.gs** の内容を上記コードで**完全に置き換え**
3. **「保存」**をクリック
4. **「デプロイ」→「新しいデプロイ」**で再デプロイ

## ✅ **更新後のテスト**

```bash
curl -X POST http://localhost:3000/api/gas/test-create | jq .
```

これで正常にスプレッドシートが作成されるはずです！