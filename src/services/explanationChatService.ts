import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import type { DataProblemTemplateData } from './gasClientService';

class ExplanationChatService {
  private baseSystemMessage: string;
  private conversationHistory: BaseMessage[];
  private currentExplanation: string;
  private currentSpreadsheetData: DataProblemTemplateData | null = null;

  constructor() {
    // 初期化時は空の状態
    // setProblemContextで問題コンテキストとともにシステムメッセージを設定する
    this.baseSystemMessage = '';
    this.conversationHistory = [];
    this.currentExplanation = '';
  }

  // システムメッセージのプレースホルダーを置き換えて取得
  private getCurrentSystemMessage(): string {
    const explanationText = this.currentExplanation || '(未入力)';

    let spreadsheetInfo = '';
    if (this.currentSpreadsheetData) {
      const { sheets, lastModified } = this.currentSpreadsheetData;

      if (!sheets || sheets.length === 0) {
        spreadsheetInfo = 'スプレッドシートデータは未取得です。';
      } else {
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

        spreadsheetInfo = `
スプレッドシート全体の概要:
- シート数: ${sheets.length}
- 最終更新: ${lastModified || '不明'}

${sheetsDisplay}
      `;
      }
    } else {
      spreadsheetInfo = 'スプレッドシートデータは未取得です。';
    }

    return this.baseSystemMessage
      .replace(/{EXPLANATION}/g, explanationText)
      .replace(/{SPREADSHEET_DATA}/g, spreadsheetInfo);
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // 送信前にシステムメッセージを最新の状態に更新
      if (this.conversationHistory.length > 0 && this.conversationHistory[0] instanceof SystemMessage) {
        this.conversationHistory[0] = new SystemMessage(this.getCurrentSystemMessage());
      }

      // ユーザーメッセージを履歴に追加
      const userMessage = new HumanMessage(message);
      this.conversationHistory.push(userMessage);

      // メッセージを API エンドポイント用の形式に変換
      const messages = this.conversationHistory.map((msg) => {
        if (msg instanceof SystemMessage) {
          return { role: 'system', content: msg.content };
        } else if (msg instanceof HumanMessage) {
          return { role: 'user', content: msg.content };
        } else if (msg instanceof AIMessage) {
          return { role: 'assistant', content: msg.content };
        }
        return { role: 'user', content: msg.content };
      });

      // 自分の API エンドポイントを呼び出し
      const response = await fetch('/api/explanation-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: 'gpt-5-chat-latest',
          // reasoning_effort: 'low',
          // verbosity: 'low'
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      // AIの返答を履歴に追加
      const aiMessage = new AIMessage(data.content as string);
      this.conversationHistory.push(aiMessage);

      return data.content as string;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  }

  // 問題コンテキストを設定するメソッド
  setProblemContext(problemText: string, answerText: string): void {
    this.baseSystemMessage = `
# 役割
あなたは高校「情報I」の学習支援チューターです。  

## 目的
生徒がこれまでに作成した**シミュレーション問題（スプレッドシート形式）**について、  
それぞれの問題に対して**他者が理解できる完成した「解説文」**を作成できるよう支援します。  

このプロセスの目的は、  
- モデル化とシミュレーション／モンテカルロ法の知識を根拠に、思考を再構成すること  
- 結果の正しさや意味を、他者に説明できる形で文章化すること  
です。  
あなたはチューターとして、学習者の考えを引き出し、文章構成を助言しながら完成度を高めます。

---

## あなたの役割
- 各問題に対する「解説文」を、学習者が自力で完成させられるよう支援する。  
- 解説は、**他の人が読んでも理解できる文章**として仕上げることを目標とする。  
- 思考を整理する問いかけと、文章の構成・表現に関する助言を行う。  
- モデル化・シミュレーション・モンテカルロ法の要素を明確にできるよう導く。  
- 学習者が困っている素振りを何度も見せた場合のみ、例文や表現テンプレートを提示する。

---

## 学習プロセス（Step 3：解説の作成）
### 目標
- 各問題に対して、モデル化と確率的手法を根拠とした**完成した解説文**を作成する。  
- その文章が、第三者にとっても「なるほど」と理解できる構造を持つ。  

### あなたのふるまい
1. 生徒に作成済みの問題と結果を確認し、「この問題は何を表現しているのか」「どのような現象を再現したのか」を引き出す。  
2. その内容をもとに、解説の構成を一緒に組み立てるよう誘導する。  
3. 書き方・語彙・順序に迷っている場合は、表現改善の提案を行う。  
4. 文章の焦点を「なぜこの結果になるのか」「どんな仮定・試行で導かれたのか」に絞るよう助言する。  
5. 各問題の解説が完成したら、内容の正確さ・わかりやすさ・一貫性を簡潔にフィードバックする。  

---

## 対話スタイル
- トーン：丁寧で落ち着いた口調。常に「〜してみましょう」「〜という考え方もありますね」と生徒の発想を肯定する。  
- 1回の出力は **最大で10行程度** に抑えること。  
- 生徒が求めた場合のみ、詳細な説明や手順を追加する。  

---

## 出力形式
- すべての出力は**マークダウン形式**で表示する。  
- 必要に応じて箇条書きや見出しを使い、視覚的にわかりやすくする。  
- スプレッドシート操作例を提示するときは、セル指定（例：\`A2\`、\`=RAND()\`）を明記する。  

---

## 禁止事項
- あなたが学習者の代わりに解説を作成すること。  
- 生徒の意見を否定したり、結論を一方的に示したりすること。  

## 学習者が作成した問題文
${problemText}

## 解答
${answerText}

## 解説
{EXPLANATION}

## スプレッドシートの内容
{SPREADSHEET_DATA}`;


    // 会話履歴を新しいシステムメッセージでリセット
    this.conversationHistory = [new SystemMessage(this.getCurrentSystemMessage())];
  }

  // 解説テキストを設定するメソッド
  setExplanation(explanation: string): void {
    this.currentExplanation = explanation;
  }

  // スプレッドシートデータを設定するメソッド
  setSpreadsheetData(data: DataProblemTemplateData | null): void {
    this.currentSpreadsheetData = data;
    // システムメッセージを更新（履歴は保持）
    if (this.conversationHistory.length > 0 && this.conversationHistory[0] instanceof SystemMessage) {
      this.conversationHistory[0] = new SystemMessage(this.getCurrentSystemMessage());
    }
  }

  // 対話履歴をクリアするメソッド
  clearHistory(): void {
    this.conversationHistory = [new SystemMessage(this.getCurrentSystemMessage())];
  }

  // 対話履歴を取得するメソッド（デバッグ用）
  getHistory(): BaseMessage[] {
    return [...this.conversationHistory];
  }

  // 対話履歴をSupabase保存用の形式で取得
  getConversationHistory(): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    return this.conversationHistory.map((msg) => {
      let role: 'user' | 'assistant' | 'system' = 'system';
      if (msg instanceof HumanMessage) role = 'user';
      else if (msg instanceof AIMessage) role = 'assistant';
      else if (msg instanceof SystemMessage) role = 'system';

      return {
        role,
        content: msg.content as string,
      };
    });
  }
}

export const explanationChatService = new ExplanationChatService();