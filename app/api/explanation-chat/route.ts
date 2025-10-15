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
    const { messages, model = "gpt-4", temperature = 0.7 } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const chatModel = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model,
      temperature,
    });

    const response = await chatModel.invoke(messages);

    return NextResponse.json({
      content: response.content,
      role: 'assistant',
    });
  } catch (error) {
    console.error("Error in explanation chat API:", error);
    return NextResponse.json(
      { error: "Failed to process explanation chat request" },
      { status: 500 }
    );
  }
}