// pages/close.tsx
import { useEffect } from "react";
import liff from "@line/liff";

const ClosePage = () => {
  useEffect(() => {
    // 可以設定延遲以便顯示訊息，例如「操作完成，視窗將自動關閉」
    liff.closeWindow();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>操作完成</h2>
      <p>視窗將在短暫延遲後自動關閉...</p>
    </div>
  );
};

export default ClosePage;
