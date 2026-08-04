"use client";

// Questionnaire (spec A3 / C6.2) - หนึ่งคำถามต่อหนึ่งหน้าจอ
// ห้าม disable ปุ่มต่อไป (spec C5) · ข้ามได้เสมอ · autosave ทุกครั้งที่เลือก
// Routing: ตอบข้อสภาพ = "เขาจากไปแล้ว" → ไปหน้า Letter ทันที (spec A3)

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import {
  CONDITIONS,
  FEARS,
  RELATIONSHIPS,
  SELF_OPTIONS,
  TIMES,
  fill,
} from "@/lib/tokens";

const TOTAL = 5;

export default function Questionnaire() {
  const router = useRouter();
  const { state, dispatch } = useStore();
  const [step, setStep] = useState(0);
  const a = state.answers;

  function next() {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else router.push("/cards");
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
    else router.push("/");
  }

  const preview = fill("{me}รัก{them}นะ", a);

  return (
    <div className="page">
      <Navbar bag={state.kept.length || undefined} />

      <main
        className="container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          paddingTop: "var(--space-3)",
          paddingBottom: "var(--space-5)",
        }}
      >
        {/* Stepper - จุดกลม ไม่มีตัวเลข/เปอร์เซ็นต์ (spec C5) */}
        <div className="stepper" aria-hidden>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span
              key={i}
              className={`stepper__dot ${
                i === step
                  ? "stepper__dot--active"
                  : i < step
                    ? "stepper__dot--done"
                    : ""
              }`}
            />
          ))}
        </div>

        <div key={step} className="page-in" style={{ flex: 1 }}>
          {step === 0 && (
            <QCard question="เขาเป็นใครสำหรับคุณ">
              <div className="chip-grid">
                {RELATIONSHIPS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="chip"
                    aria-pressed={a.relationship === r.id}
                    onClick={() =>
                      dispatch({ type: "setAnswer", payload: { relationship: r.id } })
                    }
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              {a.relationship === "other" && (
                <input
                  className="input"
                  style={{ marginTop: "var(--space-3)", maxWidth: 320 }}
                  placeholder="คุณเรียกเขาว่าอะไร"
                  value={a.relationshipCustom ?? ""}
                  onChange={(e) =>
                    dispatch({
                      type: "setAnswer",
                      payload: { relationshipCustom: e.target.value },
                    })
                  }
                />
              )}
            </QCard>
          )}

          {step === 1 && (
            <QCard question="คุณอยากแทนตัวเองว่าอะไร">
              <p
                className="tertiary"
                style={{ fontSize: "var(--text-small)", marginBottom: "var(--space-2)" }}
              >
                คำนี้จะถูกใช้ในทุกประโยคที่เราคิดไว้ให้
              </p>
              <div className="chip-grid">
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
                style={{ marginTop: "var(--space-3)", maxWidth: 320, textAlign: "center" }}
                placeholder="หรือพิมพ์เอง เช่น ชื่อเล่นของคุณ"
                value={a.self ?? ""}
                onChange={(e) =>
                  dispatch({ type: "setAnswer", payload: { self: e.target.value } })
                }
              />
              {/* preview สดๆ ให้เห็นว่าปรับทุกประโยคจริง */}
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
            </QCard>
          )}

          {step === 2 && (
            <QCard question="ตอนนี้เขาเป็นอย่างไร">
              <div
                className="chip-grid"
                style={{ flexDirection: "column", alignItems: "stretch", maxWidth: 380 }}
              >
                {CONDITIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="chip"
                    aria-pressed={a.condition === c.id}
                    onClick={() => {
                      dispatch({ type: "setAnswer", payload: { condition: c.id } });
                      // Routing พิเศษ: จากไปแล้ว → Letter
                      if (c.id === "gone") router.push("/letter");
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </QCard>
          )}

          {step === 3 && (
            <QCard question="เวลาที่พอมี">
              <p className="tertiary" style={{ fontSize: "var(--text-small)", marginBottom: "var(--space-2)" }}>
                ไม่ต้องเป๊ะ เลือกความรู้สึกที่ใกล้ที่สุด
              </p>
              <div className="chip-grid">
                {TIMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="chip"
                    aria-pressed={a.time === t.id}
                    onClick={() => dispatch({ type: "setAnswer", payload: { time: t.id } })}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </QCard>
          )}

          {step === 4 && (
            <QCard question="สิ่งที่คุณกลัวที่สุด">
              <div
                className="chip-grid"
                style={{ flexDirection: "column", alignItems: "stretch", maxWidth: 420 }}
              >
                {FEARS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="chip"
                    aria-pressed={a.fear === f.id}
                    onClick={() => dispatch({ type: "setAnswer", payload: { fear: f.id } })}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="tertiary" style={{ fontSize: "var(--text-small)", marginTop: "var(--space-3)" }}>
                ไม่มีคำตอบถูกผิด เลือกที่ใกล้เคียงที่สุดก็พอ
              </p>
            </QCard>
          )}
        </div>

        {/* ปุ่ม - อยู่ครึ่งล่างของจอ (spec C10) */}
        <div className="stack" style={{ gap: "var(--space-1)", alignItems: "center" }}>
          <button type="button" className="btn btn--primary btn--block" style={{ maxWidth: 360 }} onClick={next}>
            {step < TOTAL - 1 ? "ต่อไป" : "ไปดูคำถามที่คิดไว้ให้"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={next}>
            ข้ามข้อนี้
          </button>
          <button type="button" className="btn btn--ghost" onClick={back}>
            ย้อนกลับ
          </button>
        </div>
      </main>
    </div>
  );
}

function QCard({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <div className="qcard">
      <div className="stack" style={{ gap: "var(--space-3)", alignItems: "center", width: "100%" }}>
        <h2 className="qcard__question">{question}</h2>
        {children}
      </div>
    </div>
  );
}
