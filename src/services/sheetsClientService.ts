export interface QuizTemplateData {
  learningTopic?: string;
  problemText?: string;
  language?: string;
  sourceCode?: string;
  tableData?: string[][];
}

export interface CreateSheetResponse {
  spreadsheetId: string;
  embedUrl: string;
}

export interface GetDataResponse {
  data: QuizTemplateData;
}

class SheetsClientService {
  /**
   * 新しいスプレッドシートを作成
   */
  async createNewSheet(title: string): Promise<CreateSheetResponse | null> {
    try {
      const response = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create spreadsheet');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create spreadsheet:', error);
      return null;
    }
  }

  /**
   * スプレッドシートからデータを取得
   */
  async getSheetData(spreadsheetId: string): Promise<QuizTemplateData | null> {
    try {
      const response = await fetch(`/api/sheets/${spreadsheetId}/data`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get spreadsheet data');
      }

      const result: GetDataResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get spreadsheet data:', error);
      return null;
    }
  }

  /**
   * スプレッドシートの埋め込みURLを生成
   */
  getEmbedUrl(spreadsheetId: string): string {
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?usp=sharing`;
  }

  /**
   * リアルタイム変更検知のためのポーリング
   */
  startPolling(
    spreadsheetId: string,
    callback: (data: QuizTemplateData) => void,
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
}

// シングルトンインスタンス
export const sheetsClientService = new SheetsClientService();