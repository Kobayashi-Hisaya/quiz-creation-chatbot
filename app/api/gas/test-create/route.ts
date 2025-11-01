import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  console.log('POST /api/gas/test-create - Testing sheet creation');
  
  try {
    // Google Apps Script Web App URLを環境変数から取得
    const gasWebAppUrl = process.env.GAS_WEB_APP_URL;
    
    if (!gasWebAppUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'GAS_WEB_APP_URL environment variable not set'
      });
    }

    console.log('Testing sheet creation with GAS URL:', gasWebAppUrl);

    // テスト用のリクエストデータ
    const testRequestData = {
      action: 'createSheet',
      userEmail: 'test@example.com',
      sessionId: 'test-session-' + Date.now()
    };

    console.log('Sending test data:', testRequestData);

    // Google Apps Script Web Appを呼び出し
    const gasResponse = await fetch(gasWebAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequestData)
    });

    console.log('GAS Response status:', gasResponse.status);
    console.log('GAS Response headers:', [...gasResponse.headers.entries()]);

    const responseText = await gasResponse.text();
    console.log('GAS Response text:', responseText);

    // レスポンス分析
    let isHtml = responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html');
    let isJson = false;
    let parsedJson = null;
    let error = null;

    if (!isHtml) {
      try {
        parsedJson = JSON.parse(responseText);
        isJson = true;
      } catch (e) {
        error = `JSON parse error: ${e.message}`;
      }
    }

    return NextResponse.json({
      status: 'test-complete',
      request: testRequestData,
      gasUrl: gasWebAppUrl,
      response: {
        status: gasResponse.status,
        statusText: gasResponse.statusText,
        isHtml: isHtml,
        isJson: isJson,
        contentLength: responseText.length,
        responseText: responseText,
        parsedJson: parsedJson,
        error: error
      }
    });

  } catch (error) {
    console.error('GAS create test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to test sheet creation',
    example: {
      method: 'POST',
      endpoint: '/api/gas/test-create'
    }
  });
}