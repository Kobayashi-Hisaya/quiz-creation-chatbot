import { BaseMessage, HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { REVIEW_TOPICS, generateInitialMessage } from "@/config/reviewTopics";

class ReviewChatService {
  private baseSystemMessage: string;
  private currentLearningTopic: string;
  private conversationHistory: BaseMessage[];

  constructor() {
    this.baseSystemMessage = `
# 役割
あなたは高校の情報科の授業をサポートする、親切でわかりやすい対話型チューターです。  
学習者（高校生）が「{LEARNING_TOPIC}」の基本的な概念を理解できるよう、対話を通じて支援してください。

# 目的
学習者が自分の言葉で考えながら理解を深め、安心して学べるように導くこと。

# 進行方法
1. 以下の4つの質問を順に提示し、学習者から1文程度の回答を引き出してください。
2. 各回答に対しては、正誤を判定せず、次のような方針でフィードバックを行ってください：
   - 回答のよい点をまず肯定的に伝える。
   - 必要に応じて、わかりやすい補足説明や具体例を加える。
   - 学習者が理解を深められるよう、簡単な追質問を行ってもよい。
3. すべての質問に回答が得られたら、理解が十分であると判断した場合に次のメッセージを提示してください：
   > 「復習お疲れさまでした。理解が深まったようですね。それでは、問題作成に移りましょう。」
4. 学習者が追加の質問や確認を求めている場合は、問題作成には進まず丁寧に説明を続けてください。

# 質問
{REVIEW_QUESTIONS}

# 対話上の注意
- 出力はマークダウン形式で行ってください。  
- 専門用語を使うときは必ず中学生にもわかる表現で補足してください。  
- 学習者のペースに合わせ、丁寧で温かい口調で話しかけてください。  
- 学習者が迷っている様子の場合は、すぐに答えを教えるのではなく、ヒントを与えて導いてください。
`;

    this.currentLearningTopic = "";
    this.conversationHistory = [new SystemMessage(this.baseSystemMessage)];
  }

  // 学習項目を設定するメソッド
  setLearningTopic(topic: string): void {
    this.currentLearningTopic = topic;

    // 学習項目の復習質問を取得
    const config = REVIEW_TOPICS[topic];
    const reviewQuestions = config?.reviewQuestions || 'この学習項目について、重要なポイントを教えてください。';

    // システムメッセージを更新（{LEARNING_TOPIC}と{REVIEW_QUESTIONS}を置換）
    const systemMessage = this.baseSystemMessage
      .replace(/{LEARNING_TOPIC}/g, topic)
      .replace(/{REVIEW_QUESTIONS}/g, reviewQuestions);

    this.conversationHistory = [new SystemMessage(systemMessage)];
  }

  // 初期メッセージを取得するメソッド（API呼び出しなし）
  getInitialMessage(): string {
    return generateInitialMessage(this.currentLearningTopic);
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
    // 学習項目の復習質問を取得
    const config = REVIEW_TOPICS[this.currentLearningTopic];
    const reviewQuestions = config?.reviewQuestions || 'この学習項目について、重要なポイントを教えてください。';

    // システムメッセージを更新（{LEARNING_TOPIC}と{REVIEW_QUESTIONS}を置換）
    const systemMessage = this.baseSystemMessage
      .replace(/{LEARNING_TOPIC}/g, this.currentLearningTopic)
      .replace(/{REVIEW_QUESTIONS}/g, reviewQuestions);

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

  // 初期メッセージをconversationHistoryに追加するメソッド
  addInitialMessage(message: string): void {
    const aiMessage = new AIMessage(message);
    this.conversationHistory.push(aiMessage);
  }
}

export const reviewChatService = new ReviewChatService();
