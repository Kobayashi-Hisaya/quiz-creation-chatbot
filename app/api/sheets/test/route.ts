import { NextResponse } from 'next/server';

export async function GET() {
  console.log('GET /api/sheets/test - Testing credentials');
  
  try {
    // 環境変数から認証情報を取得
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    const result = {
      hasServiceAccountEmail: !!serviceAccountEmail,
      serviceAccountEmailLength: serviceAccountEmail?.length || 0,
      serviceAccountEmailPrefix: serviceAccountEmail?.substring(0, 20) + '...',
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey?.length || 0,
      privateKeyStartsWith: privateKey?.substring(0, 50) + '...',
      nodeEnv: process.env.NODE_ENV,
    };

    console.log('Credentials test result:', result);

    return NextResponse.json({
      status: 'ok',
      credentials: result,
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}