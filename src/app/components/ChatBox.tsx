"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Fuse from "fuse.js";

// 🧠 本地 QA 資料
const qaMap = [
  {
    question: "這班車多久來一班？",
    answer: "這班車約每 5 分鐘一班，尖峰時段可能更密集。",
  },
  {
    question: "請問下一班幾點？",
    answer: "下一班預計約 5 分鐘後抵達，實際請參考站牌即時資訊。",
  },
  {
    question: "請問末班車時間？",
    answer: "末班車時間約為每日 23:00，依各路線略有不同。",
  },
  {
    question: "這班車的發車時間是固定的嗎？",
    answer: "發車時間大多固定，但仍會依交通狀況略有調整。",
  },
  {
    question: "行車時間大概要多久？",
    answer: "全程行車約需 30 至 40 分鐘，依路況而異。",
  },
  {
    question: "為什麼每天發車時間不固定?",
    answer: "因應交通與人流狀況，部分班次時間會機動調整。",
  },
  {
    question: "為什麼路線圖上寫幾點，怎麼沒有車？",
    answer: "可能遇到交通延誤或臨時調度，建議查看即時站牌資訊。",
  },
  {
    question: "這班車有時候提早開走，為什麼？",
    answer: "班車有時會提前完成上下客，因此可能提前發車。",
  },
  {
    question: "今天的班次有異動嗎？",
    answer: "目前班次正常，如有異動會即時公告於站牌或官網。",
  },
  {
    question: "我在XX站車子什麼時候會來?",
    answer: "您所在的 XX 站預計 5 分鐘後抵達下一班車，請注意現場公告。",
  },
  {
    question: "這班車會到XX路嗎？",
    answer: "本班車有行經 XX 路，詳細站點請參考官方路線圖。",
  },
  {
    question: "我可以在哪裡轉搭捷運/台鐵/高鐵？",
    answer: "請於主要轉運站如台北車站、公館、南港等轉乘捷運或鐵路。",
  },
  {
    question: "這台是全程車還是區間車？",
    answer: "本車為全程車，若為區間車會於車體標示與站牌公告。",
  },
  {
    question: "這條路線的起點和終點是哪裡？",
    answer: "起點為 A 站，終點為 B 站，詳細請查詢路線圖。",
  },
  {
    question: "這班車有停靠XX站嗎？",
    answer: "有，本班車停靠 XX 站，若臨時變動會另行公告。",
  },
  {
    question: "這條路線的發車站在哪裡？",
    answer: "發車站為起站 A 站，請至指定月台等候搭乘。",
  },
  {
    question: "這班車中間會停靠哪些地方？",
    answer: "會停靠共計 20 個站點，請參考站牌或官網列表。",
  },
  {
    question: "我要去XX，該在哪裡轉車？",
    answer: "您可在主要轉乘站轉乘其他路線前往 XX。",
  },
  {
    question: "請問這班車返程也是在同一個站牌搭乘嗎？",
    answer: "多數站點上下車同站牌，例外處會標示『對面月台搭乘』。",
  },
  {
    question: "這路線有繞行XX區域嗎？",
    answer: "部分班次行經 XX 區域，請查詢時刻表中的班次備註。",
  },
  {
    question: "請問搭車多少錢？",
    answer: "一般票價為新台幣 15 元起，依搭乘區間與優惠身份計價。",
  },
  {
    question: "悠遊卡被多扣錢怎麼辦？",
    answer: "請持卡至客服中心或撥打 1999 市民專線申訴與查詢。",
  },
  {
    question: "下車沒刷好像被鎖卡了？",
    answer: "請至客服中心或於下次搭乘時告知駕駛協助解鎖。",
  },
  {
    question: "有學生票或老人票嗎？",
    answer: "有，請持學生證或敬老卡上車刷卡即可享優惠票價。",
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
          model: "gpt-4.0-turbo",
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
      console.log(err);
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
