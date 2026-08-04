"use client";

// ส่งต่อให้เพื่อน - Web Share API + fallback คัดลอกลิงก์
// แชร์แค่ตัวเว็บ ไม่ใช่ข้อมูลส่วนตัว

import { useState } from "react";

export default function ShareButton({
  className = "btn btn--secondary",
}: {
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url =
      typeof window !== "undefined" ? window.location.origin : "https://luemtham.app";
    const data = {
      title: "ก่อนจะลืมถาม",
      text: "ถามตอนที่ยังถามได้ - พื้นที่ช่วยเริ่มบทสนทนากับคนที่คุณรัก",
      url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        // ผู้ใช้ยกเลิก - ไม่ต้องทำอะไร
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // คัดลอกไม่ได้
    }
  }

  return (
    <button type="button" className={`${className} no-print`} onClick={share}>
      {copied ? "คัดลอกลิงก์แล้ว 💛" : "ส่งต่อให้เพื่อน"}
    </button>
  );
}
