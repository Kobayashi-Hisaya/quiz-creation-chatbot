export interface ReviewTopicConfig {
  reviewQuestions: string;
}

export const REVIEW_TOPICS: Record<string, ReviewTopicConfig> = {
  'モデル化とシミュレーション/モンテカルロ法': {
    reviewQuestions: `1. モデル化についてです。なぜ現実の問題をそのままコンピュータで扱うことは難しいのでしょうか？モデル化の意義とはなんでしょうか？
2. モデルを用いたシミュレーションとは、何をすることですか？
3. モンテカルロ法は、どんな時に役立つ方法ですか？
4. モンテカルロ法で試行回数を増やすと、結果はどう変わりますか？`,
  },
  // 他の学習項目もここに追加可能
};

// 初期メッセージのテンプレート（全学習項目共通）
export const INITIAL_MESSAGE_TEMPLATE = `こんにちは😀
{LEARNING_TOPIC}について簡単に復習しましょう。
以下の質問について考え、あなたの答えを教えてください：
{REVIEW_QUESTIONS}`;

// ヘルパー関数: 学習項目が定義済みかチェック
export const hasTopicConfig = (topic: string): boolean => {
  return topic in REVIEW_TOPICS;
};

// ヘルパー関数: 初期メッセージを生成
export const generateInitialMessage = (topic: string): string => {
  const config = REVIEW_TOPICS[topic];
  if (!config) {
    // カスタムトピックの場合
    return `こんにちは😀
${topic}について簡単に復習しましょう。
あなたが理解している内容を自由に教えてください。`;
  }

  return INITIAL_MESSAGE_TEMPLATE
    .replace('{LEARNING_TOPIC}', topic)
    .replace('{REVIEW_QUESTIONS}', config.reviewQuestions);
};
