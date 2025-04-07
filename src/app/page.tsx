"use client";

import { Bus } from "lucide-react";
/* import dynamic from "next/dynamic"; */

import ChatBox from "./components/ChatBox";

/* const VoiceInput = dynamic(() => import("./components/VoiceInput/VoiceInput"), {
  ssr: false, // 強制只在 client render
}); */

export default function MyGPTChatPage() {
  return (
    <div className=" flex flex-col min-h-screen bg-gray-50 px-4 py-4 md:py-0 md:px-0 ">
      <header className=" text-center fixed top-0 left-0 w-full md:text-3xl text-xl  font-bold  px-4 text-black  bg-gradient-to-r from-[#F87171]/70 to-[#60A5FA]/90   shadow z-50 h-16 items-center">
        <div className="container flex  gap-2 mx-auto py-2 pl-8">
          <Bus className="w-8 h-8 " />
          <span className="">首都臺北汽車客運 AI 智慧客服</span>
        </div>
      </header>

      {/* 占位高度 */}
      {/*  <div className="h-16" /> */}

      {/* Main content */}
      <main className="min-h-[calc(100vh)] overflow-y-auto pt-4 pb-20 container mx-auto">
        <div className=" mt-10  md:p-6 bg-white  ">
          <ChatBox />
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
