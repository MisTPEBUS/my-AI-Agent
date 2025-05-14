import { CardProps } from "../components/CardCoursel";

export const menuCards: CardProps[] = [
  {
    image: "/images/BusInfo.png",
    title: "【搭乘資訊】",
    links: [
      { text: "行程規劃", value: "/行程規劃" },
      { text: "查看路線", value: "/查看路線" },
      { text: "查看班距", value: "/查看班距" },
    ],
  },
  {
    image: "/images/tpass.png",
    title: "【都會通TPASS】",
    links: [
      { text: "如何購買", value: "/購買TPASS" },
      { text: "都會通使用範圍", value: "/都會通使用範圍" },
      { text: "效期計算", value: "/都會通效期計算" },
    ],
  },

  {
    image: "/images/help.png",
    title: "【乘客服務】",
    links: [
      { text: "遺失物招領", value: "/遺失物招領" },
      { text: "乘車規定", value: "/乘車規定" },
    ],
  },
];
