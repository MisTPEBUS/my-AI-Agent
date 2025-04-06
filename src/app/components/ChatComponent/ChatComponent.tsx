"use client";

import { openAiRequest } from "@/app/lib/openai";
import { useState, useRef, FormEvent } from "react";

type Message = {
  role: "user" | "system";
  content: string;
};

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "請開始你的聊天..." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(newMessages);
    setInput("");

    const response = await openAiRequest(newMessages);
    setMessages([...newMessages, { role: "system", content: response }]);
    setLoading(false);

    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  };

  return (
    <div className="border rounded shadow p-4 w-full max-w-md bg-white flex flex-col h-[600px]">
      <h1 className="text-center text-xl font-semibold">客服聊天室</h1>
      <hr className="my-2" />
      <div ref={chatRef} className="overflow-auto flex-1 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`rounded p-3 max-w-[100%] ${
                msg.role === "user" ? "bg-blue-100" : "bg-gray-200"
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full border rounded p-3"
          placeholder="開始聊天..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
      </form>
    </div>
  );
}
