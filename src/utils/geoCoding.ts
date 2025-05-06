import axios from "axios";

const GEOCODING_API_KEY = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;
const GEOCODING_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export const getLatLng = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  try {
    console.log("address :", address);
    const { data } = await axios.get(GEOCODING_URL, {
      params: {
        address,
        key: GEOCODING_API_KEY,
      },
    });
    const result = data.results[0];
    if (result) {
      const { lat, lng } = result.geometry.location;
      return { lat, lng };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
