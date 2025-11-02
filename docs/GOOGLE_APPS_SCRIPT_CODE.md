# Google Apps Script コード

以下のコードをGoogle Apps Scriptプロジェクトにコピーしてください。

## Code.gs

```javascript
/**
 * データ整理問題用スプレッドシート管理
 * テンプレートをコピーして個人専用シートを作成
 */

// テンプレートのスプレッドシートID（あなたが作成したテンプレートのIDに置き換えてください）
const TEMPLATE_SPREADSHEET_ID = 'YOUR_TEMPLATE_SPREADSHEET_ID_HERE';

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
    
    // 誰でも編集可能にする（フォールバック）
    newSheet.getSheetByName(newSheet.getSheets()[0].getName()).protect().remove();
    
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
    // CORS対応
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
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
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    console.error('doPost error:', error);
    
    // エラーレスポンス
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

/**
 * プリフライトリクエスト対応
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
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

## 設定手順

1. **Google Apps Script プロジェクト作成**
   - [script.google.com](https://script.google.com) にアクセス
   - 「新しいプロジェクト」をクリック
   - プロジェクト名を「Data Problem Sheet Manager」に変更

2. **コードをコピー**
   - 上記のコードをCode.gsに貼り付け
   - `YOUR_TEMPLATE_SPREADSHEET_ID_HERE` を実際のテンプレートIDに置き換え

3. **デプロイ設定**
   - 「デプロイ」→「新しいデプロイ」
   - 種類: 「ウェブアプリ」
   - 説明: 「Data Problem Sheet API」
   - 実行者: 「自分」
   - アクセスできるユーザー: 「全員」
   - 「デプロイ」をクリック

4. **デプロイURLをメモ**
   - 表示されるウェブアプリのURLをコピー
   - このURLをNext.jsの環境変数に設定します

## テスト方法

デプロイ後、ブラウザでデプロイURLにアクセスすると以下のような応答が返ります：

```json
{
  "message": "Data Problem Sheet Manager API is running",
  "timestamp": "2025-10-21T10:00:00.000Z",
  "available_actions": ["createSheet", "getSheetData"]
}
```

## 注意事項

- テンプレートスプレッドシートは「リンクを知っている全員が閲覧可能」に設定してください
- GASの実行権限で初回実行時に認証が必要な場合があります
- デプロイURLは外部からアクセス可能になるため、機密情報は含めないでください