import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { AutoGenerationRequest, AutoGenerationResponse } from "../../../src/types/quiz";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json() as AutoGenerationRequest;
    const { problemText, code, language, learningTopic } = body;

    if (!problemText || !code || !language || !learningTopic) {
      return NextResponse.json(
        { error: "problemText, code, language, and learningTopic are required" },
        { status: 400 }
      );
    }

    const model = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model: "gpt-4o",
      temperature: 0,
    });

    const systemPrompt = `
    あなたは教育用選択式問題作成の専門家です。与えられた問題文、コード、学習項目(${learningTopic})から、学習者の理解が深まるような選択式問題を作成してください。

    # 指示
    1. ${learningTopic}に関連する最も重要な箇所を確実に1つ選んで「___BLANK___」にする
    2. ___BLANK___は**必ずソースコード中から選び**、決してソースコードを追加して___BLANK___にしたりコメントアウト(// の部分)の部分を___BLANK___にしたりしない
    3. ___BLANK___は最大でソースコード1行とし、なるべく短くする
    4. **正解は絶対に1つのみ（___BLANK___としたソースコードをそのまま出力）**とし、B、C、Dには明らかな誤答を出力する
    5. 誤答は言語の文法ではなく、学習項目に関連するものとし、学習者が学びのある素晴らしいものにする。
    6. JSONフォーマットで回答する

    # 出力フォーマット
    {
      "problemText": "元の問題文を保持し、末尾に「___BLANK___の部分に当てはまる適切な選択肢を選べ。」を追加した問題文",
      "codeWithBlanks": "ソースコードの一部を___BLANK___に置き換え、そのほかは変更していないコード",
      "choices": [
        {"id": "A", "text": "選択肢A", "isCorrect": true},
        {"id": "B", "text": "選択肢B", "isCorrect": false},
        {"id": "C", "text": "選択肢C", "isCorrect": false},
        {"id": "D", "text": "選択肢D", "isCorrect": false}
      ],
      "correctChoiceId": "A"
    }
    `;

    const userPrompt = `
    # 問題文
    ${problemText}

    # ソースコード (${language})
    \`\`\`
    ${code}
    \`\`\`

    # 学習項目
    ${learningTopic}
    `;

    const messages = [new SystemMessage(systemPrompt), new HumanMessage(userPrompt)];
    const response = await model.invoke(messages);
    const responseText = response.content as string;

    // JSON部分を抽出
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AIの応答からJSONを抽出できませんでした" },
        { status: 500 }
      );
    }

    const parsedResponse = JSON.parse(jsonMatch[0]) as AutoGenerationResponse;

    // バリデーション
    if (!parsedResponse.codeWithBlanks.includes("___BLANK___")) {
      return NextResponse.json(
        { error: "空欄箇所が正しく設定されていません" },
        { status: 500 }
      );
    }

    if (!parsedResponse.choices || parsedResponse.choices.length !== 4) {
      return NextResponse.json(
        { error: "選択肢は4つである必要があります" },
        { status: 500 }
      );
    }

    const correctChoices = parsedResponse.choices.filter((choice) => choice.isCorrect);
    if (correctChoices.length !== 1) {
      return NextResponse.json(
        { error: "正答は1つである必要があります" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error in quiz generation API:", error);
    return NextResponse.json(
      { error: `問題の自動生成に失敗しました: ${error}` },
      { status: 500 }
    );
  }
}