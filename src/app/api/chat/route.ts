import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "請使用台灣繁體中文，以公車為主來回答交通問題。",
        },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return NextResponse.json({
      message:
        completion.choices[0]?.message?.content?.trim() || "沒有回應內容",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "未知錯誤" }, { status: 500 });
  }
}
