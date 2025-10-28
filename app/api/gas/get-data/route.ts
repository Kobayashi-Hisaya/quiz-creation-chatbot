import { NextRequest, NextResponse } from 'next/server';

interface GetDataRequest {
  spreadsheetId: string;
}

interface SheetData {
  sheetName: string;
  sheetId: number;
  tableData: any[][];
  lastRow: number;
  lastColumn: number;
}

interface GASDataResponse {
  success: boolean;
  data?: {
    problemText: string;
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

    // 成功レスポンス
    const result = {
      problemText: gasResult.data.problemText,
      sheets: gasResult.data.sheets,
      lastModified: gasResult.data.lastModified
    };

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