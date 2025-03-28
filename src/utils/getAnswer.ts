// utils/getAnswer.ts
import Fuse from "fuse.js";
import { qaMap } from "./qaData";

const fuse = new Fuse(qaMap, {
  keys: ["question"],
  threshold: 0.4, // 0 = 完全比對，1 = 非常寬鬆（建議 0.3～0.5）
});

export const getAnswer = (input: string): string | null => {
  const cleanedInput = input
    .toLowerCase()
    .replace(/[？?。、！!,.]/g, "")
    .trim();

  const result = fuse.search(cleanedInput);

  if (result.length > 0) {
    const bestMatch = result[0].item;
    console.log("🎯 命中問題：", bestMatch.question);
    return bestMatch.answer;
  }

  return null;
};
