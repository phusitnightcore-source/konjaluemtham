"use client";

// Meal Planning (spec C6.4) - timeline แนวตั้ง 4 ขั้น + checklist + แผนสำรอง
// "มื้ออาหาร" คือ frame ที่ทำให้เป็นกิจกรรมปกติ ไม่ใช่พิธีอำลา

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomSheet from "@/components/BottomSheet";
import { useStore } from "@/lib/store";
import { CATEGORY_LABELS, PHRASES } from "@/lib/content";
import { backupThree, fill } from "@/lib/tokens";
import type { Stage } from "@/lib/types";

const WHERE = ["ร้านที่เขาชอบ", "ทำกินที่บ้าน", "ข้างเตียง รพ.", "ที่ที่มีความหมาย"];
const WHEN = ["ช่วงเช้า", "ช่วงบ่าย", "ช่วงเย็น"];
const BRING = ["รูปภาพ", "เพลง", "ของโปรด", "น้ำ", "ทิชชู่", "เครื่องอัดเสียง"];

const STAGE_TITLE: Record<Stage, string> = {
  open: "เปิดบทสนทนา",
  light: "คำถามเบา",
  deep: "คำถามสำคัญ",
  close: "ปิดด้วยความอบอุ่น",
};
const STAGE_ORDER: Stage[] = ["open", "light", "deep", "close"];

export default function MealPage() {
  const { state, dispatch, ready } = useStore();
  const [showBackup, setShowBackup] = useState(false);

  if (!ready) return <div className="center-screen">กำลังเปิด…</div>;

  const meal = state.meal;
  const whoNum = parseInt(meal.who, 10);
  const tooMany = !Number.isNaN(whoNum) && whoNum > 4;

  // จัดการ์ดที่เก็บไว้ตามขั้นของบทสนทนา
  const byStage = (stage: Stage) =>
    state.kept.filter((k) => {
      const phrase = STAGE_LOOKUP[k.id];
      return phrase === stage;
    });

  const backup = backupThree(state.answers);

  return (
    <div className="page">
      <Navbar bag={state.kept.length || undefined} />

      <main
        className="container print-page page-in"
        style={{ flex: 1, paddingTop: "var(--space-3)", paddingBottom: "var(--space-6)" }}
      >
        <div className="stack" style={{ gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>
          <p className="eyebrow no-print">วางแผนมื้ออาหาร</p>
          <h1 style={{ fontSize: "var(--text-h2)" }}>ค่อยๆ เตรียมไปด้วยกัน</h1>
        </div>

        {/* ที่ไหน */}
        <Section title="ที่ไหน">
          <div className="chip-grid" style={{ justifyContent: "flex-start" }}>
            {WHERE.map((w) => (
              <button
                key={w}
                type="button"
                className="chip"
                aria-pressed={meal.where === w}
                onClick={() => dispatch({ type: "setMeal", payload: { where: w } })}
              >
                {w}
              </button>
            ))}
          </div>
        </Section>

        {/* ใครบ้าง */}
        <Section title="ใครบ้าง">
          <input
            className="input"
            style={{ maxWidth: 200 }}
            inputMode="numeric"
            placeholder="กี่คน"
            value={meal.who}
            onChange={(e) => dispatch({ type: "setMeal", payload: { who: e.target.value } })}
          />
          {tooMany && (
            <p style={{ color: "var(--color-warning)", fontSize: "var(--text-small)", marginTop: 8 }}>
              เกิน 4 คน บทสนทนามักจะไม่ลึก ลองเริ่มจากวงเล็กๆ ก่อนก็ได้นะ
            </p>
          )}
        </Section>

        {/* เวลาไหน */}
        <Section title="เวลาไหน">
          <p className="tertiary" style={{ fontSize: "var(--text-small)", marginBottom: 8 }}>
            เลือกช่วงที่เขามีแรงที่สุดของวัน (มักเป็นเช้า)
          </p>
          <div className="chip-grid" style={{ justifyContent: "flex-start" }}>
            {WHEN.map((w) => (
              <button
                key={w}
                type="button"
                className="chip"
                aria-pressed={meal.when === w}
                onClick={() => dispatch({ type: "setMeal", payload: { when: w } })}
              >
                {w}
              </button>
            ))}
          </div>
        </Section>

        {/* ลำดับบทสนทนา - timeline */}
        <Section title="ลำดับบทสนทนา">
          <div className="timeline">
            {STAGE_ORDER.map((stage, i) => {
              const cards = byStage(stage);
              return (
                <div className="timeline__row" key={stage}>
                  <div className="timeline__marker">
                    <span className="timeline__num">{i + 1}</span>
                    {i < STAGE_ORDER.length - 1 && <span className="timeline__line" />}
                  </div>
                  <div className="timeline__body">
                    <strong style={{ fontSize: "var(--text-body)" }}>{STAGE_TITLE[stage]}</strong>
                    {cards.length === 0 ? (
                      <p className="tertiary" style={{ fontSize: "var(--text-small)" }}>
                        ยังไม่ได้เก็บการ์ดหมวดนี้
                      </p>
                    ) : (
                      <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                        {cards.map((c) => (
                          <li key={c.id} style={{ fontSize: "var(--text-small)", marginBottom: 4 }}>
                            {c.ownNote?.trim() ? c.ownNote : c.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="tertiary" style={{ fontSize: "var(--text-small)", marginTop: 8 }}>
            ปิดด้วยความอบอุ่นเสมอ - ห้ามจบด้วยเรื่องหนัก
          </p>
        </Section>

        {/* ของที่ควรพก */}
        <Section title="ของที่ควรพก">
          <div className="stack">
            {BRING.map((b) => (
              <label key={b} className="check">
                <input
                  type="checkbox"
                  checked={meal.bring.includes(b)}
                  onChange={() => dispatch({ type: "toggleBring", payload: b })}
                />
                <span className="check__box" aria-hidden>
                  {meal.bring.includes(b) ? "✓" : ""}
                </span>
                {b}
              </label>
            ))}
          </div>
        </Section>

        {/* แผนสำรอง */}
        <div
          className="card no-print"
          style={{ background: "var(--color-primary-soft)", border: "1px solid var(--color-primary)" }}
        >
          <strong style={{ fontSize: "var(--text-body)" }}>ถ้าเขาเหนื่อย</strong>
          <p className="muted" style={{ fontSize: "var(--text-small)", margin: "6px 0 var(--space-2)" }}>
            เหลือแค่ 3 คำถามพอ เราเลือกไว้ให้แล้ว
          </p>
          <button type="button" className="btn btn--secondary" onClick={() => setShowBackup(true)}>
            ดู 3 ข้อนั้น
          </button>
        </div>

        <div className="stack no-print" style={{ gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
          <button type="button" className="btn btn--primary btn--block" onClick={() => window.print()}>
            บันทึกเป็น PDF พกไปด้วย
          </button>
          <Link href="/bag" className="btn btn--ghost btn--block">
            กลับไปที่กระเป๋าคำพูด
          </Link>
        </div>
      </main>

      <BottomSheet open={showBackup} onClose={() => setShowBackup(false)} title="ถ้าเขาเหนื่อย - 3 ข้อนี้พอ">
        <div className="stack" style={{ gap: "var(--space-2)" }}>
          {backup.map((p) => (
            <div key={p.id} className="card" style={{ boxShadow: "none", padding: "var(--space-2) var(--space-3)" }}>
              <span className="qcard__label">{CATEGORY_LABELS[p.category]}</span>
              <p style={{ fontSize: "var(--text-body)", marginTop: 4 }}>{fill(p.text, state.answers)}</p>
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "var(--space-4)" }}>
      <h3 style={{ fontSize: "var(--text-h3)", marginBottom: "var(--space-2)" }}>{title}</h3>
      {children}
    </section>
  );
}

// map phraseId -> stage (สำหรับจัดกลุ่มการ์ดใน timeline)
const STAGE_LOOKUP: Record<string, Stage> = Object.fromEntries(
  PHRASES.map((p) => [p.id, p.stage]),
);
