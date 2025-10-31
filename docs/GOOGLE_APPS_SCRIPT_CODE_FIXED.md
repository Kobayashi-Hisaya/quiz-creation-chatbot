# 修正版 Google Apps Script コード

以下のコードでGoogle Apps Scriptの**Code.gs**を完全に置き換えてください。

```javascript
/**
 * データ整理問題用スプレッドシート管理（修正版）
 * テンプレートをコピーして個人専用シートを作成
 */

// テンプレートのスプレッドシートID
const TEMPLATE_SPREADSHEET_ID = '11MO0z4zCvf2G3xdHBoLw_l7-p-IzZ-AiMDNJN-NYQ7A';

// <<< 修正 (1) >>>
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

    // <<< 修正 (2) >>>
    // ここからが追加部分です
    try {
      // DriveApp を使って、作成されたファイルを取得
      const newFile = DriveApp.getFileById(newSheet.getId());
      
      // 保存先のフォルダを取得
      const targetFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);
      
      // ファイルを指定フォルダに移動
      newFile.moveTo(targetFolder);
      console.log('Moved new sheet to folder:', TARGET_FOLDER_ID);
      
    } catch (e) {
      // フォルダへの移動に失敗した場合（例: フォルダIDが間違っている、権限がないなど）
      console.warn('Could not move file to target folder. File remains in root.', e.message);
      // エラーにせず、処理は続行
    }
    // <<< 追加部分ここまで >>>
    
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
 * @returns {Object} 問題文と全シートのデータを含むオブジェクト
 */
function getSheetData(spreadsheetId) {
  try {
    console.log('Getting all data from all sheets in:', spreadsheetId);

    // 対象のスプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    // すべてのシートを取得
    const allSheets = spreadsheet.getSheets();

    // 問題文は最初のシートのA5:A15から取得
    let problemText = '';
    if (allSheets.length > 0) {
      const firstSheet = allSheets[0];
      const problemTextRange = firstSheet.getRange('A5:A15');
      const problemTextValues = problemTextRange.getValues();
      problemText = problemTextValues
        .map(row => row[0] || '')
        .filter(text => text.toString().trim() !== '')
        .join('\n');
    }

    const sheets = []; // 全シートのデータを格納する配列

    // for...of ループですべてのシートを順番に処理
    for (const sheet of allSheets) {
      // 現在のシートでデータが入力されている範囲全体を取得
      const dataRange = sheet.getDataRange();
      // その範囲の値を二次元配列として取得
      const tableData = dataRange.getValues();

      // 各シートの結果をオブジェクトにまとめる
      const sheetData = {
        sheetName: sheet.getName(),    // シート名
        sheetId: sheet.getSheetId(),   // シートID
        tableData: tableData,          // シートの全データ
        lastRow: sheet.getLastRow(),   // 最終行
        lastColumn: sheet.getLastColumn() // 最終列
      };

      // 配列に結果を追加
      sheets.push(sheetData);
    }

    // 最終的な結果オブジェクト
    const result = {
      problemText: problemText,
      sheets: sheets,
      lastModified: new Date().toISOString()
    };

    console.log('All sheet data retrieved successfully.');
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