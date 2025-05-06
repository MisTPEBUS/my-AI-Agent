"use client";

import { PlaceAutoComplete } from "./componnts/PlaceAutoComplete";

// 確保這個路徑正確

export default function PlaceAutoCompletePage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">地點輸入</h1>
      <PlaceAutoComplete
        onSelect={(id, desc) => {
          console.log(" Selected:", id, desc);
        }}
      />
    </div>
  );
}
