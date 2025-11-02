import { NextRequest, NextResponse } from 'next/server';

interface GASResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  console.log('GET /api/gas/get-assessment-data - Request received');
  
  try {
    // Query parameterからspreadsheetIdを取得
    const spreadsheetId = request.nextUrl.searchParams.get('spreadsheetId');
    
    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'spreadsheetId query parameter is required' },
        { status: 400 }
      );
    }

    console.log('Getting assessment data for spreadsheet:', spreadsheetId);

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
      action: 'getAssessmentSheetData',
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

    const gasResult: GASResponse = await gasResponse.json();
    console.log('GAS response:', gasResult);

    if (!gasResult.success) {
      throw new Error(gasResult.error || 'Unknown error from Google Apps Script');
    }

    if (!gasResult.data) {
      throw new Error('No data returned from Google Apps Script');
    }

    // 成功レスポンス
    const result = {
      spreadsheetId: spreadsheetId,
      data: gasResult.data,
      retrieved: gasResult.timestamp
    };

    console.log('Assessment data retrieved successfully:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to get assessment data via GAS:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to get assessment data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
