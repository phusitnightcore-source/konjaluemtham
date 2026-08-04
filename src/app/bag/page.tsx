"use client";

// กระเป๋าคำพูด - ดูการ์ดที่เก็บ, ลบ, และ "บันทึกเป็น PDF พกไปด้วย" (spec E MVP)

import Link from "next/link";
import Navbar from "@/components/Navbar";
import MemoryIcon from "@/components/MemoryIcon";
import { useStore } from "@/lib/store";
import { CATEGORY_LABELS } from "@/lib/content";
import { relationshipLabel } from "@/lib/tokens";

export default function BagPage() {
  const { state, dispatch, ready } = useStore();

  if (!ready) return <div className="center-screen">กำลังเปิด…</div>;

  const empty = state.kept.length === 0;

  return (
    <div className="page">
      <Navbar />

      <main
        className="container print-page page-in"
        style={{ flex: 1, paddingTop: "var(--space-3)", paddingBottom: "var(--space-6)" }}
      >
        <div
          className="stack"
          style={{ gap: "var(--space-1)", marginBottom: "var(--space-4)" }}
        >
          <p
            className="eyebrow no-print"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <MemoryIcon size={16} /> กระเป๋าคำพูด
          </p>
          <h1 style={{ fontSize: "var(--text-h2)" }}>
            สิ่งที่อยากพูดกับ{relationshipLabel(state.answers)}
          </h1>
        </div>

        {empty ? (
          <div className="center-screen">
            <p className="muted">ยังไม่ได้เก็บอะไรเลย - เก็บใบเดียวก็พอนะ</p>
            <Link href="/cards" className="btn btn--primary">
              ไปดูคำถาม
            </Link>
          </div>
        ) : (
          <div className="stack" style={{ gap: "var(--space-2)" }}>
            {state.kept.map((k) => {
              const display = k.ownNote?.trim() ? k.ownNote : k.text;
              return (
                <div key={k.id} className="card" style={{ boxShadow: "var(--shadow-sm)" }}>
                  <div className="stack" style={{ gap: 6 }}>
                    <span className="qcard__label">{CATEGORY_LABELS[k.category]}</span>
                    <p style={{ fontSize: "var(--text-body)" }}>{display}</p>
                    {k.ownNote?.trim() && k.text && (
                      <span className="tertiary" style={{ fontSize: "var(--text-small)" }}>
                        เดิม: {k.text}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost no-print"
                    style={{ marginTop: 8, alignSelf: "flex-start", paddingLeft: 0 }}
                    onClick={() => dispatch({ type: "removeKept", payload: k.id })}
                  >
                    เอาออก
                  </button>
                </div>
              );
            })}

            <p className="tertiary no-print" style={{ fontSize: "var(--text-small)", marginTop: "var(--space-2)" }}>
              เอาไปเท่าที่ไหวนะ ไม่ต้องถามครบทุกข้อ ข้อเดียวก็มีค่าแล้ว
            </p>

            <div className="stack no-print" style={{ gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
              <button
                type="button"
                className="btn btn--primary btn--block"
                onClick={() => window.print()}
              >
                บันทึกเป็น PDF พกไปด้วย
              </button>
              <Link href="/meal" className="btn btn--secondary btn--block">
                วางแผนมื้ออาหาร
              </Link>
              <Link href="/memory" className="btn btn--secondary btn--block">
                เก็บเป็นความทรงจำ
              </Link>
              <Link href="/cards" className="btn btn--ghost btn--block">
                กลับไปดูคำถามต่อ
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
