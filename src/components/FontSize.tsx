"use client";

// ปรับขนาดตัวอักษรทั้งเว็บ (spec C10 - ผู้ใช้ 50+ เปิดโหมดตัวอักษรใหญ่)
// ตั้ง data-textsize ที่ <html> แล้ว CSS override token ตัวอักษร + จำค่าไว้

import { useEffect, useState } from "react";

const KEY = "luemtham.textsize";
type Level = "" | "lg" | "xl";

function readLevel(): Level {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "lg" || v === "xl") return v;
  } catch {
    // ignore
  }
  return "";
}

function applyLevel(l: Level) {
  const root = document.documentElement;
  if (l) root.setAttribute("data-textsize", l);
  else root.removeAttribute("data-textsize");
  try {
    if (l) localStorage.setItem(KEY, l);
    else localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// ใส่ใน layout - apply ค่าที่จำไว้ตอนโหลด
export default function FontSizeApply() {
  useEffect(() => {
    applyLevel(readLevel());
  }, []);
  return null;
}

const LABELS: Record<Level, string> = {
  "": "ปกติ",
  lg: "ใหญ่",
  xl: "ใหญ่มาก",
};

// ปุ่มควบคุม - วางใน header
export function FontSizeControl() {
  const [level, setLevel] = useState<Level>("");

  useEffect(() => {
    setLevel(readLevel());
  }, []);

  function cycle() {
    const next: Level = level === "" ? "lg" : level === "lg" ? "xl" : "";
    setLevel(next);
    applyLevel(next);
  }

  return (
    <button
      type="button"
      className="fontsize-btn no-print"
      onClick={cycle}
      aria-label={`ปรับขนาดตัวอักษร ตอนนี้: ${LABELS[level]}`}
      title="ปรับขนาดตัวอักษร"
    >
      <span style={{ fontSize: 12 }} data-on={level === ""}>
        ก
      </span>
      <span style={{ fontSize: 16 }} data-on={level === "lg"}>
        ก
      </span>
      <span style={{ fontSize: 20 }} data-on={level === "xl"}>
        ก
      </span>
    </button>
  );
}
