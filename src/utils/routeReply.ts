import { TDXRoute } from "@/types/tdx";
/* import dayjs from "dayjs"; */

function roundToNearest15(value: number): number {
  return Math.round(value / 15) * 15;
}

export function generateRouteReplyHTML(routes: TDXRoute[]): string {
  const maxRoutes = Math.min(5, routes.length);
  let html = "";
  console.log(maxRoutes);
  for (let i = 0; i < maxRoutes; i++) {
    const route = routes[i];
    const totalMinutes = Math.round(route.travel_time / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let totalFare = 0;

    html += `<div class="bg-white rounded-xl shadow-lg p-5 space-y-5 text-sm mb-4">`;

    // 標題列
    html += `
      <div class="flex items-center gap-3 text-blue-800">
        <span class="text-2xl">🚍</span>
        <h3 class="text-xl font-bold">方案 ${i + 1}</h3>
        <div class="text-sm text-neutral-600 ml-auto">🔁 <b>轉乘：</b>${
          route.transfers
        } 次</div>
      </div>
    `;

    // 路線段落
    html += `<div class="space-y-3">`;
    console.log("route", route);

    route.sections.forEach((section) => {
      if (section.type === "pedestrian") {
        const meters = Math.round(section.travelSummary.length);
        const durationMin = Math.round(section.travelSummary.duration / 60);
        const toPlace = section.arrival.place.name || "目的地";
        const lat = section.arrival.place.location.lat;
        const lng = section.arrival.place.location.lng;
        html += `
        <div class="flex items-start gap-2 text-neutral-700 bg-gray-100 px-3 py-2 rounded-md">
          🚶‍♂️ <span>
            步行 ${meters} 公尺（約 ${durationMin} 分）→ <b>${toPlace}</b>
            <button data-lat="${lat}" data-lng="${lng}" class="text-blue-600 underline ml-2 show-map-btn">查看地圖</button>
          </span>
        </div>
      `;
      } else if (section.type === "transit") {
        const from = section.departure.place.name || "起點";
        const to = section.arrival.place.name || "終點";
        const rawFare = section.transport?.fare ?? 0;
        const adjustedFare = rawFare ? roundToNearest15(rawFare) : 0;
        totalFare += adjustedFare;

        const fare = rawFare ? `${adjustedFare} 元` : "依實際搭乘";

        const vehicle =
          section.transport?.longName || section.transport?.name || "未知路線";
        const stops =
          section.intermediateStops
            ?.map((s) => s.departure.place.name)
            .join("、") || "";
        const isTransfer = route.transfers > 0;
        const bg = isTransfer
          ? "bg-blue-50 border-blue-400 text-blue-700"
          : "bg-yellow-50 border-amber-400 text-amber-700";

        html += `
          <div class="${bg} border-l-4 px-4 py-3 rounded-lg">
            <div class="font-semibold text-base mb-1">
              🚌 ${
                isTransfer ? "轉乘" : "搭乘"
              } <span class="font-bold text-lg">[${vehicle}]</span>
            </div>
            <div class="ml-4 space-y-1 text-neutral-700">
              <p>上車站：<b>${from}</b></p>
              <p>下車站：<b>${to}</b></p>
              <p>票價：<span class="text-green-600 font-semibold">${fare}</span></p>
            </div>
            ${
              stops
                ? `<div class="ml-4 mt-1 text-xs text-gray-500 border-t pt-2">🛣️ 途中經過：${stops}</div>`
                : ""
            }
          </div>
        `;
      } else if (section.type === "waiting") {
        const waitMinutes = Math.round(section.travelSummary.duration / 60);
        html += `
          <div class="text-neutral-500 text-sm px-3 py-2 rounded-md bg-gray-50">
            🕒 等車（約 ${waitMinutes} 分鐘）
          </div>
        `;
      } else {
        html += `
          <div class="text-red-500 text-sm px-3 py-2 rounded-md bg-red-50">
            ⚠️ 不支援的段落類型：${section.type}
          </div>
        `;
      }
    });

    html += `</div>`; // 路線段落 end

    // 底部資訊
    html += `
      <div class="grid grid-cols-2 sm:grid-cols-3 text-neutral-700 mt-2">
        <div>⏳ <b>耗時：</b>${
          hours > 0 ? `${hours} 小時 ` : ""
        }${minutes} 分</div>
        <div>💰 <b>票價：</b>${totalFare} 元</div>
      </div>
      <div class="text-center text-xs text-gray-400 italic pt-2">
        預估時間與價格以實際搭乘為主
      </div>
    `;

    html += `</div>`; // 卡片 end
  }

  return html;
}
