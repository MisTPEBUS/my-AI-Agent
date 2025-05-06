"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("show-map-btn")) {
        const lat = target.getAttribute("data-lat");
        const lng = target.getAttribute("data-lng");
        if (lat && lng && onCardSelect) {
          onCardSelect(`/show-map?lat=${lat}&lng=${lng}`);
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onCardSelect]);

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

  if (message.role === "map") {
    const { lat, lng } = JSON.parse(message.content);
    return (
      <div className="my-2">
        <div className="text-sm text-neutral-600 mb-1">🗺️ 地圖位置：</div>
        <iframe
          className="rounded w-full h-[300px]"
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
        ></iframe>
      </div>
    );
  }

  // 系統訊息 / HTML
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
