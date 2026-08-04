"use client";

// Resources (spec C6.7) - การ์ดมีภาพปกดอกไม้ + สายด่วนเด่น
// + ปุ่ม "ลบทุกอย่างในเครื่อง" (spec C11)

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomSheet from "@/components/BottomSheet";
import FlowerDeco from "@/components/FlowerDeco";
import { useStore } from "@/lib/store";

export default function ResourcesPage() {
  const { dispatch } = useStore();
  const [confirm, setConfirm] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="page">
      <div className="bg-decor" aria-hidden>
        <span className="orb orb--1" />
        <span className="orb orb--2" />
      </div>
      <Navbar />

      <main
        className="container page-in"
        style={{ flex: 1, paddingTop: "var(--space-3)", paddingBottom: "var(--space-6)" }}
      >
        {/* หัวเรื่อง */}
        <div
          className="stack"
          style={{ gap: "var(--space-1)", marginBottom: "var(--space-4)", textAlign: "center", alignItems: "center" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/flower/f14.png"
            alt=""
            aria-hidden
            style={{ height: 96, width: "auto", filter: "drop-shadow(0 10px 20px rgba(107,76,54,.16))" }}
          />
          <p className="eyebrow" style={{ marginTop: 8 }}>แหล่งช่วยเหลือ</p>
          <h1 style={{ fontSize: "var(--text-h2)" }}>ไม่ได้อยู่คนเดียวนะ</h1>
          <p className="muted" style={{ fontSize: "var(--text-body)", maxWidth: 460 }}>
            เมื่อไหร่ที่หนักเกินจะแบกคนเดียว มีคนและเครื่องมือที่พร้อมอยู่ข้างคุณ
          </p>
        </div>

        {/* สายด่วน - เด่นที่สุด */}
        <div className="hotline-card" style={{ marginBottom: "var(--space-3)" }}>
          <FlowerDeco name="f3" size={96} style={{ top: -10, right: -8, opacity: 0.9 }} />
          <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
            <span className="hotline-card__icon" aria-hidden>
              <PhoneIcon />
            </span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: "var(--text-h3)" }}>สายด่วนสุขภาพจิต 1323</h3>
              <p className="muted" style={{ fontSize: "var(--text-small)", marginTop: 4 }}>
                อยากระบายหรือแค่อยากมีใครสักคนรับฟัง โทรได้ตลอด 24 ชั่วโมง ฟรี
              </p>
            </div>
            <a href="tel:1323" className="btn btn--primary">
              <PhoneIcon size={18} />
              โทร 1323
            </a>
          </div>
        </div>

        {/* Living Will - featured มีภาพปก */}
        <div className="res-featured" style={{ marginBottom: "var(--space-3)" }}>
          <div
            className="res-featured__cover"
            style={{ background: "linear-gradient(160deg, var(--color-keepsake-soft), #eef2ea)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/flower/f15.png" alt="" aria-hidden />
          </div>
          <div className="res-featured__body">
            <h3 style={{ fontSize: "var(--text-h3)" }}>หนังสือแสดงเจตนาฯ (Living Will)</h3>
            <p className="muted" style={{ fontSize: "var(--text-small)", margin: "8px 0 var(--space-2)" }}>
              เอกสารที่ให้เขา “เขียนบอกล่วงหน้า” ว่าถ้าถึงช่วงท้ายที่พูดเองไม่ได้แล้ว
              อยากได้รับการดูแลแบบไหน เป็นสิทธิ์ตามกฎหมาย (ม.12 พ.ร.บ.สุขภาพแห่งชาติ 2550)
              ช่วยให้เขายังเป็นคนตัดสินใจเรื่องของตัวเอง และคนข้างหลังไม่ต้องแบกไว้คนเดียว
            </p>
            <ul style={{ margin: "0 0 var(--space-3)", paddingLeft: 20 }}>
              {[
                "เขียนได้ตอนที่ยังรู้สึกตัวดี ไม่จำเป็นต้องป่วยหนัก",
                "ระบุคนที่ไว้ใจให้ช่วยตัดสินใจแทนได้",
                "แก้ไขหรือยกเลิกเมื่อไหร่ก็ได้",
              ].map((t) => (
                <li key={t} style={{ fontSize: "var(--text-small)", marginBottom: 6, color: "var(--color-text-secondary)" }}>
                  {t}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
              <a href="https://www.thailivingwill.in.th/" target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                อ่านแบบละเอียด <ExtIcon />
              </a>
              <a href="https://www.thailivingwill.in.th/content/6486/download" target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                ดาวน์โหลดแบบฟอร์ม
              </a>
            </div>
          </div>
        </div>

        {/* การ์ดแหล่งช่วยเหลือ - เต็มกว้างแนวนอน เรียงต่อกันยาว */}
        <div className="stack" style={{ gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
          {RESOURCES.map((r) => (
            <div className="res-featured" key={r.title}>
              <div className="res-featured__cover" style={{ background: r.tint }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/flower/${r.flower}.png`} alt="" aria-hidden />
              </div>
              <div className="res-featured__body">
                <h3 style={{ fontSize: "var(--text-h3)" }}>{r.title}</h3>
                <p className="muted" style={{ fontSize: "var(--text-small)", margin: "8px 0 var(--space-3)" }}>
                  {r.desc}
                </p>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="btn btn--secondary">
                  ไปที่เว็บไซต์ <ExtIcon />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="card" style={{ boxShadow: "var(--shadow-soft)" }}>
          <h3 style={{ fontSize: "var(--text-h3)", marginBottom: "var(--space-2)" }}>คำถามที่พบบ่อย</h3>
          {FAQ.map((f, i) => (
            <div key={i} style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-border)" }}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "14px 0",
                  fontSize: "var(--text-body)",
                  fontFamily: "inherit",
                  color: "var(--color-text)",
                  cursor: "pointer",
                }}
              >
                {f.q}
                <span
                  aria-hidden
                  style={{
                    color: "var(--color-primary)",
                    transition: "transform var(--dur-fast) var(--ease)",
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                    fontSize: 22,
                    lineHeight: 1,
                  }}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <p className="muted" style={{ fontSize: "var(--text-small)", paddingBottom: 14 }}>
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ลบข้อมูล (spec C11) */}
        <div className="stack" style={{ gap: "var(--space-2)", marginTop: "var(--space-5)" }}>
          <button type="button" className="btn btn--danger btn--block" onClick={() => setConfirm(true)}>
            ลบทุกอย่างในเครื่อง
          </button>
          <Link href="/" className="btn btn--ghost btn--block">
            กลับหน้าแรก
          </Link>
        </div>
      </main>

      <BottomSheet open={confirm} onClose={() => setConfirm(false)} title="ลบทุกอย่างในเครื่อง?">
        <div className="stack" style={{ gap: "var(--space-3)" }}>
          <p className="muted">
            คำตอบ การ์ดในกระเป๋า จดหมาย และทุกอย่างจะถูกลบออกจากอุปกรณ์นี้ - กู้คืนไม่ได้นะ
          </p>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <button type="button" className="btn btn--secondary" style={{ flex: 1 }} onClick={() => setConfirm(false)}>
              ไม่ลบแล้ว
            </button>
            <button
              type="button"
              className="btn btn--danger"
              style={{ flex: 1 }}
              onClick={() => {
                dispatch({ type: "resetAll" });
                try {
                  localStorage.removeItem("luemtham.v1");
                } catch {}
                setConfirm(false);
              }}
            >
              ลบเลย
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function PhoneIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5c0-.6.4-1 1-1h2.5c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.3 1L7.6 10.6a12 12 0 0 0 5.8 5.8l1.8-1.4c.3-.2.7-.3 1-.2l3 .8c.5.1.8.5.8 1V19c0 .6-.4 1-1 1A15 15 0 0 1 4 5z" />
    </svg>
  );
}
function ExtIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}>
      <path d="M14 5h5v5M19 5l-8 8M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

const RESOURCES = [
  {
    title: "Peaceful Death",
    desc: "สมุดเบาใจ · ไพ่ไขชีวิต · การ์ดแชร์กัน - เครื่องมือช่วยเปิดบทสนทนาเรื่องช่วงท้ายของชีวิต",
    href: "https://www.peacefuldeath.co/",
    flower: "f10",
    tint: "linear-gradient(160deg, var(--color-primary-soft), #f7ece2)",
  },
  {
    title: "ชีวามิตร",
    desc: "ความรู้และการดูแลแบบประคับประคอง (palliative care) เพื่อคุณภาพชีวิตช่วงท้าย",
    href: "https://cheevamitr.com/",
    flower: "f5",
    tint: "linear-gradient(160deg, var(--color-keepsake-soft), #eef2ea)",
  },
];

const FAQ = [
  {
    q: "ข้อมูลของฉันปลอดภัยไหม",
    a: "ทุกอย่างเก็บอยู่ในเบราว์เซอร์ของอุปกรณ์นี้เท่านั้น ไม่มีการส่งขึ้นเซิร์ฟเวอร์ ไม่มีใครเห็นสิ่งที่คุณเขียน",
  },
  {
    q: "ถ้าปิดหน้าไป ของที่ทำไว้จะหายไหม",
    a: "ไม่หายนะ ทุกอย่างถูกเก็บไว้อัตโนมัติ กลับมาเมื่อไหร่ก็อยู่ครบ (ตราบใดที่ไม่ล้างข้อมูลเบราว์เซอร์)",
  },
  {
    q: "ต้องถามให้ครบทุกข้อไหม",
    a: "ไม่เลย เอาไปเท่าที่ไหว ข้อเดียวก็มีค่าแล้ว ไม่มีอะไรต้องทำให้จบ",
  },
  {
    q: "ถ้าเขายังไม่อยากคุยล่ะ",
    a: "ไม่เป็นไรเลย อย่ากดดัน อย่าถามซ้ำในวันเดียวกัน แค่ไปนั่งด้วยกันก็มีความหมายแล้ว",
  },
];
