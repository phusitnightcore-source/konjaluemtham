"use client";

// ลงทะเบียน service worker (offline / ติดตั้งลงหน้าจอโฮม)

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }
    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ลงทะเบียนไม่ได้ก็ไม่เป็นไร เว็บยังใช้งานได้ปกติ
      });
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}
