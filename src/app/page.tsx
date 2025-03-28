"use client";

/* import dynamic from "next/dynamic"; */

import ChatBox from "./components/ChatBox";

/* const VoiceInput = dynamic(() => import("./components/VoiceInput/VoiceInput"), {
  ssr: false, // 強制只在 client render
}); */

export default function MyGPTChatPage() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white border rounded-lg shadow-lg">
      <ChatBox />
    </div>
  );
}
