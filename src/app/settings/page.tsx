"use client";

// ตั้งค่า - แก้ความสัมพันธ์/คำแทนตัว, เริ่มแบบสอบถามใหม่, ลบข้อมูลในเครื่อง

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomSheet from "@/components/BottomSheet";
import { useStore } from "@/lib/store";
import { RELATIONSHIPS, SELF_OPTIONS, fill } from "@/lib/tokens";

export default function SettingsPage() {
  const { state, dispatch, ready } = useStore();
  const [confirm, setConfirm] = useState(false);

  if (!ready) return <div className="center-screen">กำลังเปิด…</div>;
  const a = state.answers;
  const preview = fill("{me}รัก{them}นะ", a);

  return (
    <div className="page">
      <Navbar bag={state.kept.length || undefined} />

      <main
        className="container page-in"
        style={{ flex: 1, paddingTop: "var(--space-3)", paddingBottom: "var(--space-6)" }}
      >
        <div className="stack" style={{ gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>
          <p className="eyebrow">ตั้งค่า</p>
          <h1 style={{ fontSize: "var(--text-h2)" }}>ปรับให้เข้ากับคุณ</h1>
        </div>

        {/* ความสัมพันธ์ */}
        <section style={{ marginBottom: "var(--space-5)" }}>
          <h3 style={{ fontSize: "var(--text-h3)", marginBottom: "var(--space-2)" }}>
            คุณกำลังคุยกับใคร
          </h3>
          <div className="chip-grid" style={{ justifyContent: "flex-start" }}>
            {RELATIONSHIPS.map((r) => (
              <button
                key={r.id}
                type="button"
                className="chip"
                aria-pressed={a.relationship === r.id}
                onClick={() => dispatch({ type: "setAnswer", payload: { relationship: r.id } })}
              >
                {r.label}
              </button>
            ))}
          </div>
          {a.relationship === "other" && (
            <input
              className="input"
              style={{ marginTop: "var(--space-2)", maxWidth: 320 }}
              placeholder="คุณเรียกเขาว่าอะไร"
              value={a.relationshipCustom ?? ""}
              onChange={(e) =>
                dispatch({ type: "setAnswer", payload: { relationshipCustom: e.target.value } })
              }
            />
          )}
        </section>

        {/* คำแทนตัวเอง */}
        <section style={{ marginBottom: "var(--space-4)" }}>
          <h3 style={{ fontSize: "var(--text-h3)", marginBottom: "var(--space-2)" }}>
            คุณแทนตัวเองว่าอะไร
          </h3>
          <div className="chip-grid" style={{ justifyContent: "flex-start" }}>
            {SELF_OPTIONS.map((w) => (
              <button
                key={w}
                type="button"
                className="chip"
                aria-pressed={a.self === w}
                onClick={() => dispatch({ type: "setAnswer", payload: { self: w } })}
              >
                {w}
              </button>
            ))}
          </div>
          <input
            className="input"
            style={{ marginTop: "var(--space-2)", maxWidth: 320 }}
            placeholder="หรือพิมพ์เอง เช่น ชื่อเล่นของคุณ"
            value={a.self ?? ""}
            onChange={(e) => dispatch({ type: "setAnswer", payload: { self: e.target.value } })}
          />
          <div
            className="card"
            style={{
              marginTop: "var(--space-3)",
              padding: "var(--space-2) var(--space-3)",
              background: "var(--color-primary-soft)",
              boxShadow: "none",
            }}
          >
            <span className="tertiary" style={{ fontSize: "var(--text-small)" }}>
              ตัวอย่าง
            </span>
            <p style={{ fontSize: "var(--text-body)", marginTop: 2 }}>“{preview}”</p>
          </div>
        </section>

        <div className="stack" style={{ gap: "var(--space-2)" }}>
          <Link href="/questions" className="btn btn--secondary btn--block">
            เริ่มแบบสอบถามใหม่ทั้งหมด
          </Link>
          <Link href="/cards" className="btn btn--ghost btn--block">
            กลับไปดูคำถาม
          </Link>
        </div>

        {/* ลบข้อมูล (spec C11) */}
        <div style={{ marginTop: "var(--space-6)" }}>
          <hr className="divider" style={{ marginBottom: "var(--space-3)" }} />
          <p className="muted" style={{ fontSize: "var(--text-small)", marginBottom: "var(--space-2)" }}>
            ทุกอย่างเก็บอยู่ในเครื่องนี้เท่านั้น หากต้องการเริ่มใหม่หมด
          </p>
          <button type="button" className="btn btn--danger btn--block" onClick={() => setConfirm(true)}>
            ลบทุกอย่างในเครื่อง
          </button>
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
