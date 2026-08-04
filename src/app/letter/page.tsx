"use client";

// Letter (spec C6.6, B12) - เส้นทางคนที่สายไปแล้ว
// Editor เรียบ ไม่มี toolbar · autosave (แสดงจางๆ) · word count เฉพาะเมื่อเกิน 4,500

import { useMemo, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { LETTER_PROMPTS } from "@/lib/content";

const LIMIT = 5000;

export default function LetterPage() {
  const { state, dispatch, ready } = useStore();
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const words = useMemo(
    () => (state.letter.trim() ? state.letter.trim().split(/\s+/).length : 0),
    [state.letter],
  );

  if (!ready) return <div className="center-screen">กำลังเปิด…</div>;

  function insertPrompt(prompt: string) {
    const el = ref.current;
    const base = state.letter;
    const sep = base && !base.endsWith("\n") ? "\n\n" : "";
    const next = `${base}${sep}${prompt}\n`;
    dispatch({ type: "setLetter", payload: next });
    // โฟกัสกลับไปที่ท้ายข้อความ
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(next.length, next.length);
    });
  }

  return (
    <div className="page">
      <Navbar bag={state.kept.length || undefined} />

      <main
        className="container print-page page-in"
        style={{ flex: 1, paddingTop: "var(--space-3)", paddingBottom: "var(--space-6)" }}
      >
        <div className="stack" style={{ gap: "var(--space-1)", marginBottom: "var(--space-3)" }}>
          <h1 style={{ fontSize: "var(--text-h2)" }}>ถ้าไม่ทันได้พูด - เขียนไว้ตรงนี้ก็ได้</h1>
          <p className="muted" style={{ fontSize: "var(--text-body)" }}>
            การไม่ได้พูด ไม่ได้แปลว่าเขาไม่รู้
          </p>
          <p className="muted" style={{ fontSize: "var(--text-body)" }}>
            คนที่รักกันมานาน มักรู้กันอยู่แล้ว แม้ไม่มีใครพูดออกมา
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "var(--space-3)",
            gridTemplateColumns: "1fr",
          }}
        >
          {/* prompt แถบ - คลิกแล้วแทรก */}
          <div className="no-print" style={{ order: 2 }}>
            <p className="tertiary" style={{ fontSize: "var(--text-small)", marginBottom: 8 }}>
              เริ่มไม่ถูก? แตะเพื่อแทรกประโยคเริ่มต้น
            </p>
            <div className="chip-grid" style={{ justifyContent: "flex-start" }}>
              {LETTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="chip"
                  style={{ minHeight: 40 }}
                  onClick={() => insertPrompt(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <textarea
            ref={ref}
            className="textarea"
            style={{ minHeight: 320, order: 1, fontSize: 18 }}
            placeholder="สิ่งที่อยากบอกคือ…"
            maxLength={LIMIT + 200}
            value={state.letter}
            onChange={(e) => dispatch({ type: "setLetter", payload: e.target.value })}
          />

          {words > 4500 && (
            <p
              className="tertiary no-print"
              style={{ order: 3, fontSize: "var(--text-small)", textAlign: "right" }}
            >
              {words.toLocaleString("th-TH")} คำ (สูงสุดราว {LIMIT.toLocaleString("th-TH")})
            </p>
          )}
        </div>

        <div className="stack no-print" style={{ gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => window.print()}
            disabled={!state.letter.trim()}
          >
            บันทึกจดหมายเป็น PDF
          </button>
          <Link href="/resources" className="btn btn--secondary btn--block">
            แหล่งช่วยเหลือ
          </Link>
          <Link href="/" className="btn btn--ghost btn--block">
            กลับหน้าแรก
          </Link>
        </div>
      </main>
    </div>
  );
}
