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
    html += `🟢 總票價：${route.total_price} 元(依實際搭乘)</p>`;
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
      return;
    });

    html += `</ol></div>`;
    html += `
  <div class="bg-white rounded-xl shadow-lg p-5 space-y-5 text-sm">
  <!-- 標題列 -->
  <div class="flex items-center gap-3 text-blue-800">
    <span class="text-2xl">🚍</span>
    <h3 class="text-xl font-bold">方案 1</h3>
    <div class="text-sm text-neutral-600 ml-auto">🔁 <b>轉乘：</b>1 次</div>
  </div>

  <!-- 路線段落 -->
  <div class="space-y-3">
    <!-- 步行段落 1 -->
    <div class="flex items-start gap-2 text-neutral-700 bg-gray-100 px-3 py-2 rounded-md">
      🚶‍♂️ <span>步行 2 公尺（約 0 分）→ <b>南港路三段</b></span>
    </div>

    <!-- 搭乘段落 -->
    <div class="bg-yellow-50 border-l-4 border-amber-400 px-4 py-3 rounded-lg">
      <div class="text-amber-700 font-semibold text-base mb-1">
        🚌 搭乘 <span class="font-bold text-lg">[306藍洲→凌雲五村]</span>
      </div>
      <div class="ml-4 space-y-1 text-neutral-700">
        <p>上車站：<b>南港路三段</b></p>
        <p>下車站：<b>捷運松江南京站</b></p>
        <p>票價：<span class="text-green-600 font-semibold">36 元</span></p>
      </div>
      <div class="ml-4 mt-1 text-xs text-gray-500 border-t pt-2">
        🛣️ 途中經過：松山磚廠、玉成里、松山車站(八德)、松山農會、饒河街觀光夜市(塔悠)、南松山(南京)、南京公寓(捷運南京三民)、南京三民路口、南京寧安街口、南京敦化路口(小巨蛋)、捷運南京復興站、南京龍江路口、南京建國路口、捷運松江南京站
      </div>
    </div>

    <!-- 步行段落 2 -->
    <div class="flex items-start gap-2 text-neutral-700 bg-gray-100 px-3 py-2 rounded-md">
      🚶‍♂️ <span>步行 2520 公尺（約 30 分）→ <b>目的地</b></span>
    </div>
  </div>

   <!-- 搭乘段落 -->
    <div class="bg-yellow-50 border-l-4 border-amber-400 px-4 py-3 rounded-lg">
      <div class="text-amber-700 font-semibold text-base mb-1">
        🚌 轉乘 <span class="font-bold text-lg">[306藍洲→凌雲五村]</span>
      </div>
      <div class="ml-4 space-y-1 text-neutral-700">
        <p>上車站：<b>南港路三段</b></p>
        <p>下車站：<b>捷運松江南京站</b></p>
        <p>票價：<span class="text-green-600 font-semibold">36 元</span></p>
      </div>
      <div class="ml-4 mt-1 text-xs text-gray-500 border-t pt-2">
        🛣️ 途中經過：松山磚廠、玉成里、松山車站(八德)、松山農會、饒河街觀光夜市(塔悠)、南松山(南京)、南京公寓(捷運南京三民)、南京三民路口、南京寧安街口、南京敦化路口(小巨蛋)、捷運南京復興站、南京龍江路口、南京建國路口、捷運松江南京站
      </div>
    </div>


  <!-- 底部時間資訊 -->
  <div class="grid grid-cols-2 sm:grid-cols-3 text-neutral-700 mt-2">
    <div>⏳ <b>耗時：</b>55 分</div>
    <div>💰 <b>票價：</b>36 元</div>
  </div>

  <!-- 備註 -->
  <div class="text-center text-xs text-gray-400 italic pt-2">
    預估時間與價格以實際搭乘為主
  </div>
</div>



`;
  }

  return html;
}
