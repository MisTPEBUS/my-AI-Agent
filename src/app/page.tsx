"use client";

/* import dynamic from "next/dynamic"; */

import ChatBox from "./components/ChatBox";

/* const VoiceInput = dynamic(() => import("./components/VoiceInput/VoiceInput"), {
  ssr: false, // 強制只在 client render
}); */

export default function MyGPTChatPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="hidden md:flex fixed top-0 left-0 w-full bg-white shadow z-50 h-16 items-center">
        <div className="container px-4 flex justify-center">
          <div className="text-lg font-semibold">智能小客服</div>
        </div>
      </header>

      {/* 占位高度 */}
      <div className="h-16" />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="container">
          <div className="max-w-lg mx-auto mt-10 p-6 bg-white border rounded-lg shadow-lg">
            <ChatBox />
          </div>
        </div>
      </main>

      {/* Footer */}
      {/*  <footer className="fixed bottom-0 left-0 w-full bg-white shadow z-50 h-16 flex items-center">
            <div className="container px-4 flex justify-center">
              <div className="text-sm text-gray-600">© 2025 My App</div>
            </div>
          </footer> */}
    </div>
  );
}
