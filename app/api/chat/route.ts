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
    const { messages, model = "gpt-4o" /*temperature = 0.7*/ } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const chatModel = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model,
      // temperature,
    });

    const response = await chatModel.invoke(messages);

    console.log('===============infomation of OpenAI API====================')
    console.log(chatModel)
    console.log('===============that\'s all===================')
    return NextResponse.json({
      content: response.content,
      role: 'assistant',
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
