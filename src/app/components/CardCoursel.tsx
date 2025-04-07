// components/CardCarousel.tsx
"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

type Link = {
  text: string;
  value: string;
};

export type CardProps = {
  image: string;
  title: string;
  subTitle?: string;
  links: Link[];
};

type Props = {
  cards: CardProps[];
  onSelect?: (text: string) => void;
};

export default function CardCarousel({ cards, onSelect }: Props) {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4 ml-[72px] ">
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-[306px] max-w-sm bg-white rounded-2xl shadow-md object-fit: fill flex-shrink-0 border"
          >
            <Image
              src={card.image}
              alt={card.title}
              width={306}
              height={200}
              className="rounded-lg mb-2 object-fill w-full h-40"
            />
            <h3 className="text-lg font-bold text-gray-800 px-2">
              {card.title}
            </h3>
            <h6 className="text-lg font-bold text-gray-400 px-4">
              {card.subTitle}
            </h6>
            <div className="h-px bg-gray-300 my-3 mx-4"></div>

            <div className="flex flex-col space-y-2 items-center my-4">
              {card.links.map((link, i) => (
                <button
                  key={i}
                  onClick={() => onSelect?.(link.value)}
                  className="text-left text-sky-800 hover:underline text-lg"
                >
                  {link.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
