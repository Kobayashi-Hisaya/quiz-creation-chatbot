import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const spreadsheetId = id;

    // 環境変数から認証情報を取得
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!serviceAccountEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Google Sheets API credentials not configured' },
        { status: 500 }
      );
    }

    // JWT認証を設定
    const serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });

    // スプレッドシートに接続
    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells('A1:D50');

    // データを抽出
    const data = {
      learningTopic: sheet.getCellByA1('A5').value?.toString() || '',
      problemText: getCellRange(sheet, 'A8', 'D15'),
      language: sheet.getCellByA1('A18').value?.toString() || '',
      sourceCode: getCellRange(sheet, 'A21', 'D40'),
      tableData: getTableData(sheet, 'A43', 'D50'),
    };

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Failed to get spreadsheet data:', error);
    return NextResponse.json(
      { error: 'Failed to get spreadsheet data' },
      { status: 500 }
    );
  }
}

function getCellRange(sheet: GoogleSpreadsheetWorksheet, startCell: string, endCell: string): string {
  const startPos = parseA1Notation(startCell);
  const endPos = parseA1Notation(endCell);
  
  const lines: string[] = [];
  
  for (let row = startPos.row; row <= endPos.row; row++) {
    const rowData: string[] = [];
    for (let col = startPos.col; col <= endPos.col; col++) {
      const cell = sheet.getCell(row - 1, col - 1); // 0-indexed
      const value = cell.value?.toString() || '';
      rowData.push(value);
    }
    const lineText = rowData.join(' ').trim();
    if (lineText) {
      lines.push(lineText);
    }
  }
  
  return lines.join('\n');
}

function getTableData(sheet: GoogleSpreadsheetWorksheet, startCell: string, endCell: string): string[][] {
  const startPos = parseA1Notation(startCell);
  const endPos = parseA1Notation(endCell);
  
  const result: string[][] = [];
  
  for (let row = startPos.row; row <= endPos.row; row++) {
    const rowData: string[] = [];
    for (let col = startPos.col; col <= endPos.col; col++) {
      const cell = sheet.getCell(row - 1, col - 1); // 0-indexed
      const value = cell.value?.toString() || '';
      rowData.push(value);
    }
    if (rowData.some(cell => cell.trim() !== '')) {
      result.push(rowData);
    }
  }
  
  return result;
}

function parseA1Notation(cellAddress: string): { row: number; col: number } {
  const match = cellAddress.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid cell address: ${cellAddress}`);
  }
  
  const colStr = match[1];
  const rowStr = match[2];
  
  // Convert column letters to number (A=1, B=2, ...)
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  
  const row = parseInt(rowStr, 10);
  
  return { row, col };
}