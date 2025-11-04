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
    const { messages, systemPrompt, model = "gpt-5-chat-latest" } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // systemPrompt が提供されている場合、messages の先頭に system メッセージとして追加
    const fullMessages = systemPrompt
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    console.log('[agent-assessment API] System prompt length:', systemPrompt?.length || 0);
    console.log('[agent-assessment API] Total messages:', fullMessages.length);

    const chatModel = new ChatOpenAI({
      apiKey: OPENAI_API_KEY,
      model
      // verbosity,
      // modelKwargs: {
      // reasoning_effort: reasoning_effort
  // },
    });

    const response = await chatModel.invoke(fullMessages);

    return NextResponse.json({
      content: response.content,
      role: 'assistant',
    });
  } catch (error) {
    console.error("Error in agent assessment API:", error);
    return NextResponse.json(
      { error: "Failed to process agent assessment request" },
      { status: 500 }
    );
  }
}