// 單一路線中的每一段（步行 / 搭車 / 等待）
export interface TDXRouteSection {
  type: "pedestrian" | "pedestrian-station" | "transit" | "waiting";
  actions: {
    action: "depart" | "arrive";
    duration: number;
  }[];
  travelSummary: {
    duration: number; // 秒數
    length: number; // 公尺，可能 0（如果是等車）
  };
  departure: {
    time: string;
    place: {
      name?: string;
      type: string;
      location: {
        lat: number;
        lng: number;
      };
    };
  };
  arrival: {
    time: string;
    place: {
      name?: string;
      type: string;
      location: {
        lat: number;
        lng: number;
      };
    };
  };
  transport?: {
    mode:
      | "Bus"
      | "HighwayBus"
      | "Metro"
      | "Train"
      | "Ferry"
      | "pedestrian"
      | "waiting"
      | string;
    name?: string;
    category?: string;
    headsign?: string;
    shortName?: string;
    longName?: string;
    fare?: number;
  };
  agency?: {
    agency_id: string;
    name: string;
    website?: string;
    phone?: string;
  };
  intermediateStops?: {
    departure: {
      time: string;
      place: {
        name: string;
        type: string;
        location: {
          lat: number;
          lng: number;
        };
      };
    };
  }[];
}

// 路線方案
export interface TDXRoute {
  travel_time: number;
  start_time: string;
  end_time: string;
  day: number;
  transfers: number;
  total_price: number;
  sections: TDXRouteSection[];
}

// 整體 API 回傳
export interface TDXRoutePlanResponse {
  result: "success" | "fail";
  data?: {
    routes: TDXRoute[];
  };
  error?: {
    code: number;
    msg: string;
  };
}
