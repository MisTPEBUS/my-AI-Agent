"use client";

import { useState } from "react";

const qaPairs = [
  { q: "這班車多久來一班", a: "5分鐘" },
  { q: "請問下一班幾點", a: "5分鐘後" },
  { q: "請問末班車時間", a: "2300" },
];

const getAnswer = (input: string): string => {
  const found = qaPairs.find((pair) => input.includes(pair.q));
  return found ? found.a : "很抱歉，我無法回答這個問題。";
};

export default function QABox() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = getAnswer(input);
    setResponse(answer);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="請輸入問題"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          提交
        </button>
      </form>
      {response && <p className="mt-4">回答：{response}</p>}
    </div>
  );
}
