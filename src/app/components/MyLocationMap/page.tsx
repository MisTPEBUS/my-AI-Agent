"use client";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};
const options = {
  disableDefaultUI: true, // 移除所有控制元件
  gestureHandling: "greedy", // 支援滾動與縮放
};

export default function MyLocationMap() {
  const center = { lat: 25.047743, lng: 121.516273 };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GEOCODING_API_KEY!}
      libraries={["places"]}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        options={options}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}
