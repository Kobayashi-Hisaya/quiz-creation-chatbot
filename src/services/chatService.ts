import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

class ChatService {
  private model: ChatOpenAI;
  private baseSystemMessage: string;
  private currentLearningTopic: string;
  private conversationHistory: BaseMessage[];

  constructor() {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required. Please set NEXT_PUBLIC_API_KEY in your environment variables.");
    }

    this.model = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model: "gpt-4",
      temperature: 0.7,
    });

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

      // 現在の対話履歴全体でAPIを呼び出し
      const response = await this.model.invoke(this.conversationHistory);

      // AIの返答を履歴に追加
      const aiMessage = new AIMessage(response.content as string);
      this.conversationHistory.push(aiMessage);

      return response.content as string;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message. Please check your API key and try again.");
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
