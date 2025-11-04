import type { DataProblemTemplateData } from './gasClientService';

interface GenerateSuggestionParams {
  learningTopic: string;
  predictedAccuracy: number | null;
  predictedAnswerTime: number | null;
  problemText: string;
  answerText: string;
  spreadsheetData: DataProblemTemplateData | null;
}

class SuggestionService {
  private baseSystemMessage: string;

  constructor() {
    this.baseSystemMessage = `
# タスク
今からあなたは、与えられる問題（スプレッドシートの内容）に対して以下の望ましい議論を促すようなコメント案を生成しなさい。

## 望ましい議論
作問学習においては、問題作成の後に学生同士でお互いが作成した問題を相互に評価するフェーズがある。この場で学生同士の議論を促進できるような案。

### 1. 改善案
作成された問題をよりよくするためのアイデア。具体的で実行可能な提案を2-3個挙げてください。

### 2. 指摘
作成された問題で不明な点や、解釈が曖昧になりうる箇所を指摘してください。

### 3. 感想・所感
一般的な問題と比較して、本問題が特に優れている点・ユニークな点を根拠を含めて説明してください。

---

## 作問課題
- 課題：モンテカルロ法によって解決できる身の回りの課題や疑問を見つけ、実際にそれを解決・探求するための【シミュレーション問題】を作成してください
- 学習項目: {LEARNING_TOPIC}
- 予想正答率: {PREDICTED_ACCURACY}
- 予想解答時間: {PREDICTED_ANSWER_TIME}

## 問題と回答
### 問題文
{PROBLEM_TEXT}

### 回答
{ANSWER_TEXT}

## スプレッドシート
{SPREADSHEET_DATA}

---

## 出力形式
- マークダウン形式で出力してください
- 各観点（改善案、指摘、感想・所感）について明確に分けて記述してください
- 具体的で建設的なコメントを心がけてください
- 全体で300文字〜500文字程度を目安にしてください
`;
  }

  // スプレッドシートデータを文字列化
  private formatSpreadsheetData(data: DataProblemTemplateData | null): string {
    if (!data) {
      return 'スプレッドシートデータは取得できませんでした。';
    }

    const { sheets, lastModified } = data;

    if (!sheets || sheets.length === 0) {
      return 'スプレッドシートデータは空です。';
    }

    // 全シートのデータをフォーマット
    const sheetsDisplay = sheets.map((sheet, sheetIndex) => {
      const { sheetName, quizData, lastRow, lastColumn } = sheet;

      let dataDisplay = '';

      if (!quizData || quizData.length === 0) {
        dataDisplay = 'データなし（8行目以降に入力がありません）';
      } else if (quizData.length <= 100) {
        // 100セル以下: 全データを表示
        dataDisplay = quizData.map((cell) =>
          `${cell.cellAddress}: ${cell.value}`
        ).join('\n');
      } else {
        // 100セル超: 最初の50セル + 最後の10セルを表示
        const firstCells = quizData.slice(0, 50).map(cell =>
          `${cell.cellAddress}: ${cell.value}`
        ).join('\n');
        const lastCells = quizData.slice(-10).map(cell =>
          `${cell.cellAddress}: ${cell.value}`
        ).join('\n');
        dataDisplay = `${firstCells}\n...(${quizData.length - 60}セル省略)...\n${lastCells}`;
      }

      return `
=== シート${sheetIndex + 1}: "${sheetName}" ===
使用範囲: ${lastRow}行 × ${lastColumn}列
データセル数: ${quizData?.length || 0}セル（空白セル除く）
問題文：${sheet.problemText || '未入力'}
回答：${sheet.answerText || '未入力'}

データ（8行目以降）:
${dataDisplay}
`;
    }).join('\n');

    return `
スプレッドシート全体の概要:
- シート数: ${sheets.length}
- 最終更新: ${lastModified || '不明'}

${sheetsDisplay}
    `;
  }

  // システムメッセージを生成
  private getSystemMessage(params: GenerateSuggestionParams): string {
    const {
      learningTopic,
      predictedAccuracy,
      predictedAnswerTime,
      problemText,
      answerText,
      spreadsheetData
    } = params;

    const spreadsheetInfo = this.formatSpreadsheetData(spreadsheetData);

    const accuracyText = predictedAccuracy !== null ? `${predictedAccuracy}%` : '未設定';
    const answerTimeText = predictedAnswerTime !== null ? `${predictedAnswerTime}秒` : '未設定';

    return this.baseSystemMessage
      .replace(/{LEARNING_TOPIC}/g, learningTopic || '未設定')
      .replace(/{PREDICTED_ACCURACY}/g, accuracyText)
      .replace(/{PREDICTED_ANSWER_TIME}/g, answerTimeText)
      .replace(/{PROBLEM_TEXT}/g, problemText || '未入力')
      .replace(/{ANSWER_TEXT}/g, answerText || '未入力')
      .replace(/{SPREADSHEET_DATA}/g, spreadsheetInfo);
  }

  // 提案を生成（一度きりのAI呼び出し）
  async generateSuggestion(params: GenerateSuggestionParams): Promise<Array<{ role: 'system' | 'assistant'; content: string }>> {
    try {
      const modelName = 'gpt-5-chat-latest';
      console.log('============== Generating Suggestion ==============');
      console.log(`Using model: ${modelName}`);
      console.log('Parameters:', {
        learningTopic: params.learningTopic,
        predictedAccuracy: params.predictedAccuracy,
        predictedAnswerTime: params.predictedAnswerTime,
        problemText: params.problemText.substring(0, 100) + '...',
        answerText: params.answerText.substring(0, 100) + '...',
      });
      console.log('===================================================');

      const systemMessage = this.getSystemMessage(params);

      // システムプロンプトをメッセージ配列に含める
      const messages = [
        { role: 'system' as const, content: systemMessage },
        { role: 'user' as const, content: '上記の問題、回答、スプレッドシートの内容をもとに、学生間の議論を促進するコメント案を生成してください。' }
      ];

      // API エンドポイントを呼び出し
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: modelName,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('[suggestionService] 提案生成完了');

      // システムメッセージとAI応答を返す
      return [
        { role: 'system', content: systemMessage },
        { role: 'assistant', content: data.content as string }
      ];
    } catch (error) {
      console.error("[suggestionService] Error generating suggestion:", error);
      throw new Error("提案の生成に失敗しました。");
    }
  }
}

export const suggestionService = new SuggestionService();
