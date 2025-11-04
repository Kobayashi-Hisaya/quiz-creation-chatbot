import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('GET /api/gas/test - Testing GAS connection');
  
  try {
    // Google Apps Script Web App URLを環境変数から取得
    const gasWebAppUrl = process.env.GAS_WEB_APP_URL;
    
    if (!gasWebAppUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'GAS_WEB_APP_URL environment variable not set'
      });
    }

    console.log('Testing GAS URL:', gasWebAppUrl);

    // 単純なGETリクエストでテスト
    const gasResponse = await fetch(gasWebAppUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    console.log('GAS Response status:', gasResponse.status);
    console.log('GAS Response headers:', [...gasResponse.headers.entries()]);

    const responseText = await gasResponse.text();
    console.log('GAS Response text:', responseText.substring(0, 1000));

    // レスポンス分析
    const isHtml = responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html');
    let isJson = false;
    let parsedJson = null;

    if (!isHtml) {
      try {
        parsedJson = JSON.parse(responseText);
        isJson = true;
      } catch {
        // JSONパース失敗
      }
    }

    return NextResponse.json({
      status: 'success',
      gasUrl: gasWebAppUrl,
      response: {
        status: gasResponse.status,
        statusText: gasResponse.statusText,
        isHtml: isHtml,
        isJson: isJson,
        contentLength: responseText.length,
        firstChars: responseText.substring(0, 200),
        parsedJson: parsedJson
      }
    });

  } catch (error) {
    console.error('GAS test error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}