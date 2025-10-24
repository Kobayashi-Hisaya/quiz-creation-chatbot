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
        // まず生テキストを取得してからJSONにパースする（空のJSONや非JSON応答にも対応）
        const text = await response.text();

        // 試みてJSONを解析
        let errorData: any = null;
        try {
          errorData = JSON.parse(text);
        } catch (e) {
          console.error('Quiz generation API response (non-JSON):', text);
          throw new Error(`API request failed: ${response.statusText} - ${text}`);
        }

        // 空のオブジェクトが返るケースをハンドル
        if (!errorData || Object.keys(errorData).length === 0) {
          console.error('Quiz generation API returned empty JSON:', text);
          throw new Error(`API request failed: ${response.statusText} - ${text}`);
        }

        console.error('Quiz generation API error:', errorData);
        const rawInfo = errorData.raw ? `\nRaw response: ${errorData.raw}` : '';
        throw new Error((errorData.error || `API request failed: ${response.statusText}`) + rawInfo);
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
