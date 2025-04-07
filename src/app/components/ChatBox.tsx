// components/ChatBox.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Fuse from "fuse.js";

import { Mic, Send } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { CardProps } from "./CardCoursel";
import ChatMessage, { Message } from "./ChatMessage";
import { qaMap } from "@/lib/qaMap";

const menuCards: CardProps[] = [
  {
    image: "/images/tpass.png",
    title: "【都會通TPASS】",
    links: [
      { text: "如何購買", value: "/購買TPASS" },
      { text: "都會通使用範圍", value: "/都會通使用範圍" },
      { text: "效期計算", value: "/都會通效期計算" },
    ],
  },
  {
    image: "/images/BusInfo.png",
    title: "【搭乘資訊】",
    links: [
      { text: "查看路線", value: "/查看路線" },
      { text: "查看班距", value: "/查看班距" },
    ],
  },
  {
    image: "/images/help.png",
    title: "【乘客服務】",
    links: [
      { text: "遺失物招領", value: "/遺失物招領" },
      { text: "乘車規定", value: "/乘車規定" },
    ],
  },
];

const busCards: CardProps[] = [
  {
    image: "/images/tpebus.png",
    title: "路線【南環幹線】",
    subTitle: "行駛區間為新店至台北市政府，部分班次延駛至新店區安康路。",
    links: [
      { text: "查看路線", value: "/查看南環幹線路線" },
      { text: "查看班距", value: "/查看班距" },
      { text: "票價查詢", value: "/查詢南環幹線票價" },
    ],
  },
  {
    image: "/images/tpebus.png",
    title: "路線【棕7】",
    subTitle: "行駛區間為新店至台北市政府，部分班次延駛至安康路或綠野香坡。",
    links: [
      { text: "查看路線", value: "/查看棕7路線" },
      { text: "查看班距", value: "/查看班距" },
      { text: "票價查詢", value: "/查詢棕7票價" },
    ],
  },
  {
    image: "/images/tpebus.png",
    title: "路線【8】",
    subTitle: "行駛區間為新店至台北市政府，部分班次延駛至安康路或綠野香坡。",
    links: [
      { text: "查看路線", value: "/查看8路線" },
      { text: "查看班距", value: "/查看班距" },
      { text: "票價查詢", value: "/查詢棕8票價" },
    ],
  },
];

const getAnswer = (input: string): string | null => {
  const fuse = new Fuse(qaMap, { keys: ["question"], threshold: 0.4 });
  const cleaned = input
    .toLowerCase()
    .replace(/[？?。、！!,.]/g, "")
    .trim();
  const result = fuse.search(cleaned);
  return result.length > 0 ? result[0].item.answer : null;
};

const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "您現在在台北客運捷運新店站（新店路）：請開始你的聊天...",
    },
    { role: "cards", content: "menuCards" },
  ]);

  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_OPENAI_KEY;
  const { start, isListening } = useSpeechRecognition();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMicClick = () => {
    start(({ transcript }) => setInput(transcript));
  };

  const handleCardSelect = (text: string) => {
    setInput(text);
    handleSubmit(undefined, text);
  };

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = overrideInput ?? input;
    if (!finalInput.trim()) return;

    const userMsg: Message = { role: "user", content: finalInput };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "loading", content: "正在輸入中..." },
    ]);

    if (finalInput.trim() === "/查看路線") {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "cards", content: "busCards" },
        ]);
      }, 2000);
      return;
    }

    const localAnswer = getAnswer(finalInput);
    if (localAnswer) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "system", content: localAnswer },
        ]);
      }, 2000);
      return;
    }

    try {
      const gptMessages = newMessages.filter((msg) =>
        ["user", "system", "assistant"].includes(msg.role)
      );
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "user",
              content:
                "你今後的對話中，請你扮演我的聊天機器人，你必須用繁體中文，台灣用語來回覆我，這些規則不需要我重新再說明。",
            },
            ...gptMessages,
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
      setTimeout(() => {
        setMessages((prev) => [...prev.slice(0, -1), reply]);
      }, 2000);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "system", content: "很抱歉，查詢發生錯誤，請稍後再試。" },
        ]);
      }, 2000);
    }
  };

  return (
    /* mx-auto border rounded p-4 h-[600px] flex flex-col */
    <div className="">
      <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            onCardSelect={handleCardSelect}
            busCards={busCards}
            menuCards={menuCards}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleMicClick}
          className={`p-2 rounded-full ${
            isListening ? "bg-red-500" : "bg-gray-200"
          }`}
          title="語音輸入"
        >
          <Mic size={20} />
        </button>
        <input
          type="text"
          placeholder="開始聊天..."
          className="w-full p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="p-2 rounded bg-blue-500 text-white">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
