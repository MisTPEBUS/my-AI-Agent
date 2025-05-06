import axios from "axios";
import { getTDXAccessToken } from "@/utils/tdxAuth";
import type { TDXRoutePlanResponse } from "@/types/tdx"; // 建議放在 src/types/tdx.ts

export const getTDXRoutePlan = async (
  destinationLat: number,
  destinationLng: number
): Promise<TDXRoutePlanResponse> => {
  const originLat = 25.047743;
  const originLng = 121.516273;
  const now = new Date();
  const nowInTaiwan = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const departTime = new Date(nowInTaiwan.getTime() + 1 * 15 * 60 * 1000);
  const arrivalTime = new Date(nowInTaiwan.getTime() + 2 * 60 * 60 * 1000);
  const formatTime = (date: Date) => date.toISOString().split(".")[0];

  const token = await getTDXAccessToken();
  const url = "https://tdx.transportdata.tw/api/maas/routing";

  console.log(`🚏 出發地： 南港路三段 (${originLat}, ${originLng})\n
  🏁 目的地：(${destinationLat}, ${destinationLng})\n\n`);
  const { data } = await axios.get<TDXRoutePlanResponse>(url, {
    params: {
      origin: `${originLat},${originLng}`,
      destination: `${destinationLat},${destinationLng}`,
      gc: 1.0,
      top: 10,
      transit: "5",
      transfer_time: "0,60",
      depart: formatTime(departTime),
      arrival: formatTime(arrivalTime),
      first_mile_mode: 0,
      first_mile_time: 60,
      last_mile_mode: 0,
      last_mile_time: 60,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
