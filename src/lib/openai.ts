import { OpenAI } from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 建議放在 .env 不用 NEXT_PUBLIC
});
