import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface CreateSheetRequest {
  userEmail: string;
  sessionId?: string;
}

interface GASResponse {
  success: boolean;
  data?: {
    spreadsheetId: string;
    spreadsheetUrl: string;
    editUrl: string;
    embedUrl: string;
    sheetName: string;
    created: string;
  };
  error?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  console.log('POST /api/gas/create-sheet - Request received');
  
  try {
    const { userEmail, sessionId }: CreateSheetRequest = await request.json();
    
    // セッションIDが提供されていない場合は生成
    const finalSessionId = sessionId || uuidv4();
    
    console.log('Creating sheet for user:', userEmail, 'session:', finalSessionId);

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
      action: 'createSheet',
      userEmail: userEmail,
      sessionId: finalSessionId
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
      sessionId: finalSessionId,
      spreadsheet: gasResult.data,
      created: gasResult.timestamp
    };

    console.log('Sheet created successfully:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to create sheet via GAS:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to create sheet: ${errorMessage}` },
      { status: 500 }
    );
  }
}