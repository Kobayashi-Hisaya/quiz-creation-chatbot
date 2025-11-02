import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

class ReviewChatService {
  private baseSystemMessage: string;
  private currentLearningTopic: string;
  private conversationHistory: BaseMessage[];

  constructor() {
    this.baseSystemMessage = `
# 役割
あなたは、選択した学習項目について復習を支援する親切なデータ分析・スプレッドシート教員です。

# 命令
学習項目「{LEARNING_TOPIC}」について、学習者が理解を深められるよう対話的に支援してください。

## 最初の対話での指示
- まず、学習項目「{LEARNING_TOPIC}」に関する1文で答えられる質問を3つ提示してください。
- 質問は基本的な概念理解を確認するものにしてください。
- 質問には番号を付けて、明確に区別できるようにしてください。

## 学習者の回答に対する指示
- 学習者の回答に対して、適切な補足説明を行ってください。
- 正誤を判定するのではなく、理解を深めるための追加情報や具体例を提供してください。
- 必要に応じて、スプレッドシートの具体的な機能や使用例を示してください。

## 復習完了の判断
- 学習者が3つの質問すべてに答え、十分な理解が得られたと判断したら、次のメッセージを含めてください：
  「復習お疲れさまでした。理解が深まったようですね。それでは、問題作成に移りましょう。」
- ただし、学習者がさらに質問や確認を求めている場合は、問題作成への移行を急がず、丁寧に対応してください。

# 対話上の注意
- 出力はマークダウン形式で行ってください。
- 学習者のペースに合わせて進めてください。
- 具体的なスプレッドシート操作の例を積極的に使用してください。
- 専門用語を使う場合は、わかりやすく説明してください。
`;

    this.currentLearningTopic = "";
    this.conversationHistory = [new SystemMessage(this.baseSystemMessage)];
  }

  // 学習項目を設定するメソッド
  setLearningTopic(topic: string): void {
    this.currentLearningTopic = topic;
    // システムメッセージを更新
    const systemMessage = this.baseSystemMessage.replace(
      /{LEARNING_TOPIC}/g,
      topic
    );
    this.conversationHistory = [new SystemMessage(systemMessage)];
  }

  async sendMessage(message: string, signal?: AbortSignal): Promise<string> {
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

      // 自分の API エンドポイントを呼び出し（AbortSignalを渡す）
      const response = await fetch('/api/review-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: 'gpt-5',
        }),
        signal, // AbortSignalを追加
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
      // AbortErrorの場合は、履歴から追加したメッセージを削除
      if (error instanceof Error && error.name === 'AbortError') {
        // 最後に追加したユーザーメッセージを削除
        this.conversationHistory.pop();
        throw error; // AbortErrorは上位に伝播
      }
      console.error("Error sending message:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  }

  // 対話履歴をクリアするメソッド
  clearHistory(): void {
    const systemMessage = this.baseSystemMessage.replace(
      /{LEARNING_TOPIC}/g,
      this.currentLearningTopic
    );
    this.conversationHistory = [new SystemMessage(systemMessage)];
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

export const reviewChatService = new ReviewChatService();
