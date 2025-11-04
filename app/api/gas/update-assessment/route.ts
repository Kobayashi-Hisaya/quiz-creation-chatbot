import { NextRequest, NextResponse } from 'next/server';

/**
 * 診断用スプレッドシートに修正内容を保存
 * 修正方針: 修正後のデータを専用カラム（【修正後】）に書き込む
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadsheetId, updatedData } = body;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'spreadsheetId is required' },
        { status: 400 }
      );
    }

    if (!updatedData) {
      return NextResponse.json(
        { error: 'updatedData is required' },
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

    console.log('[update-assessment] Calling GAS to update spreadsheet:', spreadsheetId);
    console.log('[update-assessment] Updated data:', updatedData);

    // GAS にリクエスト送信
    const gasResponse = await fetch(gasWebAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateAssessmentSheet',
        spreadsheetId,
        updatedData,
      }),
    });

    if (!gasResponse.ok) {
      const errorText = await gasResponse.text();
      console.error('[update-assessment] GAS error response:', errorText);
      throw new Error(`GAS responded with status ${gasResponse.status}`);
    }

    const gasResult = await gasResponse.json();
    console.log('[update-assessment] GAS response:', gasResult);

    if (!gasResult.success) {
      throw new Error(gasResult.error || 'GAS returned success: false');
    }

    // 成功レスポンスを返す
    return NextResponse.json({
      success: gasResult.data.success,
      spreadsheetId: gasResult.data.spreadsheetId,
      updatedAt: gasResult.data.updatedAt,
      updatedFields: gasResult.data.updatedFields,
    });

  } catch (error) {
    console.error('[update-assessment] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to update assessment sheet: ${message}` },
      { status: 500 }
    );
  }
}
