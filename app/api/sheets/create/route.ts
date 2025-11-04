import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

interface CreateSheetRequest {
  title: string;
}

export async function POST(request: NextRequest) {
  console.log('POST /api/sheets/create - Request received');
  
  try {
    const { title }: CreateSheetRequest = await request.json();
    console.log('Request title:', title);

    // 環境変数から認証情報を取得
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log('Environment variables check:');
    console.log('- GOOGLE_SERVICE_ACCOUNT_EMAIL:', serviceAccountEmail ? 'Set' : 'Missing');
    console.log('- GOOGLE_PRIVATE_KEY:', privateKey ? 'Set (length: ' + privateKey.length + ')' : 'Missing');

    if (!serviceAccountEmail || !privateKey) {
      console.error('Missing Google Sheets API credentials');
      return NextResponse.json(
        { error: 'Google Sheets API credentials not configured' },
        { status: 500 }
      );
    }

    // JWT認証を設定
    console.log('Creating JWT authentication...');
    const serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    // 新しいスプレッドシートを作成
    console.log('Creating new spreadsheet...');
    const doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(
      serviceAccountAuth,
      { title }
    );
    console.log('Spreadsheet created with ID:', doc.spreadsheetId);

    // テンプレートを適用
    console.log('Applying template...');
    await applyTemplate(doc);
    console.log('Template applied successfully');

    // 共有設定を更新
    console.log('Updating sharing settings...');
    await doc.share('', {
      role: 'writer',
    });
    console.log('Sharing settings updated');

    const result = {
      spreadsheetId: doc.spreadsheetId,
      embedUrl: `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit?usp=sharing`,
    };
    console.log('Success! Returning result:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to create spreadsheet:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: `Failed to create spreadsheet: ${errorMessage}` },
      { status: 500 }
    );
  }
}

async function applyTemplate(doc: GoogleSpreadsheet): Promise<void> {
  const sheet = doc.sheetsByIndex[0];
  
  // テンプレートデータの設定
  const templateData = [
    ['プログラミング問題作成シート', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['■ 学習項目', '', '', ''],
    ['', '', '', ''], // 編集可能エリア (行5)
    ['', '', '', ''],
    ['■ 問題文', '', '', ''],
    ['', '', '', ''], // 編集可能エリア（問題文開始 - 行8）
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''], // 編集可能エリア（問題文終了 - 行15）
    ['', '', '', ''],
    ['■ プログラミング言語', '', '', ''],
    ['', '', '', ''], // 編集可能エリア（言語選択 - 行18）
    ['', '', '', ''],
    ['■ ソースコード', '', '', ''],
    ['', '', '', ''], // 編集可能エリア（コード開始 - 行21）
  ];

  // 40行まで拡張（コード入力エリア）
  for (let i = templateData.length; i < 40; i++) {
    templateData.push(['', '', '', '']);
  }

  // 表データエリア
  templateData.push(['', '', '', '']);
  templateData.push(['■ 表データ（オプション）', '', '', '']);
  for (let i = 0; i < 8; i++) {
    templateData.push(['', '', '', '']);
  }

  await sheet.clear();
  await sheet.resize({ rowCount: templateData.length, columnCount: 4 });
  await sheet.addRows(templateData);

  // フォーマットを適用
  await applyFormatting(sheet);
}

async function applyFormatting(sheet: GoogleSpreadsheetWorksheet): Promise<void> {
  // ヘッダー行のフォーマット（太字、背景色）
  await sheet.loadCells('A1:D1');
  const headerCell = sheet.getCellByA1('A1');
  headerCell.textFormat = { bold: true, fontSize: 16 };
  headerCell.backgroundColor = { red: 0.8, green: 0.9, blue: 1 };

  // セクションヘッダーのフォーマット
  const sectionHeaders = ['A4', 'A7', 'A17', 'A20', 'A42'];
  for (const cellAddress of sectionHeaders) {
    const cell = sheet.getCellByA1(cellAddress);
    cell.textFormat = { bold: true, fontSize: 12 };
    cell.backgroundColor = { red: 0.9, green: 0.9, blue: 0.9 };
  }

  await sheet.saveUpdatedCells();
}