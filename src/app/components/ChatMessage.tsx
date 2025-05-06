// components/ChatMessage.tsx
"use client";

import Image from "next/image";
import CardCarousel, { CardProps } from "./CardCoursel";

export type Message = {
  role: "user" | "system" | "loading" | "cards" | "map";
  content: string;
};

type Props = {
  message: Message;
  onCardSelect?: (value: string) => void;
  busCards: CardProps[];
  menuCards: CardProps[];
};

export default function ChatMessage({
  message,
  onCardSelect,
  busCards,
  menuCards,
}: Props) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end items-center gap-2">
        <p className="bg-blue-100 p-3 rounded max-w-[100%]">
          {message.content}
        </p>
        <Image
          src="/images/user.png"
          alt="user"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
    );
  }

  if (message.role === "loading") {
    return (
      <div className="flex items-center gap-2">
        <Image
          src="/images/AIicon.png"
          alt="ai"
          width={40}
          height={40}
          className="rounded-full"
        />
        <p className="bg-gray-100 p-3 rounded max-w-[100%] animate-pulse">
          正在輸入中<span className="animate-bounce">...</span>
        </p>
      </div>
    );
  }

  if (message.role === "cards") {
    const selectedCards = message.content === "busCards" ? busCards : menuCards;
    return (
      <div className="items-center gap-2">
        <Image
          src="/images/AIicon.png"
          alt="ai"
          width={40}
          height={40}
          className="rounded-full"
        />
        <CardCarousel cards={selectedCards} onSelect={onCardSelect} />
      </div>
    );
  }

  // 系統訊息/HTML
  return (
    <div className="items-center gap-2">
      <Image
        src="/images/AIicon.png"
        alt="ai"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div
        className="bg-gray-100 p-3 rounded max-w-[100%] prose prose-sm"
        dangerouslySetInnerHTML={{ __html: message.content }}
      />
    </div>
  );
}
