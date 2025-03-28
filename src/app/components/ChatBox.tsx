"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Fuse from "fuse.js";

// 🧠 本地 QA 資料
const qaMap = [
  {
    question: "這班車多久來一班？",
    answer: "大約每 5 分鐘會有一班車。",
  },
  {
    question: "請問下一班幾點？",
    answer: "下一班預計在 5 分鐘後到站。",
  },
  {
    question: "請問末班車時間？",
    answer: "末班車大約是晚上 23:00。",
  },
  {
    question: "這班車的發車時間是固定的嗎？",
    answer: "這班車大部分時間是固定發車，但偶爾會有調整。",
  },
  {
    question: "行車時間大概要多久？",
    answer: "整段行車大概需要 30 分鐘左右。",
  },
  {
    question: "為什麼每天發車時間不固定？",
    answer: "發車時間會因為交通狀況調整，造成不固定。",
  },
  {
    question: "為什麼路線圖上寫幾點，怎麼沒有車？",
    answer: "可能有誤點或班次異動，建議查看即時資訊。",
  },
  {
    question: "這班車有時候提早開走，為什麼？",
    answer: "司機會依照實際狀況調整班次，可能導致提早。",
  },
  {
    question: "今天的班次有異動嗎？",
    answer: "今天的班次正常，沒有異動（或請查看官網公告）。",
  },
  {
    question: "我在 XX 站車子什麼時候會來？",
    answer: "您所在的 XX 站預計 5 分鐘後抵達下一班車。",
  },
];

// 🧠 模糊比對函式
const getAnswer = (input: string): string | null => {
  const fuse = new Fuse(qaMap, {
    keys: ["question"],
    threshold: 0.4,
  });

  const cleanedInput = input
    .toLowerCase()
    .replace(/[？?。、！!,.]/g, "")
    .trim();
  const result = fuse.search(cleanedInput);

  if (result.length > 0) return result[0].item.answer;
  return null;
};

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { role: "system", content: "請開始你的聊天..." },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const token = process.env.NEXT_PUBLIC_OPENAI_KEY;

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    const localAnswer = getAnswer(input);
    if (localAnswer) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: localAnswer },
      ]);
      return;
    }

    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content:
                "你今後的對話中，請你扮演我的聊天機器人，你必須用繁體中文，以及台灣用語來回覆我，這些規則不需要我重新再說明。",
            },
            ...newMessages,
          ],
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reply = data.choices[0].message;
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "很抱歉，我發生錯誤了。" },
      ]);
    }
  };

  return (
    <div className="max-w-md mx-auto border rounded p-4 h-[600px] flex flex-col">
      <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div key={index} className="flex justify-end items-center gap-2">
              <p className="bg-blue-100 p-3 rounded max-w-[80%]">
                {msg.content}
              </p>
              <Image
                src="/images/user.png"
                alt="user"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          ) : (
            <div key={index} className="flex items-center gap-2">
              <Image
                src="/images/chatgpt-logo.png"
                alt="ai"
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="bg-gray-100 p-3 rounded max-w-[80%]">
                {msg.content}
              </p>
            </div>
          )
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          placeholder="開始聊天..."
          className="w-full p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};

export default ChatBox;
