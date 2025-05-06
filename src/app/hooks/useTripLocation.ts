import { latLngSchema } from "../schemas/LatLngSchema";
import { useLatLng } from "../stores/useLatLng";

export const useTripLocation = () => {
  const { setLoading, setLocation, setError } = useLatLng();

  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("瀏覽器不支援定位功能");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          reject("定位失敗：" + err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 3000,
          maximumAge: 0,
        }
      );
    });
  };

  const locateUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await Promise.race([
        getLocation(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject("定位逾時，請稍後再試"), 3000)
        ),
      ]);

      const validation = latLngSchema.safeParse(result);
      if (!validation.success) {
        throw new Error("位置格式錯誤");
      }

      setLocation({ Lat: result.lat, Lng: result.lng });
    } catch (err: unknown) {
      setError(
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "未知錯誤"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    locateUser,
  };
};
