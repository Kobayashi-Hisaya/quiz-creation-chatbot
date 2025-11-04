export interface CreateQuizTopicConfig {
  initialMessage: string;
}

export const CREATE_QUIZ_TOPICS: Record<string, CreateQuizTopicConfig> = {
  'モデル化とシミュレーション/モンテカルロ法': {
    initialMessage: `
それでは、問題の作成に移りましょう✏️\n
まずはあなたの興味があることを教えてください。
スポーツ（野球やサッカー）やゲーム（ポケモン、ドラクエ、囲碁将棋）、日々の学校生活（学校祭、部活動、成績）など、どんなことでも大丈夫です。
その中から、モンテカルロ法を使ってシミュレーションできそうなテーマを一緒に探してみましょう。`,
  },
  // 他の学習項目もここに追加可能
};

// 初期メッセージのテンプレート（全学習項目共通）
export const INITIAL_MESSAGE_TEMPLATE = `それでは、問題の作成に移りましょう✏️まずはあなたの興味があることを教えてください。
スポーツ・音楽・学校生活・遊びなど、どんなことでも大丈夫です。
その中から、{LEARNING_TOPIC}を使ってシミュレーションできそうなテーマを一緒に探してみましょう。`;

// ヘルパー関数: 学習項目が定義済みかチェック
export const hasTopicConfig = (topic: string): boolean => {
  return topic in CREATE_QUIZ_TOPICS;
};

// ヘルパー関数: 初期メッセージを生成
export const generateInitialMessage = (topic: string): string => {
  const config = CREATE_QUIZ_TOPICS[topic];
  if (!config) {
    // カスタムトピックの場合
    return INITIAL_MESSAGE_TEMPLATE.replace('{LEARNING_TOPIC}', topic);
  }

  return config.initialMessage;
};
