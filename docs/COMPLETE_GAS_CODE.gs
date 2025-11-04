/**
 * データ整理問題用スプレッドシート管理（修正版 + 診断機能追加）
 * テンプレートをコピーして個人専用シートを作成
 * 
 * 【追加機能】
 * - 診断用スプレッドシートコピー機能
 * - 修正内容保存機能
 * - 修正前/修正後データ比較機能
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
      console.log('[GAS] スプシ① File ID:', newSheet.getId());
      const targetFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);
      console.log('[GAS] Target Folder ID:', TARGET_FOLDER_ID);
      newFile.moveTo(targetFolder);
      console.log('[GAS] ✅ スプシ①をフォルダに移動完了:', TARGET_FOLDER_ID);
    } catch (e) {
      console.error('[GAS] ❌ スプシ①のフォルダ移動失敗:', e.message);
      console.error('[GAS] スプシ①はマイドライブのルートに残っています');
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

// ========================================
// 【追加】診断・修正機能
// ========================================

/**
 * バックアップ用にスプレッドシートの【問題】と【解答】シートのみをコピー
 * 目的: 修正前のデータをスナップショットとして保持（読み取り専用）
 * 
 * 仕様変更:
 * - スプシ①: 作業用・診断対象・修正対象（このシートで診断・修正を行う）
 * - スプシ②: バックアップ（修正前データのスナップショット、編集しない）
 * - 【問題】と【解答】シートのみをコピー
 * - 【修正後】カラムなどの追加は不要
 * 
 * @param {string} originalSpreadsheetId - コピー元のスプレッドシートID（スプシ①）
 * @param {string} userEmail - ユーザーのメールアドレス
 * @param {string} sessionId - セッションID
 * @return {object} 新しいスプレッドシートの情報（スプシ②）
 */
function copySpreadsheetForAssessment(originalSpreadsheetId, userEmail, sessionId) {
  try {
    console.log('[GAS] バックアップ用スプレッドシートコピー開始:', originalSpreadsheetId);
    
    // 元のスプレッドシートを開く
    const originalSpreadsheet = SpreadsheetApp.openById(originalSpreadsheetId);
    
    // 新しいスプレッドシート名
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const newSheetName = `Original-Problem-${sessionId}-${timestamp}`;
    
    console.log('[GAS] バックアップ名:', newSheetName);
    
    // 新しいスプレッドシートを作成
    const newSpreadsheet = SpreadsheetApp.create(newSheetName);
    
    // デフォルトの「シート1」を削除する準備
    const defaultSheet = newSpreadsheet.getSheets()[0];
    
    // 【問題】シートをコピー
    const problemSheet = originalSpreadsheet.getSheetByName('問題');
    if (problemSheet) {
      const copiedProblemSheet = problemSheet.copyTo(newSpreadsheet);
      copiedProblemSheet.setName('問題');
      console.log('[GAS] 【問題】シートをコピー完了');
    } else {
      console.warn('[GAS] 【問題】シートが見つかりません');
    }
    
    // 【解答】シートをコピー
    const answerSheet = originalSpreadsheet.getSheetByName('解答');
    if (answerSheet) {
      const copiedAnswerSheet = answerSheet.copyTo(newSpreadsheet);
      copiedAnswerSheet.setName('解答');
      console.log('[GAS] 【解答】シートをコピー完了');
    } else {
      console.warn('[GAS] 【解答】シートが見つかりません');
    }
    
    // デフォルトの「シート1」を削除（問題・解答シートがコピーされている場合のみ）
    if (newSpreadsheet.getSheets().length > 1) {
      newSpreadsheet.deleteSheet(defaultSheet);
      console.log('[GAS] デフォルトシートを削除');
    }
    
    // ファイルを指定フォルダに移動
    try {
      const newFile = DriveApp.getFileById(newSpreadsheet.getId());
      console.log('[GAS] スプシ② File ID:', newSpreadsheet.getId());
      const targetFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);
      console.log('[GAS] Target Folder ID:', TARGET_FOLDER_ID);
      newFile.moveTo(targetFolder);
      console.log('[GAS] ✅ スプシ②（バックアップ）をフォルダに移動完了:', TARGET_FOLDER_ID);
    } catch (e) {
      console.error('[GAS] ❌ スプシ②のフォルダ移動失敗:', e.message);
      console.error('[GAS] スプシ②はマイドライブのルートに残っています');
    }
    
    // 編集権限を付与（バックアップなので閲覧のみでも良いが、念のため編集権限も付与）
    if (userEmail && userEmail.includes('@')) {
      try {
        newSpreadsheet.addEditor(userEmail);
        console.log('[GAS] 編集権限付与:', userEmail);
      } catch (e) {
        console.warn('[GAS] 編集権限付与失敗:', e.message);
      }
    }
    
    const result = {
      spreadsheetId: newSpreadsheet.getId(),
      spreadsheetUrl: newSpreadsheet.getUrl(),
      editUrl: newSpreadsheet.getUrl() + '#gid=0',
      embedUrl: `https://docs.google.com/spreadsheets/d/${newSpreadsheet.getId()}/edit?usp=sharing`,
      originalSpreadsheetId: originalSpreadsheetId,
      sheetName: newSheetName,
      created: new Date().toISOString(),
      copiedSheets: ['問題', '解答']
    };
    
    console.log('[GAS] バックアップ作成成功:', result);
    return result;
    
  } catch (error) {
    console.error('[GAS] バックアップ作成エラー:', error);
    throw new Error(`Failed to create backup: ${error.message}`);
  }
}

// updateAssessmentSheet と getAssessmentSheetData は削除
// 理由: スプシ②はバックアップ専用で編集しないため不要
// スプシ①で診断・修正を行うため、既存の getSheetData を使用

// ========================================
// Web App エンドポイント
// ========================================

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
      
      // 【追加】バックアップ用スプレッドシートコピー（【問題】と【解答】シートのみ）
      case 'copySpreadsheetForAssessment':
        result = copySpreadsheetForAssessment(
          requestBody.originalSpreadsheetId,
          requestBody.userEmail,
          requestBody.sessionId
        );
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
      available_actions: [
        'createSheet', 
        'getSheetData',
        'copySpreadsheetForAssessment'  // バックアップ作成（【問題】と【解答】シートのみ）
      ]
    }))
    .setMimeType(ContentService.MimeType.JSON);
}