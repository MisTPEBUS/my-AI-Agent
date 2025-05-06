"use client";

import { useTripLocation } from "@/app/hooks/useTripLocation";
import { useLatLng } from "@/app/stores/useLatLng";

export default function TripPlanner() {
  const { loading, location, error } = useLatLng();
  const { locateUser } = useTripLocation();

  return (
    <div className="space-y-4">
      <button
        onClick={locateUser}
        className="px-4 py-2 rounded bg-primary text-white"
        disabled={loading}
      >
        {loading ? "定位中..." : "🚀 行程規劃（啟用 GPS）"}
      </button>

      {location && (
        <p>
          📍 當前位置：{location.Lat}, {location.Lng}
        </p>
      )}
      {error && <p className="text-red-500">⚠️ {error}</p>}
    </div>
  );
}
