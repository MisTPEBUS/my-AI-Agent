import axios from "axios";

const TDX_AUTH_URL =
  "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

const TDX_CLIENT_ID = process.env.NEXT_PUBLIC_TDX_CLIENT_ID;
const TDX_CLIENT_SECRET = process.env.NEXT_PUBLIC_TDX_CLIENT_SECRET;

let cachedToken: string | null = null;
let tokenExpireTime = 0; // Unix timestamp（秒）

/**
 * 自動快取的 TDX Token 取得
 */

export const getTDXAccessToken = async (): Promise<string> => {
  const now = Math.floor(Date.now() / 1000); // 現在時間 (秒)
  console.log("TDX_CLIENT_ID:", TDX_CLIENT_ID);
  console.log("TDX_CLIENT_SECRET:", TDX_CLIENT_SECRET);
  if (cachedToken && now < tokenExpireTime - 60) {
    // 提前 60 秒過期，確保不會剛好失效
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", TDX_CLIENT_ID as string);
  params.append("client_secret", TDX_CLIENT_SECRET as string);

  try {
    const { data } = await axios.post(TDX_AUTH_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    cachedToken = data.access_token;
    tokenExpireTime = now + data.expires_in; // expires_in 單位是秒

    console.log(" 取得新的 TDX Access Token");
    return cachedToken ?? "";
  } catch (error) {
    console.error("❌ 取得 TDX Token 發生錯誤:", error);
    throw error;
  }
};
