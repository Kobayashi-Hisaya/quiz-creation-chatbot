import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

class ExplanationChatService {
  private baseSystemMessage: string;
  private conversationHistory: BaseMessage[];

  constructor() {
    // 解説相談用のシステムメッセージ
    this.baseSystemMessage = `
    # 役割
    あなたは、選択式問題の解説作成を支援する親切なプログラミング教員です。

    # 命令
    ユーザーが作成している選択式問題の解説について相談に乗ってください。以下の点を重視してサポートしてください：
    - 学習者にとって理解しやすい解説の書き方をアドバイス
    - コードの動作や概念の説明方法を提案
    - 解説の構成や流れについて助言
    - 具体例や図解の提案

    # 対話上の注意
    - 出力はマークダウン形式で行ってください
    - 具体的で実践的なアドバイスを心がけてください
    - 学習者の視点に立った解説作成を推奨してください
    - 質問があれば遠慮なく聞いてください
`;

    // 対話履歴をメモリ内で初期化
    this.conversationHistory = [new SystemMessage(this.baseSystemMessage)];
  }

  async sendMessage(message: string): Promise<string> {
    try {
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
          model: 'gpt-4',
          temperature: 0.7,
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
    あなたは、選択式問題の解説作成を支援する親切なプログラミング教員です。

    # 問題情報
    問題文:
    ${problemText}

    解答コード:
    ${answerText}

    # 命令
    上記の問題とコードについて、学習者向けの解説作成をサポートしてください。以下の点を重視してください：
    - 学習者にとって理解しやすい解説の書き方をアドバイス
    - コードの動作や概念の説明方法を提案
    - 解説の構成や流れについて助言
    - 具体例や図解の提案

    # 対話上の注意
    - 出力はマークダウン形式で行ってください
    - 具体的で実践的なアドバイスを心がけてください
    - 学習者の視点に立った解説作成を推奨してください
    - 質問があれば遠慮なく聞いてください
`;
    // 会話履歴を新しいシステムメッセージでリセット
    this.conversationHistory = [new SystemMessage(this.baseSystemMessage)];
  }

  // 対話履歴をクリアするメソッド
  clearHistory(): void {
    this.conversationHistory = [new SystemMessage(this.baseSystemMessage)];
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