export interface DataProblemTemplateData {
  problemText?: string;
  tableData?: any[][];
  lastModified?: string;
  sheetInfo?: {
    lastRow: number;
    lastColumn: number;
    title: string;
  };
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
  problemText: string;
  tableData: any[][];
  lastModified: string;
  sheetInfo: {
    lastRow: number;
    lastColumn: number;
    title: string;
  };
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
        } catch (parseError) {
          throw new Error(`Invalid response from Google Apps Script: ${responseText.substring(0, 200)}`);
        }
      }

      // JSONパース
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
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
        } catch (parseError) {
          throw new Error(`Invalid response from Google Apps Script: ${responseText.substring(0, 200)}`);
        }
      }

      // JSONパース
      let result: GetDataResponse;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Invalid JSON response from Google Apps Script: ${responseText.substring(0, 200)}`);
      }
      return {
        problemText: result.problemText,
        tableData: result.tableData,
        lastModified: result.lastModified,
        sheetInfo: result.sheetInfo
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
}

// シングルトンインスタンス
export const gasClientService = new GASClientService();