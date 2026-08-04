"use client";

// ตัวบอก autosave (spec C7/C8) - จางเข้า อยู่ 1.5s จางออก ไม่ใช่ toast

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export default function Autosave() {
  const { savedAt } = useStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (savedAt == null) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, [savedAt]);

  return (
    <div
      aria-live="polite"
      className={`autosave no-print ${show ? "autosave--show" : ""}`}
      style={{ position: "fixed", right: 20, bottom: 16, zIndex: 30 }}
    >
      เก็บไว้ให้แล้ว
    </div>
  );
}
