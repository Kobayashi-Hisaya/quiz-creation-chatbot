import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages, model = "gpt-5" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const chatModel = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model,
  //     verbosity,
  //     modelKwargs: {
  //     reasoning_effort: reasoning_effort
  // },

    });

    // NextRequestのAbortSignalを取得してChatOpenAIに渡す
    const response = await chatModel.invoke(messages, {
      signal: request.signal,
    });

    return NextResponse.json({
      content: response.content,
      role: 'assistant',
    });
  } catch (error) {
    // AbortErrorの場合は特別な処理（クライアントが意図的にキャンセルした）
    if (error instanceof Error && error.name === 'AbortError') {
      console.log("Request was aborted by client");
      return NextResponse.json(
        { error: "Request cancelled" },
        { status: 499 } // クライアント側でのキャンセルを示すステータスコード
      );
    }
    console.error("Error in review-chat API:", error);
    return NextResponse.json(
      { error: "Failed to process review chat request" },
      { status: 500 }
    );
  }
}
