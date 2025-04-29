import { TDXRoute } from "@/types/tdx";
import dayjs from "dayjs";

export function generateRouteReplyHTML(routes: TDXRoute[]): string {
  const maxRoutes = Math.min(5, routes.length); // Top 5
  let html = "";

  for (let i = 0; i < maxRoutes; i++) {
    const route = routes[i];
    const totalMinutes = Math.round(route.travel_time / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const startTime = dayjs(route.start_time).format("YYYY-MM-DD HH:mm");
    const endTime = dayjs(route.end_time).format("YYYY-MM-DD HH:mm");

    html += `<div class="p-3 my-2 border rounded-lg bg-gray-50">`;
    html += `<h3 class="font-bold text-lg mb-2">🚍 方案${i + 1}</h3>`;
    html += `<p>🟢 出發時間：${startTime}<br>`;
    html += `🟢 抵達時間：${endTime}<br>`;
    html += `🟢 總耗時：${hours > 0 ? `${hours} 小時 ` : ""}${minutes} 分<br>`;
    html += `🟢 轉乘次數：${route.transfers} 次<br>`;
    html += `🟢 總票價：${route.total_price} 元</p>`;
    html += `<ol class="list-decimal ml-5 mt-2 space-y-1">`;

    route.sections.forEach((section) => {
      if (section.type === "pedestrian") {
        const meters = Math.round(section.travelSummary.length);
        const durationMin = Math.round(section.travelSummary.duration / 60);
        const toPlace = section.arrival.place.name || "目的地";
        html += `<li>步行 ${meters} 公尺（約 ${durationMin} 分鐘） → 前往 <b>${toPlace}</b></li>`;
      } else if (section.type === "transit") {
        const transport = section.transport;
        const from = section.departure.place.name || "起點";
        const to = section.arrival.place.name || "終點";
        const fare = transport?.fare ? `（${transport.fare} 元）` : "";
        const vehicle = transport?.longName || transport?.name || "未知路線";
        html += `<li>搭乘 <b>[${vehicle}]</b> → ${from} → ${to} ${fare}`;

        if (section.intermediateStops && section.intermediateStops.length > 0) {
          const stops = section.intermediateStops
            .map((stop) => stop.departure.place.name)
            .join("、");
          html += `<div class="text-sm text-gray-600 ml-2">🚌 途中經過：${stops}</div>`;
        }
        html += `</li>`;
      } else if (section.type === "waiting") {
        const waitMinutes = Math.round(section.travelSummary.duration / 60);
        html += `<li>等車（約 ${waitMinutes} 分鐘）</li>`;
      } else {
        html += `<li>${section.type}（不支援的段落類型）</li>`;
      }
    });

    html += `</ol></div>`;
  }

  return html;
}
