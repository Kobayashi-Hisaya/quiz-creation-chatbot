# Google Apps Script - Assessment Sheet Functions を追加

以下のコードを **Code.gs** に追加してください。`createDataProblemSheet` 関数の後、`doPost` 関数の前に挿入してください。

## 追加するコード

```javascript
/**
 * 診断用スプレッドシートを作成（Assessment用）
 * 既存の createDataProblemSheet とは別に、
 * 問題の診断・修正用のシートを作成します
 */
function createAssessmentSheet(userEmail, sessionId, problemData) {
  try {
    console.log('Creating assessment sheet for user:', userEmail, 'session:', sessionId);
    console.log('Problem data:', problemData);
    
    // テンプレートスプレッドシートを開く
    const templateSheet = SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
    
    // 新しい名前でコピー作成
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const newSheetName = `Assessment-${sessionId}-${timestamp}`;
    
    // テンプレートをコピー
    const newSheet = templateSheet.copy(newSheetName);

    try {
      // DriveApp を使って、作成されたファイルを取得
      const newFile = DriveApp.getFileById(newSheet.getId());
      
      // 保存先のフォルダを取得
      const targetFolder = DriveApp.getFolderById(TARGET_FOLDER_ID);
      
      // ファイルを指定フォルダに移動
      newFile.moveTo(targetFolder);
      console.log('Moved assessment sheet to folder:', TARGET_FOLDER_ID);
      
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
    
    // シートにデータを初期設定
    if (newSheet.getSheets().length > 0) {
      const sheet = newSheet.getSheets()[0];
      
      // タイトル行
      sheet.getRange('A1').setValue('診断用問題シート');
      sheet.getRange('A1').setFontSize(16);
      sheet.getRange('A1').setFontWeight('bold');
      
      // 問題情報の設定
      let row = 3;
      
      if (problemData.title) {
        sheet.getRange(`A${row}`).setValue('タイトル');
        sheet.getRange(`B${row}`).setValue(problemData.title);
        row++;
      }
      
      if (problemData.learning_topic) {
        sheet.getRange(`A${row}`).setValue('学習項目');
        sheet.getRange(`B${row}`).setValue(problemData.learning_topic);
        row++;
      }
      
      if (problemData.expected_accuracy !== null && problemData.expected_accuracy !== undefined) {
        sheet.getRange(`A${row}`).setValue('予想正答率');
        sheet.getRange(`B${row}`).setValue(problemData.expected_accuracy + '%');
        row++;
      }
      
      if (problemData.expected_answer_time !== null && problemData.expected_answer_time !== undefined) {
        sheet.getRange(`A${row}`).setValue('予想解答時間');
        sheet.getRange(`B${row}`).setValue(problemData.expected_answer_time + '秒');
        row++;
      }
      
      row++; // 空行を挿入
      
      if (problemData.problem_text) {
        sheet.getRange(`A${row}`).setValue('問題文');
        sheet.getRange(`B${row}:D${row + 4}`).setValue(problemData.problem_text);
        sheet.getRange(`B${row}:D${row + 4}`).setWrap(true);
        row += 5;
      }
      
      row++;
      
      if (problemData.code) {
        sheet.getRange(`A${row}`).setValue('コード');
        sheet.getRange(`B${row}:D${row + 8}`).setValue(problemData.code);
        sheet.getRange(`B${row}:D${row + 8}`).setWrap(true);
        sheet.getRange(`B${row}:D${row + 8}`).setFontFamily('Courier New');
        row += 9;
      }
      
      row++;
      
      if (problemData.language) {
        sheet.getRange(`A${row}`).setValue('言語');
        sheet.getRange(`B${row}`).setValue(problemData.language);
        row++;
      }
      
      row++;
      
      // 選択肢を表示
      if (problemData.choices && problemData.choices.length > 0) {
        sheet.getRange(`A${row}`).setValue('選択肢');
        row++;
        
        problemData.choices.forEach((choice, index) => {
          const label = String.fromCharCode(65 + index); // A, B, C, ...
          sheet.getRange(`A${row}`).setValue(`${label}.`);
          sheet.getRange(`B${row}:D${row}`).setValue(choice.text);
          
          if (choice.isCorrect) {
            sheet.getRange(`E${row}`).setValue('✓ 正解');
            sheet.getRange(`E${row}`).setFontColor('#00AA00');
          }
          row++;
        });
        
        row++;
      }
      
      // 解説を表示
      if (problemData.explanation) {
        sheet.getRange(`A${row}`).setValue('解説');
        sheet.getRange(`B${row}:D${row + 5}`).setValue(problemData.explanation);
        sheet.getRange(`B${row}:D${row + 5}`).setWrap(true);
      }
      
      // 列幅を自動調整
      sheet.autoResizeColumns(1, 5);
    }
    
    const result = {
      spreadsheetId: newSheet.getId(),
      spreadsheetUrl: newSheet.getUrl(),
      editUrl: newSheet.getUrl() + '#gid=0',
      embedUrl: `https://docs.google.com/spreadsheets/d/${newSheet.getId()}/edit?usp=sharing`,
      sheetName: newSheetName,
      created: new Date().toISOString()
    };
    
    console.log('Assessment sheet created successfully:', result);
    return result;
    
  } catch (error) {
    console.error('Error creating assessment sheet:', error);
    throw new Error(`Failed to create assessment sheet: ${error.message}`);
  }
}

/**
 * 診断用スプレッドシートのデータを取得
 * @param {string} spreadsheetId 対象スプレッドシートID
 * @returns {Object} シート内の全データ
 */
function getAssessmentSheetData(spreadsheetId) {
  try {
    console.log('Getting assessment data from:', spreadsheetId);
    
    // 対象のスプレッドシートを開く
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheets = spreadsheet.getSheets();
    
    const result = {
      spreadsheetId: spreadsheetId,
      sheets: []
    };
    
    // すべてのシートからデータを取得
    for (const sheet of sheets) {
      const dataRange = sheet.getDataRange();
      const tableData = dataRange.getValues();
      
      result.sheets.push({
        sheetName: sheet.getName(),
        sheetId: sheet.getSheetId(),
        tableData: tableData,
        lastRow: sheet.getLastRow(),
        lastColumn: sheet.getLastColumn()
      });
    }
    
    console.log('Assessment sheet data retrieved successfully.');
    return result;
    
  } catch (error) {
    console.error('Error getting assessment sheet data:', error);
    throw new Error(`Failed to get assessment sheet data: ${error.message}`);
  }
}
```

## 📋 **Code.gs の switch文を更新**

`doPost` 関数内の `switch(action)` ブロックを以下のように更新してください：

```javascript
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
  
  // 以下を追加
  case 'createAssessmentSheet':
    result = createAssessmentSheet(
      requestBody.userEmail,
      requestBody.sessionId,
      requestBody.problemData
    );
    break;
    
  case 'getAssessmentSheetData':
    result = getAssessmentSheetData(requestBody.spreadsheetId);
    break;
  
  default:
    throw new Error(`Unknown action: ${action}`);
}
```

## ✅ **doGet関数も更新**

```javascript
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Data Problem Sheet Manager API is running',
      timestamp: new Date().toISOString(),
      available_actions: ['createSheet', 'getSheetData', 'createAssessmentSheet', 'getAssessmentSheetData']
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 📝 **更新手順**

1. **Google Apps Script エディタ** (https://script.google.com) を開く
2. **Code.gs** を開く
3. 既存のコードの `createDataProblemSheet` と `doPost` の間に、上記の 2 つ関数コードを挿入
4. `doPost` の `switch` 文を更新
5. `doGet` 関数を更新
6. **「保存」** (Ctrl+S) をクリック
7. **「デプロイ」→「新しいデプロイ」** で再デプロイ
8. 新しいデプロイメント URL をコピー
9. `.env.local` の `GAS_WEB_APP_URL` を新しい URL で更新
