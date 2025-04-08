"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import { FaBus, FaTicketAlt, FaInfoCircle, FaRegSmile } from "react-icons/fa";

const SIDES = ["top"] as const;
type SheetSide = (typeof SIDES)[number];

type Props = {
  onSelect: (text: string) => void;
};

export default function SheetSide({ onSelect }: Props) {
  const [side, setSide] = useState<SheetSide>("top");
  console.log(side);
  const handleClick = (action: string) => {
    onSelect(action); // 呼叫 ChatBox 的 handleCardSelect
    document.getElementById("close-sheet")?.click(); // 關閉 Sheet
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {SIDES.map((direction) => (
        <Sheet key={direction}>
          <SheetTrigger asChild>
            <Button variant="outline" onClick={() => setSide(direction)}>
              Menu
            </Button>
          </SheetTrigger>

          <SheetContent
            side={direction}
            className="w-[100vw] sm:w-[360px] px-4"
          >
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">
                功能選單
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                請選擇你要操作的項目
              </SheetDescription>
            </SheetHeader>

            <nav className="mt-6 space-y-4 ">
              <Section
                title="都會通 TPASS"
                icon={<FaTicketAlt className="text-green-600" />}
                items={[
                  { text: "如何購買", value: "/購買TPASS" },
                  { text: "都會通使用範圍", value: "/都會通使用範圍" },
                  { text: "效期計算", value: "/都會通效期計算" },
                ]}
                onSelect={handleClick}
              />
              <Section
                title="搭乘資訊"
                icon={<FaBus className="text-blue-600" />}
                items={[
                  { text: "查看路線", value: "/查看路線" },
                  { text: "查看班距", value: "/查看班距" },
                ]}
                onSelect={handleClick}
              />
              <Section
                title="乘客服務"
                icon={<FaRegSmile className="text-orange-500" />}
                items={[
                  { text: "遺失物招領", value: "/遺失物招領" },
                  { text: "乘車規定", value: "/乘車規定" },
                ]}
                onSelect={handleClick}
              />
            </nav>

            <SheetFooter className="mt-8">
              <SheetClose asChild>
                <Button id="close-sheet" className="w-full" variant="outline">
                  關閉選單
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

function Section({
  title,
  icon,
  items,
  onSelect,
}: {
  title: string;
  icon: React.ReactNode;
  items: { text: string; value: string }[];
  onSelect: (text: string) => void;
}) {
  return (
    <div>
      <h3 className="text-gray-800 font-medium mb-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.text}>
            <button
              onClick={() => onSelect(item.value)}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-xl flex items-center gap-2"
            >
              <FaInfoCircle /> {item.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
