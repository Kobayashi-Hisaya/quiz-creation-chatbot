import type { AutoGenerationRequest, AutoGenerationResponse } from "../types/quiz";

class QuizGenerationService {
  async generateQuiz(request: AutoGenerationRequest): Promise<AutoGenerationResponse> {
    try {
      // 自分の API エンドポイントを呼び出し
      const response = await fetch('/api/quiz-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API request failed: ${response.statusText}`);
      }

      const data = await response.json() as AutoGenerationResponse;
      return data;
    } catch (error) {
      console.error("Quiz generation error:", error);
      throw new Error(`問題の自動生成に失敗しました: ${error}`);
    }
  }
}

export const quizGenerationService = new QuizGenerationService();
