"use client";

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import Fuse from "fuse.js";

import { Mic, Send } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

import ChatMessage, { Message } from "./ChatMessage";
import { qaMap } from "@/lib/qaMap";
import { getLatLng } from "@/utils/geoCoding";
import { getTDXRoutePlan } from "@/utils/tdxRoutePlan";
import { generateRouteReplyHTML } from "@/utils/routeReply";
import { PlaceAutoComplete } from "./PlaceAutoComplete/componnts/PlaceAutoComplete";
import { busCards } from "../config/bus";
import { menuCards } from "../config/menu";

const getAnswer = (input: string): string | null => {
  const fuse = new Fuse(qaMap, { keys: ["question"], threshold: 0.4 });
  const cleaned = input
    .toLowerCase()
    .replace(/[？?。、！!,.]/g, "")
    .trim();
  const result = fuse.search(cleaned);
  return result.length > 0 ? result[0].item.answer : null;
};

const ChatBox = forwardRef((_, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "您現在在[站牌]三重正義重新路口：請開始你的聊天...",
    },
    { role: "cards", content: "menuCards" },
  ]);
  const [planningMode, setPlanningMode] = useState(false);

  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_OPENAI_KEY;
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const micSubmitLock = useRef(false);
  const { start, isListening } = useSpeechRecognition();
  /* const hasMounted = useRef(false); */

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0); // or 100ms to wait for DOM
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMicClick = () => {
    start(({ transcript }) => {
      const text = transcript.trim();
      const lower = text.toLowerCase();

      setInput(text);

      if (
        !micSubmitLock.current &&
        (lower.includes("送出") || lower.includes("發送"))
      ) {
        micSubmitLock.current = true;
        handleSubmit(undefined, text);

        setTimeout(() => {
          micSubmitLock.current = false;
        }, 1500); // 1.5秒後允許下一次送出
      }
    });
  };

  const handleCardSelect = (text: string) => {
    if (text.startsWith("/show-map")) {
      const url = new URLSearchParams(text.replace("/show-map?", ""));
      const lat = parseFloat(url.get("lat") || "0");
      const lng = parseFloat(url.get("lng") || "0");

      setMessages((prev) => [
        ...prev,
        {
          role: "map",
          content: JSON.stringify({ lat, lng }),
        },
      ]);
      return;
    }

    setInput(text);
    handleSubmit(undefined, text);
  };

  useImperativeHandle(ref, () => ({
    handleCardSelect,
  }));

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = overrideInput ?? input;
    if (!finalInput.trim()) return;

    const userMsg: Message = { role: "user", content: finalInput };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    if (planningMode) {
      setPlanningMode(false); // 關閉規劃模式
      const destination = finalInput;
      const toLocation = await getLatLng(destination);
      // 1. 查GPS
      const fromLatLng = { lat: 25.063047, lng: 121.497543 };
      if (!toLocation) {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "❌ 找不到該地點，請重新輸入。" },
        ]);
        return;
      }
      console.log(
        `🚏 出發地：天台廣場 (${fromLatLng.lat}, ${fromLatLng.lng})\n🏁 目的地：${destination} (${toLocation.lat}, ${toLocation.lng})`
      );

      //2. 呼叫TDX API
      try {
        const tdxResult = await getTDXRoutePlan(toLocation.lat, toLocation.lng);
        const routes = tdxResult.data?.routes;
        console.log("routes:", routes);
        if (!routes || routes.length === 0) {
          setPlanningMode(true);
          setMessages((prev) => [
            ...prev,
            {
              role: "system",
              content: "❌ 查無符合的路線，請確認輸入的目的地。",
            },
          ]);
          return;
        }

        // 看 API 回傳格式調整

        const messageContent = `🚏 出發地：正義重新路口 (${fromLatLng.lat}, ${fromLatLng.lng})\n🏁 目的地：${destination} (${toLocation.lat}, ${toLocation.lng})\n\n`;
        console.log("TDX Routes:", messageContent);
        const replyHTML = generateRouteReplyHTML(routes);
        setMessages((prev) => [
          ...prev,
          { role: "system", content: replyHTML },
        ]);
        return;
      } catch (error: unknown) {
        console.log(error);
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "❌ 無法取得路線規劃，請稍後再試。" },
        ]);
        return;
      }
    }

    // 2️⃣ 判斷是否要啟動行程規劃
    if (finalInput.trim() === "/行程規劃") {
      setPlanningMode(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "請問您要到哪個地方呢？我可以幫您規劃行程！",
        },
      ]);
      return;
    }
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
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!planningMode) handleSubmit();
        }}
        className="fixed bottom-0 left-0 w-full px-4 py-2 bg-white border-t flex items-center gap-2"
      >
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
        {planningMode ? (
          <PlaceAutoComplete
            value={input}
            onChange={setInput}
            onSelect={(placeId, description) => {
              setInput(description);
              handleSubmit(undefined, description);
              // ✅ 觸發送出
            }}
          />
        ) : (
          <input
            type="text"
            placeholder="開始聊天..."
            className="w-full p-2 border rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}

        <button type="submit" className="p-2 rounded bg-blue-500 text-white">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
});

ChatBox.displayName = "ChatBox";

export default ChatBox;
