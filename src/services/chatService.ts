import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

class ChatService {
  private baseSystemMessage: string;
  private currentLearningTopic: string;
  private conversationHistory: BaseMessage[];

  constructor() {

        this.baseSystemMessage = `
        # 役割
        あなたは，親しみのあるプロのプログラミング教員です．

        # 命令
        プログラミングに関連する問題を作ることを通して、**{LEARNING_TOPIC}**の考え方を用いて日常生活の問題解決の方法を考えられるようになりたいです。
        あなたは私が提示したテーマについて，**{LEARNING_TOPIC}**によって解決できる問題を作成するための質問を私に投げかけてください．
        例えば，「そのテーマではどのようなデータが数値として記録されるのですか？」「そのデータはどのように計算されるのですか？」などです．
        私はプログラミング初心者なので，親切で分かりやすい説明を心がけて下さい．

        # 問題について
        - 回答は JavaScript のソースコード
        - 多くても 20 行ほどの量に抑える
        - 私が興味のある分野と関連している

        # 対話上の注意
        - 出力はマークダウン形式で行ってください。
        - あなたが 1 から問題や答えを示すのではなく、私自身が答えを導けるようにヒントや質問を投げかけてください。
        - **{LEARNING_TOPIC}**がどのような条件の時に適用できるのかということを常に私に考えさせてください。
        - 対話を進める中であなたが必要だと思った場合は，私にどんどん質問して下さい．
        - 質問は 1 つの対話につき 1 つにして下さい．
    `;

    this.currentLearningTopic = "制御構造";

    // 対話履歴をメモリ内で初期化
    this.conversationHistory = [new SystemMessage(this.getCurrentSystemMessage())];
  }

  // 学習項目を設定するメソッド
  setLearningTopic(topic: string): void {
    this.currentLearningTopic = topic;
    // 履歴をクリアして新しいシステムメッセージで開始
    this.clearHistory();
  }

  // 現在のシステムメッセージを生成
  private getCurrentSystemMessage(): string {
    return this.baseSystemMessage.replace(/{LEARNING_TOPIC}/g, this.currentLearningTopic);
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          model: 'gpt-4o',
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

export const chatService = new ChatService();
