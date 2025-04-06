"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import Fuse from "fuse.js";
import { Mic, Send } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import CardCarousel, { CardProps } from "./CardCoursel";

const qaMap = [
  {
    question: "/遺失物招領",
    answer:
      '<a href="https://www.tpebus.com.tw/lost_list.php" target="_blank" class="text-blue-500 underline">點我連結台北汽車客運官方網站查看遺\n【失物招領】</a>',
  },
  {
    question: "/乘車規定",
    answer: `<div class="bg-white p-6 rounded-2xl shadow-md text-gray-800 leading-relaxed space-y-4 text-base">
    <p class="text-xl font-semibold text-center">乘客乘車安全遵循事項</p>
    <p class="text-sm text-center text-gray-500">於113年3月1日起實施</p>
  
    <p>一、候車時於月台或人行道處，面對來車方向等候，勿進入車道內攔車。如欲搭車，請明確舉手示意搭乘。</p>
    <p>二、上下公車時請依先下後上原則依序上車。</p>
    <p>三、上車後請儘速坐穩並繫好安全帶或握緊拉環扶桿，在車輛行駛中，請勿隨意走動或任意變換座位，亦須隨時緊握拉環扶桿，避免因行駛路況而發生危險。</p>
    <p>四、車門關閉時請乘客勿強行上、下車，以免遭車門夾傷。</p>
    <p>五、車廂人潮擁擠，後背包請改背前方或手提，以免移動時碰撞到其他乘客。</p>
    <p>六、請勿倚靠車門（含安全門）或站立於前後門之禁止站立區內。</p>
    <p>七、下車請提早按鈴，車輛到站停妥後起身移動至車門處下車。</p>
    <p>八、上下車皆請刷卡。</p>
  </div>
  `,
  },
  {
    question: "/購買TPASS",
    answer: `<div class="bg-white p-6 rounded-2xl shadow-md text-gray-800 leading-relaxed space-y-4 text-base">
      <h2 class="text-xl font-semibold text-center">如何購買 TPASS「基北北桃都會通」</h2>
    
      <p class="font-semibold">📌 1. 確認卡片類型：</p>
      <ul class="list-disc list-inside space-y-1">
        <li>💳 <strong>一般實體悠遊卡：</strong> 包含普通卡、悠遊聯名卡、悠遊Debit卡、Samsung Wallet悠遊卡、SuperCard超級悠遊卡、電信悠遊卡。<br>※ 悠遊聯名卡與Debit卡效期需超過60天。</li>
        <li>🎓 <strong>學生卡</strong></li>
        <li>🪪 <strong>數位學生證：</strong> 由悠遊卡公司與政府／學校合作發行，適用 12 歲以上學生。</li>
        <li>📱 <strong>悠遊付 App（EasyWallet）：</strong> 下載 App（v3.1.1以上）即可使用，限支援 NFC 的 Android 手機。<br>※ iOS 目前尚未支援「嗶乘車」。</li>
      </ul>
    
      <p class="font-semibold">🛒 2. 購買地點：</p>
      <ul class="list-disc list-inside space-y-1">
        <li>🚇 新北捷運詢問處、台北捷運各車站、桃園捷運各車站</li>
        <li>🚉 指定臺鐵車站售票窗口</li>
        <li>🏙️ 台北市府轉運站悠遊卡客服中心</li>
        <li>🚌 國光客運站（基隆、台北、板橋、南港、桃園機場、中壢）之悠遊卡售票／加值機</li>
        <li>🏪 全家便利商店 FamiPort 機台</li>
        <li>🏢 基隆東岸廣場 1 樓、基隆轉運站自助售票機</li>
        <li>📲 EasyWallet 悠遊付 App 線上購買</li>
      </ul>
    
      <p class="font-semibold">📝 3. 特別注意：</p>
      <ul class="list-disc list-inside space-y-1">
        <li>如果使用的是 SuperCard 或 Samsung Wallet 悠遊卡，也可以透過悠遊付 App 購買。</li>
      </ul>
    
      <p class="font-semibold">💰 4. 付款方式：</p>
      <p>購票金額 <strong>$1,200</strong> 元，將從您的悠遊卡電子錢包中直接扣款。<br>請事先確認餘額充足，若不足請先加值。</p>
    </div>
    `,
  },
  {
    question: "/都會通使用範圍",
    answer: `有關TPASS「基北北桃都會通」定期票的使用範圍：
      在定期票有效期間內，不限里程、不限次數搭乘基北北桃地區的公共運輸運具，適用範圍如下：
      1.捷運與輕軌：北捷及新北捷所營運的捷運與輕軌路線、桃園大眾捷運股份有限公司所營運的機場捷運線。
      2.市區公車：基隆市區公車路線、臺北市聯營公車路線、新北市市轄公車路線及桃園市區公車路線，詳細路線以基北北桃市政府之公告為準。
      3.臺鐵：起訖站都位於縱貫線基隆站至桃園市新富站，宜蘭線八堵站至福隆站，以及支線深澳線及平溪線各車站間、不限車種的列車。但具專屬性及不發售無座票之對號列車(如觀光、團體、太魯閣、普悠瑪、EMU3000列車等)，不適用。
      4.公路及國道客運：適用路線及乘車區間，請參考「基北北桃都會通使用須知」附件1。
      5.YouBike：臺北市及新北市YouBike 站點，借車前30分鐘免費。桃園市YouBike 站點，借車前60分鐘免費。YouBike2.0E電輔車型不適用。`,
  },
  {
    question: "/都會通效期計算",
    answer: `<div class="prose prose-sm">
      <h3>🚍「都會通」公共運輸定期票有效期限說明</h3>
      <ul>
        <li><strong>啟用日：</strong>當你<strong>首次使用定期票</strong>搭乘捷運、輕軌、台鐵、公車或國道/公路客運時，即視為啟用。</li>
        <li><strong>有效期間：</strong>自啟用當日開始起算，連續有效 <strong>30 天</strong>。</li>
        <li><strong>到期時間：</strong>第 30 天<strong>當日營運時間結束前</strong>，皆可正常使用。</li>
      </ul>
    
      <h4>📌 範例說明：</h4>
      <p>
        若你在 6 月 5 日購買定期票，但<strong>首次使用是在 6 月 10 日</strong>，那麼定期票的有效期間為：
      </p>
      <blockquote>
        🗓️ 6 月 10 日（啟用日）至 7 月 9 日，<br />
        🕘 7 月 9 日當日的營運結束前皆可使用。
      </blockquote>
    
      <h4>🔗 相關資訊</h4>
      <p>
      <img src="/images/tpass_use.jpg" alt="定期票使用說明圖" class="rounded shadow max-w-full" />
      </p>
    </div>
    `,
  },
  {
    question: "/查詢班距",
    answer: `<div class="bg-white p-6 rounded-2xl shadow-md text-gray-800 space-y-4 text-base leading-relaxed">
    <h2 class="text-xl font-semibold text-center">🚍 班距說明</h2>
  
    <div>
      <p class="font-medium">📅 平日 / 假日不一樣</p>
      <p class="ml-4">➡️ 平日可能密集（如 8～12 分鐘），假日則拉長（如 15～20 分鐘）。</p>
    </div>
  
    <div>
      <p class="font-medium">⏰ 尖峰 / 離峰時間不同</p>
      <p class="ml-4">➡️ 通常早上 7:00～9:00、傍晚 5:00～7:00 班距較短。</p>
    </div>
  
    <div>
      <p class="font-medium">🛣️ 路線與車流量影響</p>
      <p class="ml-4">➡️ 市區路線班距短，偏遠或山區可能 20～30 分才一班。</p>
    </div>
  </div>
  `,
  },
  {
    question: "/查看路線",
    answer: ` <CardCarousel cards={nuCards} onSelect={handleCardSelect} />`,
  },
  {
    question: "這班車多久來一班？",
    answer: "這班車約每 5 分鐘一班，尖峰時段可能更密集。",
  },
  {
    question: "這班車多久來一班？",
    answer: "這班車約每 5 分鐘一班，尖峰時段可能更密集。",
  },
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
    question: "我在捷運新店站車子什麼時候會來?",
    answer: "您所在的 預計 5 分鐘後抵達下一班車，請注意現場公告。",
  },
  {
    question: "這班車會到正義北路嗎？",
    answer: "本班車有行經 不會到會到正義北路，詳細站點請參考官方路線圖。",
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
    question: "這班車有停靠松德站嗎？",
    answer: "有，本班車停靠 松德 站，若臨時變動會另行公告。",
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
    question: "我要去台北，該在哪裡轉車？",
    answer: "您可在主要轉乘站轉乘捷運。",
  },
  {
    question: "請問這班車返程也是在同一個站牌搭乘嗎？",
    answer: "多數站點上下車同站牌，例外處會標示『對面月台搭乘』。",
  },
  {
    question: "這路線有繞行新店區域嗎？",
    answer: "可以搭乘棕7，部分班次行經 [新店區域]，請查詢時刻表中的班次備註。",
  },
  {
    question: "請問搭車多少錢？",
    answer: "一般票價為新台幣 15 元起，依搭乘區間與優惠身份計價。",
  },
  {
    question: "悠遊卡溢扣被多扣錢怎麼辦？",
    answer: "請持卡至客服中心或撥打 1999 市民專線申訴與查詢。",
  },
  {
    question: "下車沒刷好像被鎖卡了？",
    answer: "請至客服中心或於下次搭乘時告知駕駛協助解鎖。",
  },
  {
    question: "有學生票或老人票嗎？",
    answer: "持學生證或敬老卡上車刷卡即可享優惠票價。",
  },
];

const menuCards: CardProps[] = [
  {
    image: "/images/tpass.png",
    title: "【都會通TPASS】",

    links: [
      { text: "如何購買", value: "/購買TPASS" }, //URL
      { text: "都會通使用範圍", value: "/都會通使用範圍" }, //文字
      { text: "效期計算", value: "/都會通效期計算" }, //圖片
    ],
  },
  {
    image: "/images/BusInfo.png",
    title: "【搭乘資訊】",
    links: [
      { text: "查看路線", value: "/查看路線" },
      { text: "查看班距", value: "/查看班距" },

      /*  { text: "票價查詢", value: "/票價查詢" },
      { text: "其他路線", value: "/其他路線" }, */
    ],
  },
  {
    image: "/images/help.png",
    title: "【乘客服務】",
    links: [
      { text: "遺失物招領", value: "/遺失物招領" }, //網站
      { text: "乘車規定", value: "/乘車規定" }, //文字
    ],
  },
];
/* const busCards: CardProps[] = [
  {
    image: "https://www.tpebus.com.tw/images/logo.gif",
    title: "南環幹線",
    subTitle: "行駛區間為新店至台北市政府，部分班次延駛至新店區安康路。 ",
    links: [
      { text: "查看路線", value: "/查看南環幹線路線" }, //URL
      { text: "查看班距", value: "/查看班距" }, //文字
      { text: "票價查詢", value: "/查詢南環幹線票價" }, //圖片
    ],
  },
  {
    image: "https://www.tpebus.com.tw/images/logo.gif",
    title: "棕7",
    subTitle:
      "行駛區間為新店至台北市政府，部分班次延駛至新店區安康路或綠野香坡。",
    links: [
      { text: "查看路線", value: "/查看棕7路線" }, //URL
      { text: "查看班距", value: "/查看班距" }, //文字
      { text: "票價查詢", value: "/查詢南環幹線票價" }, //圖片
    ],
  },
  {
    image: "https://www.tpebus.com.tw/images/logo.gif",
    title: "8",
    subTitle: "行駛區間為捷運新店站至捷運景安站。",
    links: [
      { text: "查看路線", value: "/查看8路線" }, //URL
      { text: "查看班距", value: "/查看班距" }, //文字
      { text: "票價查詢", value: "/查詢南環幹線票價" }, //圖片
    ],
  },
]; */

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
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "您現在在台北客運捷運新店站（新店路）：\n請開始你的聊天...",
    },
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
    start(({ transcript }) => {
      setInput(transcript);
    });
  };

  const handleCardSelect = (text: string) => {
    setInput(text); // 可選：如果你想讓 input 顯示被點的文字
    handleSubmit(undefined, text);
  };

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    if (e) e.preventDefault();
    const finalInput = overrideInput ?? input;
    if (!finalInput.trim()) return;

    const userMsg = { role: "user", content: finalInput };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // 👉 嘗試從本地取得答案
    const localAnswer = getAnswer(finalInput);
    if (localAnswer) {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: localAnswer },
      ]);
      return; // ❗️直接結束，不發送 API
    }

    const loadingMsg = { role: "loading", content: "正在輸入中..." };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
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
      setMessages((prev) => [...prev.slice(0, -1), reply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "system", content: "很抱歉，查詢發生錯誤，請稍後再試。" },
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
          ) : msg.role === "loading" ? (
            <div key={index} className="flex items-center gap-2">
              <Image
                src="/images/AIicon.png"
                alt="ai"
                width={40}
                height={40}
                className="rounded-full"
              />
              <p className="bg-gray-100 p-3 rounded max-w-[80%] animate-pulse">
                正在輸入中<span className="animate-bounce">...</span>
              </p>
            </div>
          ) : (
            <div key={index} className=" items-center gap-2 ">
              <Image
                src="/images/AIicon.png"
                alt="ai"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div
                className="bg-gray-100 p-3 rounded max-w-[80%] prose prose-sm"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
              <div>
                <CardCarousel cards={menuCards} onSelect={handleCardSelect} />
              </div>
            </div>
          )
        )}
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
