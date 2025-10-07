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

    // ベースのシステムメッセージ
    //     this.baseSystemMessage = `
    //     # 役割
    //     あなたは，親しみのあるプロのプログラミング教員です．

    //     # 命令
    //     プログラミングに関連する問題を作ることを通して、**{LEARNING_TOPIC}**の考え方を用いて日常生活の問題解決の方法を考えられるようになりたいです。
    //     あなたは私が提示したテーマについて，**{LEARNING_TOPIC}**によって解決できる問題を作成するための質問を私に投げかけてください．
    //     例えば，「そのテーマではどのようなデータが数値として記録されるのですか？」「そのデータはどのように計算されるのですか？」などです．
    //     私はプログラミング初心者なので，親切で分かりやすい説明を心がけて下さい．

    //     # 問題について
    //     - 回答は JavaScript のソースコード
    //     - 多くても 20 行ほどの量に抑える
    //     - 私が興味のある分野と関連している

    //     # 対話上の注意
    //     - 出力はマークダウン形式で行ってください。
    //     - あなたが 1 から問題や答えを示すのではなく、私自身が答えを導けるようにヒントや質問を投げかけてください。
    //     - **{LEARNING_TOPIC}**がどのような条件の時に適用できるのかということを常に私に考えさせてください。
    //     - 対話を進める中であなたが必要だと思った場合は，私にどんどん質問して下さい．
    //     - 質問は 1 つの対話につき 1 つにして下さい．
    // `;

    this.baseSystemMessage = `
    私はuser，あなたはassistantです．以下のやり取りの通りに対話を進めて．
    user: 野球に関する問題を作成したいです
    assistant: それは素晴らしいアイデアですね！ 野球は多くの数値データが存在するので、制御構造を適用するのに適しています。それではまず、野球に関連するどの種類のデータに興味がありますか？例えば、選手の成績、試合結果、チームの順位などがありますね。
    user: チーム打率とかですかね
    assistant: なるほど，いいですね！それでは、チーム打率を計算するためには、どのようなデータが必要だと思いますか？また、それらのデータはどのように計算されると思いますか？
    user: 各選手の打数と安打数です．それぞれ合計して，安打数/打数で計算するのがいいと思います
    assistant: それは正解です！チーム打率は、全選手の安打数を全選手の打数で割ることで計算されます。それでは、プログラム上でこれをどのように実装するか考えてみましょう。打数と安打数のデータをどのように格納しますか？リストや辞書などが使えますね。
    user: 辞書ってなんですか？
    assistant: 辞書とは、Pythonのデータ構造の一つで、キーと値のペアを格納するものです。例えば、各選手の名前をキーとし、その選手の打数と安打数を値とする辞書を作成することができます。以下に一例を示します。
    players = [
    {"name": "選手A", "hits": 100, "at_bats": 300},
    {"name": "選手B", "hits": 110, "at_bats": 350},
    {"name": "選手C", "hits": 120, "at_bats": 400},
    # 以降、選手が続く...
    ]

    `;

    this.currentLearningTopic = "制御構造";

    // 対話履歴を初期化（localStorageから復元またはシステムメッセージから開始）
    this.conversationHistory = this.loadConversationHistory();
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

      // localStorageに保存
      this.saveConversationHistory();

      return response.content as string;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message. Please check your API key and try again.");
    }
  }

  // localStorageから対話履歴を読み込む
  private loadConversationHistory(): BaseMessage[] {
    try {
      const stored = localStorage.getItem("conversationHistory");
      if (stored) {
        type HistoryItem = { type: "system" | "human" | "ai"; content: string };
        const historyData: HistoryItem[] = JSON.parse(stored);
        return historyData.map((msg) => {          
          switch (msg.type) {
            case "system":
              return new SystemMessage(msg.content);
            case "human":
              return new HumanMessage(msg.content);
            case "ai":
              return new AIMessage(msg.content);
            default:
              return new SystemMessage(this.baseSystemMessage);
          }
        });
      }
    } catch (error) {
      console.error("Failed to load conversation history from localStorage:", error);
    }
    return [new SystemMessage(this.getCurrentSystemMessage())];
  }

  // localStorageに対話履歴を保存する
  private saveConversationHistory(): void {
    try {
      const historyData = this.conversationHistory.map((msg) => {
        let type = "system";
        if (msg instanceof HumanMessage) type = "human";
        else if (msg instanceof AIMessage) type = "ai";
        else if (msg instanceof SystemMessage) type = "system";

        return {
          type,
          content: msg.content,
        };
      });
      localStorage.setItem("conversationHistory", JSON.stringify(historyData));
    } catch (error) {
      console.error("Failed to save conversation history to localStorage:", error);
    }
  }

  // 対話履歴をクリアするメソッド
  clearHistory(): void {
    this.conversationHistory = [new SystemMessage(this.getCurrentSystemMessage())];
    this.saveConversationHistory();
  }

  // 対話履歴を取得するメソッド（デバッグ用）
  getHistory(): BaseMessage[] {
    return [...this.conversationHistory];
  }
}

export const chatService = new ChatService();
