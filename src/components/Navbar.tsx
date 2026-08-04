"use client";

// Navbar (spec C5) - ชื่อเว็บซ้าย, ปุ่ม "ปิดหน้านี้" ขวา ตลอดเวลา

import Link from "next/link";
import { useRouter } from "next/navigation";
import MemoryIcon from "@/components/MemoryIcon";
import { FontSizeControl } from "@/components/FontSize";

export default function Navbar({ bag }: { bag?: number }) {
  const router = useRouter();

  function closePage() {
    // "ปิดหน้านี้" - พาผู้ใช้กลับหน้าแรกอย่างนุ่มนวล (ของที่บันทึกยังอยู่)
    if (window.history.length > 1) router.back();
    else router.push("/");
  }



  return (
    <nav className="navbar no-print">
      <Link href="/" className="navbar__brand">
        ก่อนจะลืมถาม
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {typeof bag === "number" && (
          <Link href="/bag" className="bag-count" aria-label={`ความทรงจำ ${bag} ใบ`}>
            <MemoryIcon size={17} />
            {bag}
          </Link>
        )}
        <FontSizeControl />
        <button type="button" className="btn btn--ghost" onClick={closePage}>
          ปิดหน้านี้
        </button>
      </div>
    </nav>
  );
}
