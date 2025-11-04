import { NextRequest, NextResponse } from 'next/server';

interface GetDataRequest {
  spreadsheetId: string;
}

interface QuizCellData {
  cellAddress: string;  // "A8", "B8", "C10" など
  value: string;        // セルの値（空白セルは含まれない）
}

interface SheetData {
  sheetName: string;
  sheetId: number;
  problemText: string;   // A2セルの値
  answerText: string;    // A5セルの値
  quizData: QuizCellData[];  // 8行目以降のデータ（A～Z列）
  tableData: any[][];    // シートの全データ（後方互換用）
  startRow: number;      // データ範囲の開始行（1始まり）
  startColumn: number;   // データ範囲の開始列（1始まり）
  lastRow: number;
  lastColumn: number;
}

interface GASDataResponse {
  success: boolean;
  data?: {
    sheets: SheetData[];
    lastModified: string;
  };
  error?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  console.log('POST /api/gas/get-data - Request received');
  
  try {
    const { spreadsheetId }: GetDataRequest = await request.json();
    
    console.log('Getting data from spreadsheet:', spreadsheetId);

    // Google Apps Script Web App URLを環境変数から取得
    const gasWebAppUrl = process.env.GAS_WEB_APP_URL;
    
    if (!gasWebAppUrl) {
      console.error('GAS_WEB_APP_URL environment variable not set');
      return NextResponse.json(
        { error: 'Google Apps Script integration not configured' },
        { status: 500 }
      );
    }

    // Google Apps Scriptに送信するデータ
    const gasRequestData = {
      action: 'getSheetData',
      spreadsheetId: spreadsheetId
    };

    console.log('Calling GAS with data:', gasRequestData);

    // Google Apps Script Web Appを呼び出し
    const gasResponse = await fetch(gasWebAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gasRequestData)
    });

    if (!gasResponse.ok) {
      throw new Error(`GAS API responded with status ${gasResponse.status}`);
    }

    const gasResult: GASDataResponse = await gasResponse.json();
    console.log('GAS response received');

    if (!gasResult.success) {
      throw new Error(gasResult.error || 'Unknown error from Google Apps Script');
    }

    if (!gasResult.data) {
      throw new Error('No data returned from Google Apps Script');
    }

    // 成功レスポンス -- GASの新しい構造をそのまま返す
    const result = {
      sheets: gasResult.data.sheets,
      lastModified: gasResult.data.lastModified
    };

    console.log('==============data start=============');
    console.log('Total sheets count:', result.sheets.length);
    console.log('');

    // 全シートの情報を表示
    result.sheets.forEach((sheet, index) => {
      console.log(`--- Sheet ${index + 1}: "${sheet.sheetName}" ---`);
      console.log(`  Sheet ID: ${sheet.sheetId}`);
      console.log(`  Problem Text (A2): ${sheet.problemText}`);
      console.log(`  Answer Text (A5): ${sheet.answerText}`);
      console.log(`  Quiz Data count: ${sheet.quizData?.length || 0}`);
      console.log(`  Last Row: ${sheet.lastRow}, Last Column: ${sheet.lastColumn}`);

      // quizDataの中身を表示（最初の10件と最後の5件）
      if (sheet.quizData && sheet.quizData.length > 0) {
        console.log('  Quiz Data samples:');
        const sampleCount = Math.min(10, sheet.quizData.length);
        for (let i = 0; i < sampleCount; i++) {
          const cell = sheet.quizData[i];
          console.log(`    [${i + 1}] ${cell.cellAddress} = "${cell.value}"`);
        }

        if (sheet.quizData.length > 15) {
          console.log(`    ... (${sheet.quizData.length - 15} cells omitted) ...`);

          // 最後の5件を表示
          const lastStart = sheet.quizData.length - 5;
          for (let i = lastStart; i < sheet.quizData.length; i++) {
            const cell = sheet.quizData[i];
            console.log(`    [${i + 1}] ${cell.cellAddress} = "${cell.value}"`);
          }
        }
      } else {
        console.log('  Quiz Data: (empty)');
      }
      console.log('');
    });

    console.log('==============data end=============');
    console.log('Data retrieved successfully');

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to get data via GAS:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to get sheet data: ${errorMessage}` },
      { status: 500 }
    );
  }
}