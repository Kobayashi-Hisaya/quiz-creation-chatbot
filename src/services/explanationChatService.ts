import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

class ExplanationChatService {
  private model: ChatOpenAI;
  private baseSystemMessage: string;
  private conversationHistory: BaseMessage[];

  constructor() {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required. Please set VITE_OPENAI_API_KEY in your environment variables.");
    }

    this.model = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model: "gpt-4",
      temperature: 0.7,
    });

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
    
    // 対話履歴を初期化
    this.conversationHistory = this.loadConversationHistory();
  }

  // localStorageから対話履歴を読み込む
  private loadConversationHistory(): BaseMessage[] {
    try {
      const stored = localStorage.getItem('explanationChatHistory');
      if (stored) {
        type HistoryItem = { type: "system" | "human" | "ai"; content: string };
        const historyData: HistoryItem[] = JSON.parse(stored);
        return historyData.map((msg) => {
          switch (msg.type) {
            case 'system':
              return new SystemMessage(msg.content);
            case 'human':
              return new HumanMessage(msg.content);
            case 'ai':
              return new AIMessage(msg.content);
            default:
              return new SystemMessage(this.baseSystemMessage);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load explanation chat history from localStorage:', error);
    }
    return [new SystemMessage(this.baseSystemMessage)];
  }

  // localStorageに対話履歴を保存する
  private saveConversationHistory(): void {
    try {
      const historyData = this.conversationHistory.map(msg => {
        let type = 'system';
        if (msg instanceof HumanMessage) type = 'human';
        else if (msg instanceof AIMessage) type = 'ai';
        else if (msg instanceof SystemMessage) type = 'system';
        
        return {
          type,
          content: msg.content
        };
      });
      localStorage.setItem('explanationChatHistory', JSON.stringify(historyData));
    } catch (error) {
      console.error('Failed to save explanation chat history to localStorage:', error);
    }
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

      // localStorageに保存
      this.saveConversationHistory();

      return response.content as string;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message. Please check your API key and try again.");
    }
  }

  // 対話履歴をクリアするメソッド
  clearHistory(): void {
    this.conversationHistory = [new SystemMessage(this.baseSystemMessage)];
    this.saveConversationHistory();
    localStorage.removeItem('explanationChatMessages');
  }

  // 対話履歴を取得するメソッド（デバッグ用）
  getHistory(): BaseMessage[] {
    return [...this.conversationHistory];
  }
}

export const explanationChatService = new ExplanationChatService();