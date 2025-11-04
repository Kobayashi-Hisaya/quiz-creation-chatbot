export interface QuizCellData {
  cellAddress: string;  // "A8", "B8", "C10" など
  value: string;        // セルの値（空白セルは含まれない）
}

export interface SheetData {
  sheetName: string;
  sheetId: number;
  problemText: string;   // A2セルの値
  answerText: string;    // A5セルの値
  quizData: QuizCellData[];  // 8行目以降のデータ（A～Z列）
  tableData: any[][];    // シートの全データ（後方互換用）
  startRow: number;      // データ範囲の開始行（1始まり）
  startColumn: number;   // データ範囲の開始列（1始まり）
  lastRow: number;
  lastColumn: number;
}

export interface DataProblemTemplateData {
  problemText?: string;  // convenience: sheets[0].problemText
  answerText?: string;   // convenience: sheets[0].answerText
  code?: string;         // convenience: mapped from sheets[0].answerText
  sheets?: SheetData[];
  lastModified?: string;
}

export interface CreateSheetResponse {
  sessionId: string;
  spreadsheet: {
    spreadsheetId: string;
    spreadsheetUrl: string;
    editUrl: string;
    embedUrl: string;
    sheetName: string;
    created: string;
  };
  created: string;
}

export interface GetDataResponse {
  sheets: SheetData[];
  lastModified: string;
}

class GASClientService {
  /**
   * 新しいデータ整理問題用スプレッドシートを作成
   */
  async createDataProblemSheet(userEmail: string, sessionId?: string): Promise<CreateSheetResponse | null> {
    try {
      const response = await fetch('/api/gas/create-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userEmail, 
          sessionId 
        }),
      });

      // レスポンスの詳細をログ出力
      console.log('GAS Response status:', response.status);
      console.log('GAS Response headers:', response.headers);
      
      // レスポンステキストを取得
      const responseText = await response.text();
      console.log('GAS Response text:', responseText.substring(0, 500));

      if (!response.ok) {
        // HTMLエラーページの場合
        if (responseText.startsWith('<!DOCTYPE')) {
          throw new Error(`Google Apps Script returned HTML error page. Status: ${response.status}. Check deployment settings.`);
        }
        
        try {
          const error = JSON.parse(responseText);
          throw new Error(error.error || 'Failed to create spreadsheet');
        } catch (e) {
          console.error('Failed to parse error response from GAS create:', e);
          throw new Error(`Invalid response from Google Apps Script: ${responseText.substring(0, 200)}`);
        }
      }

      // JSONパース
      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON from GAS create response:', e);
        throw new Error(`Invalid JSON response from Google Apps Script: ${responseText.substring(0, 200)}`);
      }

    } catch (error) {
      console.error('Failed to create spreadsheet via GAS:', error);
      return null;
    }
  }

  /**
   * スプレッドシートからデータを取得
   */
  async getSheetData(spreadsheetId: string): Promise<DataProblemTemplateData | null> {
    try {
      const response = await fetch('/api/gas/get-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ spreadsheetId }),
      });

      // レスポンステキストを取得
      const responseText = await response.text();
      console.log('GAS getData Response text:', responseText.substring(0, 500));

      if (!response.ok) {
        // HTMLエラーページの場合
        if (responseText.startsWith('<!DOCTYPE')) {
          throw new Error(`Google Apps Script returned HTML error page. Status: ${response.status}. Check deployment settings.`);
        }
        
        try {
          const error = JSON.parse(responseText);
          throw new Error(error.error || 'Failed to get spreadsheet data');
        } catch (e) {
          console.error('Failed to parse error response from GAS get-data:', e);
          throw new Error(`Invalid response from Google Apps Script: ${responseText.substring(0, 200)}`);
        }
      }

      // JSONパース
      let result: GetDataResponse;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON from GAS get-data response:', e);
        throw new Error(`Invalid JSON response from Google Apps Script: ${responseText.substring(0, 200)}`);
      }

      // sheets[0]から便利なショートカットフィールドを提供
      const firstSheet = result.sheets?.[0];
      return {
        problemText: firstSheet?.problemText,
        answerText: firstSheet?.answerText,
        // convenience: map answerText to code so callers can use either
        code: firstSheet?.answerText,
        sheets: result.sheets,
        lastModified: result.lastModified
      };
    } catch (error) {
      console.error('Failed to get spreadsheet data via GAS:', error);
      return null;
    }
  }

  /**
   * スプレッドシートの埋め込みURLを生成
   */
  getEmbedUrl(spreadsheetId: string): string {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing&embedded=true`;
  }

  /**
   * スプレッドシートの編集URLを生成
   */
  getEditUrl(spreadsheetId: string): string {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`;
  }

  /**
   * リアルタイム変更検知のためのポーリング
   */
  startPolling(
    spreadsheetId: string,
    callback: (data: DataProblemTemplateData) => void,
    interval: number = 5000
  ): NodeJS.Timeout {
    return setInterval(async () => {
      const data = await this.getSheetData(spreadsheetId);
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

  /**
   * セッションIDを生成
   */
  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * スプレッドシートが有効かチェック
   */
  async validateSpreadsheet(spreadsheetId: string): Promise<boolean> {
    try {
      const data = await this.getSheetData(spreadsheetId);
      return data !== null;
    } catch {
      return false;
    }
  }

  /**
   * 問題評価用スプレッドシートを作成
   */
  async createAssessmentSheet(userEmail: string, sessionId: string, problemData: any): Promise<CreateSheetResponse | null> {
    try {
      const response = await fetch('/api/gas/create-assessment-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userEmail, 
          sessionId,
          problemData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create assessment sheet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating assessment sheet:', error);
      return null;
    }
  }

  /**
   * 問題評価用スプレッドシートのデータを取得
   */
  async getAssessmentSheetData(spreadsheetId: string): Promise<any | null> {
    try {
      const response = await fetch(`/api/gas/get-assessment-data?spreadsheetId=${encodeURIComponent(spreadsheetId)}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch assessment data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      return null;
    }
  }
}

// シングルトンインスタンス
export const gasClientService = new GASClientService();