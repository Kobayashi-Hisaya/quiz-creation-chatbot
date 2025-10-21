# 修正版 Google Apps Script コード

以下のコードでGoogle Apps Scriptの**Code.gs**を完全に置き換えてください。

```javascript
/**
 * データ整理問題用スプレッドシート管理（修正版）
 * テンプレートをコピーして個人専用シートを作成
 */

// テンプレートのスプレッドシートID
const TEMPLATE_SPREADSHEET_ID = '1QO73qZXBxse4BnUAUPQ92a1oYHUaVp-XqknrfWHBJTg';

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
 * スプレッドシートからデータを取得
 */
function getSheetData(spreadsheetId) {
  try {
    console.log('Getting data from sheet:', spreadsheetId);
    
    const sheet = SpreadsheetApp.openById(spreadsheetId);
    const firstSheet = sheet.getSheets()[0];
    
    // 問題文エリア（A5:A15）を取得
    const problemTextRange = firstSheet.getRange('A5:A15');
    const problemTextValues = problemTextRange.getValues();
    const problemText = problemTextValues
      .map(row => row[0] || '')
      .filter(text => text.toString().trim() !== '')
      .join('\n');
    
    // データエリア（A19以降）の使用範囲を取得
    const lastRow = firstSheet.getLastRow();
    const lastColumn = firstSheet.getLastColumn();
    
    let tableData = [];
    if (lastRow >= 19 && lastColumn >= 1) {
      const dataRange = firstSheet.getRange(19, 1, lastRow - 18, lastColumn);
      tableData = dataRange.getValues();
    }
    
    const result = {
      problemText: problemText,
      tableData: tableData,
      lastModified: new Date().toISOString(),
      sheetInfo: {
        lastRow: lastRow,
        lastColumn: lastColumn,
        title: sheet.getName()
      }
    };
    
    console.log('Data retrieved successfully');
    return result;
    
  } catch (error) {
    console.error('Error getting sheet data:', error);
    throw new Error(`Failed to get sheet data: ${error.message}`);
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

/**
 * テスト関数
 */
function testCreateSheet() {
  const result = createDataProblemSheet('test@example.com', 'test-session-123');
  console.log('Test result:', result);
  return result;
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