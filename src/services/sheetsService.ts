import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetCell } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export interface QuizTemplateData {
  learningTopic?: string;
  problemText?: string;
  language?: string;
  sourceCode?: string;
  tableData?: string[][];
}

export interface SheetConfig {
  title: string;
  spreadsheetId?: string;
}

class SheetsService {
  private doc: GoogleSpreadsheet | null = null;
  private serviceAccountAuth: JWT | null = null;

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      // 環境変数から認証情報を取得
      const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!serviceAccountEmail || !privateKey) {
        console.warn('Google Sheets API credentials not found in environment variables');
        return;
      }

      this.serviceAccountAuth = new JWT({
        email: serviceAccountEmail,
        key: privateKey,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ],
      });
    } catch (error) {
      console.error('Failed to initialize Google Sheets authentication:', error);
    }
  }

  /**
   * 新しいスプレッドシートを作成し、テンプレートを適用
   */
  async createNewSheet(config: SheetConfig): Promise<string | null> {
    if (!this.serviceAccountAuth) {
      throw new Error('Google Sheets authentication not configured');
    }

    try {
      // 新しいスプレッドシートを作成
      this.doc = await GoogleSpreadsheet.createNewSpreadsheetDocument(
        this.serviceAccountAuth,
        { title: config.title }
      );

      // テンプレートを適用
      await this.applyTemplate();

      return this.doc.spreadsheetId;
    } catch (error) {
      console.error('Failed to create new spreadsheet:', error);
      return null;
    }
  }

  /**
   * 既存のスプレッドシートに接続
   */
  async connectToSheet(spreadsheetId: string): Promise<boolean> {
    if (!this.serviceAccountAuth) {
      throw new Error('Google Sheets authentication not configured');
    }

    try {
      this.doc = new GoogleSpreadsheet(spreadsheetId, this.serviceAccountAuth);
      await this.doc.loadInfo();
      return true;
    } catch (error) {
      console.error('Failed to connect to spreadsheet:', error);
      return false;
    }
  }

  /**
   * テンプレート構造を適用
   */
  private async applyTemplate(): Promise<void> {
    if (!this.doc) throw new Error('Spreadsheet not initialized');

    const sheet = this.doc.sheetsByIndex[0];
    
    // テンプレートデータの設定
    const templateData = [
      ['プログラミング問題作成シート', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['■ 学習項目', '', '', ''],
      ['', '', '', ''], // 編集可能エリア
      ['', '', '', ''],
      ['■ 問題文', '', '', ''],
      ['', '', '', ''], // 編集可能エリア（問題文）
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['■ プログラミング言語', '', '', ''],
      ['', '', '', ''], // 編集可能エリア（言語選択）
      ['', '', '', ''],
      ['■ ソースコード', '', '', ''],
      ['', '', '', ''], // 編集可能エリア（コード）
      // ... 20行のコード入力エリア
    ];

    // 40行まで拡張
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
    await this.applyFormatting();
  }

  /**
   * セルのフォーマットと保護を適用
   */
  private async applyFormatting(): Promise<void> {
    if (!this.doc) throw new Error('Spreadsheet not initialized');

    const sheet = this.doc.sheetsByIndex[0];

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

  /**
   * スプレッドシートからデータを取得
   */
  async getTemplateData(): Promise<QuizTemplateData | null> {
    if (!this.doc) {
      console.error('Spreadsheet not connected');
      return null;
    }

    try {
      const sheet = this.doc.sheetsByIndex[0];
      await sheet.loadCells('A1:D50');

      return {
        learningTopic: sheet.getCellByA1('A5').value?.toString() || '',
        problemText: await this.getCellRange(sheet, 'A8:D15'),
        language: sheet.getCellByA1('A18').value?.toString() || '',
        sourceCode: await this.getCellRange(sheet, 'A21:D40'),
        tableData: await this.getTableData(sheet, 'A43:D50'),
      };
    } catch (error) {
      console.error('Failed to get template data:', error);
      return null;
    }
  }

  /**
   * セル範囲のテキストを結合して取得
   */
  private async getCellRange(sheet: GoogleSpreadsheetWorksheet, range: string): Promise<string> {
    const cells = await sheet.getCellsInRange(range);
    return cells
      .map((row: GoogleSpreadsheetCell[]) => row.map(cell => cell.value || '').join(' '))
      .filter((line: string) => line.trim() !== '')
      .join('\n');
  }

  /**
   * 表データを2次元配列として取得
   */
  private async getTableData(sheet: GoogleSpreadsheetWorksheet, range: string): Promise<string[][]> {
    const cells = await sheet.getCellsInRange(range);
    return cells.map((row: GoogleSpreadsheetCell[]) =>
      row.map(cell => cell.value?.toString() || '')
    ).filter((row: string[]) =>
      row.some(cell => cell.trim() !== '')
    );
  }

  /**
   * スプレッドシートの埋め込みURLを生成
   */
  getEmbedUrl(): string | null {
    if (!this.doc) return null;
    return `https://docs.google.com/spreadsheets/d/${this.doc.spreadsheetId}/edit?usp=sharing`;
  }

  /**
   * スプレッドシートの共有設定を更新
   */
  async updateSharingSettings(): Promise<void> {
    if (!this.doc) throw new Error('Spreadsheet not initialized');

    try {
      // 誰でも編集可能に設定（開発用）
      await this.doc.share('', {
        role: 'writer',
      });
    } catch (error) {
      console.error('Failed to update sharing settings:', error);
    }
  }

  /**
   * リアルタイム変更検知のためのポーリング
   */
  startPolling(callback: (data: QuizTemplateData) => void, interval: number = 5000): NodeJS.Timeout | null {
    if (!this.doc) return null;

    return setInterval(async () => {
      const data = await this.getTemplateData();
      if (data) {
        callback(data);
      }
    }, interval);
  }

  /**
   * ポーリング停止
   */
  stopPolling(intervalId: NodeJS.Timeout): void {
    clearInterval(intervalId);
  }
}

// シングルトンインスタンス
export const sheetsService = new SheetsService();