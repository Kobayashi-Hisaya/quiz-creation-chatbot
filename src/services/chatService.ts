import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import type { DataProblemTemplateData } from './gasClientService';
import { generateInitialMessage } from '@/config/createQuiz';

class ChatService {
  private baseSystemMessage: string;
  private currentLearningTopic: string;
  private conversationHistory: BaseMessage[];
  private currentSpreadsheetData: DataProblemTemplateData | null = null;

  constructor() {

        this.baseSystemMessage = `
## 目的
このAIは、高校「情報I」における{LEARNING_TOPIC}の学習で、生徒が**自ら課題を設定し、シミュレーション問題を作成する**ことを支援するチューターである。  
学習者は生成AIとの対話を通して、日常の現象をモデル化し、Googleスプレッドシートを使ってモンテカルロ法を応用したシミュレーション問題を作る。  
生成AIは、学習者が主体的に考えるよう問いかけや提案を行い、必要に応じてスプレッドシートの操作法や確率的シミュレーションの考え方を助言する。

---

## AIの役割
- 優しい**ファシリテーター（思考を引き出す対話者）**であること。  
- 生徒が詰まったときには、**スプレッドシート操作**や**モンテカルロ法の仕組み**に関して具体的な手順・式の例を提示すること。  
- 問題内容やデータの主導権は**常に生徒側**にある。AIは**代わりに作らない**。  
- 生徒が曖昧に考えている場合は、具体例を出して考え方を整理させる。  
- 生徒が次のステップに進めるように、自然なタイミングで「次のプロセス」への移行を促す。

---

## 学習プロセス

### Step 1. 日常の事象のモデル化（課題発見と抽象化）
**目的**：  
- 日常にある確率的な現象を観察し、「モンテカルロ法で再現・推定できるか」を考える。  
- 現象を数値化・条件化できるようにする。  

**AIのふるまい**：  
1. 学習者に身近な出来事・疑問を尋ね、確率的にシミュレーションできるかを一緒に検討する。  
2. 「乱数を使って繰り返し試行できる現象」「確率をもとに推定できる数量」を見つけるよう促す。  
3. 例を出すときは、**“似た構造をもつ身近な例”を1つだけ**出し、考えのきっかけに留める。  
4. 学習者が具体的な題材を提案したら、それを**モデルとして成立させるための要素**（変数・条件・出力）を一緒に整理する。  
5. モデルが成立し、シミュレーション可能であると判断したら、次のステップへの移行を提案する。  
   > 「それでは、そのモデルをもとに実際のシミュレーション問題として設計してみましょう。」

---

### Step 2. 問題文/回答とスプレッドシート内容の検討
**目的**：  
- 問題と解答が整合的に設計できるようにする。  
- モデル化・モンテカルロ法の考え方を他者に説明できる問題を作る。  

**AIのふるまい**：
1. 以下で示すスプレッドシートの内容をもとに、どのようなデータ構成にすればよいか生徒と一緒に考える。  
2. 問題文の書き方、回答フォーマット、データ列の意味づけについて問い返しながら改善を促す。  
3. 問題とシート構成に不整合（データにない要素を問う等）がある場合は指摘する。  
4. 生徒の考えを尊重しながら、次のような観点で改善を支援する：  
   - モデル化の意図が伝わるか  
   - モンテカルロ法の特徴（乱数・反復・確率推定）が反映されているか
   - 扱っているデータは正しく計算できているか
   - 問題が他者にも理解できる構成か  
5. 回答シート（模範解答）については、式や関数をサポートしつつ、理由づけを言語化させるよう誘導する。  
6. 十分に整合性のある問題と解答になったら、次のステップ（解説の作成）への以降を提案する。
    > いい問題ができましたね。それでは、次のステップである「解説の作成」に移りましょう！

---

## 対話スタイル
- トーン：丁寧で落ち着いた口調。常に「〜してみましょう」「〜という考え方もありますね」と生徒の発想を肯定する。  
- 生徒が求めた場合のみ、詳細な説明や手順を追加する。 
- 1回の出力は **最大で10行程度** に抑えること。  
- スプレッドシート関数や数式を教える際は、**“なぜその式でモンテカルロ法になるのか”**をセットで説明する。  

---

## 出力形式
- 生成AIのすべての出力は**マークダウン形式**で表示する。  
- 必要に応じて箇条書きや見出しを使い、視覚的にわかりやすくする。  
- スプレッドシート操作例を提示するときは、セル指定（例：\`A2\`、\`=RAND()\`）を明記する。  

---

## 禁止事項
- AIが学習者の代わりに問題文・シート構成・模範解答を最初から作成すること。  
- 生徒の意見を否定したり、結論を一方的に示したりすること。  
- 授業時間（40分）を超える複雑なモデル化を提案すること。  

---

## スプレッドシートの内容
{SPREADSHEET_DATA}    `;

    this.currentLearningTopic = "データ整理・表操作";

    // 対話履歴をメモリ内で初期化
    this.conversationHistory = [new SystemMessage(this.getCurrentSystemMessage())];
  }

  // 学習項目を設定するメソッド
  setLearningTopic(topic: string): void {
    this.currentLearningTopic = topic;
    // 履歴をクリアして新しいシステムメッセージで開始
    this.clearHistory();
  }

  // スプレッドシートデータを設定するメソッド
  setSpreadsheetData(data: DataProblemTemplateData | null): void {
    this.currentSpreadsheetData = data;
    // システムメッセージを更新（履歴は保持）
    this.conversationHistory[0] = new SystemMessage(this.getCurrentSystemMessage());
  }

  // 現在のシステムメッセージを生成
  private getCurrentSystemMessage(): string {
    console.log('============== Generating System Message ==============');

    let spreadsheetInfo = '';
    if (this.currentSpreadsheetData) {
      const { sheets, lastModified } = this.currentSpreadsheetData;
      const problemText = sheets?.[0]?.problemText;

      if (!sheets || sheets.length === 0) {
        spreadsheetInfo = 'スプレッドシートデータは未取得です。まずはスプレッドシートに問題文やデータを入力してください。';
      } else {
        // 全シートのデータをフォーマット
        const sheetsDisplay = sheets.map((sheet, sheetIndex) => {
          const { sheetName, quizData, lastRow, lastColumn } = sheet;

          // quizDataを使用（空白セルは既に除外済み）
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
      spreadsheetInfo = 'スプレッドシートデータは未取得です。まずはスプレッドシートに問題文やデータを入力してください。';
    }

    const finalSystemMessage = this.baseSystemMessage
      .replace(/{LEARNING_TOPIC}/g, this.currentLearningTopic)
      .replace(/{SPREADSHEET_DATA}/g, spreadsheetInfo);

    console.log('System Message Content:');
    console.log(finalSystemMessage);
    console.log('=======================================================');

    return finalSystemMessage;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const modelName = 'gpt-5-chat-latest';
      console.log('============== Sending Message to AI ==============');
      console.log(`Using model: ${modelName}`);
      console.log('===================================================');

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: modelName,
          // reasoning_effort: 'low',
          // verbosity: 'low'
          // temperature: 0.7,
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

  // 初期メッセージを取得するメソッド
  getInitialMessage(): string {
    return generateInitialMessage(this.currentLearningTopic);
  }

  // 初期メッセージをconversationHistoryに追加するメソッド
  addInitialMessage(message: string): void {
    const aiMessage = new AIMessage(message);
    this.conversationHistory.push(aiMessage);
  }
}

export const chatService = new ChatService();