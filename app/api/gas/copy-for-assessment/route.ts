import { NextRequest, NextResponse } from 'next/server';

/**
 * 診断用にスプレッドシートをコピー
 * 修正方針: 修正前のデータを保持したまま、修正後のデータを別カラムに保存できるようにする
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalSpreadsheetId, userEmail, sessionId } = body;

    if (!originalSpreadsheetId) {
      return NextResponse.json(
        { error: 'originalSpreadsheetId is required' },
        { status: 400 }
      );
    }

    // GAS Web App の URL を取得
    const gasWebAppUrl = process.env.GAS_WEB_APP_URL;
    if (!gasWebAppUrl) {
      return NextResponse.json(
        { error: 'GAS_WEB_APP_URL not configured' },
        { status: 500 }
      );
    }

    console.log('[copy-for-assessment] Calling GAS to copy spreadsheet:', originalSpreadsheetId);

    // GAS に リクエスト送信
    const gasResponse = await fetch(gasWebAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'copySpreadsheetForAssessment',
        originalSpreadsheetId,
        userEmail: userEmail || 'unknown@example.com',
        sessionId: sessionId || `session-${Date.now()}`,
      }),
    });

    if (!gasResponse.ok) {
      const errorText = await gasResponse.text();
      console.error('[copy-for-assessment] GAS error response:', errorText);
      throw new Error(`GAS responded with status ${gasResponse.status}`);
    }

    const gasResult = await gasResponse.json();
    console.log('[copy-for-assessment] GAS response:', gasResult);

    if (!gasResult.success) {
      throw new Error(gasResult.error || 'GAS returned success: false');
    }

    // 成功レスポンスを返す
    return NextResponse.json({
      spreadsheetId: gasResult.data.spreadsheetId,
      spreadsheetUrl: gasResult.data.spreadsheetUrl,
      editUrl: gasResult.data.editUrl,
      originalSpreadsheetId: gasResult.data.originalSpreadsheetId,
      created: gasResult.data.created,
    });

  } catch (error) {
    console.error('[copy-for-assessment] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to copy spreadsheet: ${message}` },
      { status: 500 }
    );
  }
}
