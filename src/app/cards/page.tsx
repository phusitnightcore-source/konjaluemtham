"use client";

// Conversation Cards ⭐ หัวใจ (spec C6.3)
// การ์ดใบเดียวเต็มจอ · เก็บ / ข้าม / เขียนเอง / ซ้อมพูด
// ไม่มีตัวนับ "ใบที่ 5 จาก 40" - มีแค่จำนวนในกระเป๋า
// มีอนิเมชั่นสไลด์ออก/เข้า + การ์ดซ้อนข้างหลัง

import { Suspense, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import BottomSheet from "@/components/BottomSheet";
import { useStore } from "@/lib/store";
import { CATEGORY_LABELS, PHRASES } from "@/lib/content";
import { buildDeck, fill } from "@/lib/tokens";
import type { Answers, Category, Phrase } from "@/lib/types";

// ดอกไม้ประจำหมวด (มุมขวาล่างของการ์ด)
const CATEGORY_FLOWER: Record<Category, string> = {
  opener: "f1", // คอสมอสชมพู
  memory: "f16", // ไฮเดรนเยีย
  person: "f11", // กุหลาบ
  thanks: "f5", // โบตั๋นครีม
  apology: "f15", // ลิลลี่
  love: "f9", // คาร์เนชัน
  worries: "f4", // ป๊อปปี้พีช
  practical: "f6", // ทิวลิป
  light: "f2", // คอสมอสครีม
  oneway: "f15", // ลิลลี่
  recovery: "f13", // ช่อเบอร์รี่
  closing: "f7", // โบตั๋น
};

function CardInner({ phrase, answers }: { phrase: Phrase; answers: Answers }) {
  const flower = CATEGORY_FLOWER[phrase.category] ?? "f1";
  return (
    <>
      <span className="qcard__quote qcard__quote--open" aria-hidden>
        &ldquo;
      </span>
      <div className="qcard__content">
        <span className="qcard__label">{CATEGORY_LABELS[phrase.category]}</span>
        <p className="qcard__question">{fill(phrase.text, answers)}</p>
        {phrase.note && <span className="qcard__sub">{phrase.note}</span>}
      </div>
      <span className="qcard__quote qcard__quote--close" aria-hidden>
        &rdquo;
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="qcard__flower" src={`/flower/${flower}.png`} alt="" aria-hidden />
    </>
  );
}

type Dir = "left" | "right" | "up";
const EXIT_MS = 340;

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="center-screen">กำลังเปิด…</div>}>
      <Cards />
    </Suspense>
  );
}

function Cards() {
  const params = useSearchParams();
  const preview = params.get("preview") === "1";
  const { state, dispatch, ready } = useStore();

  const deck = useMemo(() => buildDeck(state.answers), [state.answers]);

  // preview: ใช้สถานะชั่วคราว ไม่เขียนลงกระเป๋าจริง
  const [previewSeen, setPreviewSeen] = useState<string[]>([]);
  const seen = preview ? previewSeen : state.seen;

  const remaining = deck.filter((p) => !seen.includes(p.id));
  const current = remaining[0];
  const behind = remaining[1];

  // sheet states
  const [ownFor, setOwnFor] = useState<Phrase | null>(null);
  const [rehearseFor, setRehearseFor] = useState<Phrase | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);

  // อนิเมชั่นออก
  const [anim, setAnim] = useState<{ id: string; dir: Dir } | null>(null);
  const busy = anim !== null;

  // swipe
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);

  const nonverbal = state.answers.condition === "nonverbal";

  function commitSeen(id: string) {
    if (preview) setPreviewSeen((s) => [...s, id]);
    else dispatch({ type: "skipCard", payload: id });
  }
  function commitKeep(p: Phrase) {
    if (preview) {
      setPreviewSeen((s) => [...s, p.id]);
      return;
    }
    dispatch({
      type: "keepCard",
      payload: { id: p.id, text: fill(p.text, state.answers), category: p.category },
    });
  }

  // สั่งอนิเมชั่นออก แล้วค่อย commit เมื่ออนิเมชั่นจบ
  function exitThen(dir: Dir, action: () => void) {
    if (!current || busy) return;
    setAnim({ id: current.id, dir });
    window.setTimeout(() => {
      action();
      setAnim(null);
      setDragX(0);
    }, EXIT_MS);
  }
  const doKeep = () => current && exitThen("right", () => commitKeep(current));
  const doSkip = () => current && exitThen("left", () => commitSeen(current.id));

  function onPointerDown(e: React.PointerEvent) {
    if (busy) return;
    startX.current = e.clientX;
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startX.current == null || busy) return;
    setDragX(e.clientX - startX.current);
  }
  function onPointerUp() {
    if (startX.current == null) return;
    const dx = dragX;
    startX.current = null;
    if (!current || busy) {
      setDragX(0);
      return;
    }
    if (dx > 90) doKeep();
    else if (dx < -90) doSkip();
    else setDragX(0); // ไม่ถึงเกณฑ์ - ดีดกลับ
  }

  function resetDeck() {
    if (preview) setPreviewSeen([]);
    else dispatch({ type: "hydrate", payload: { ...state, seen: [] } });
  }

  if (!ready) return <div className="center-screen">กำลังเปิด…</div>;

  const animClass =
    anim && current && anim.id === current.id ? `card-out-${anim.dir}` : "card-in";

  return (
    <div className="page">
      <Navbar bag={preview ? undefined : state.kept.length} />

      <main
        className="container"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "var(--space-3)",
          paddingBottom: "var(--space-5)",
        }}
      >
        {preview && (
          <p className="tertiary" style={{ textAlign: "center", fontSize: "var(--text-small)" }}>
            โหมดตัวอย่าง - ดูได้ตามสบาย เริ่มจริงเมื่อไหร่ค่อยเก็บ
          </p>
        )}

        {nonverbal && current && (
          <div
            className="card"
            style={{
              background: "var(--color-primary-soft)",
              padding: "var(--space-2) var(--space-3)",
              boxShadow: "none",
            }}
          >
            <p style={{ fontSize: "var(--text-small)" }}>
              การได้ยินเป็นประสาทสัมผัสสุดท้ายที่หายไป - เขาได้ยินคุณอยู่นะ
            </p>
          </div>
        )}

        {current ? (
          <>
            <div className="card-stack" style={{ minHeight: 380 }}>
              {/* การ์ดที่ซ้อนอยู่ข้างหลัง */}
              {behind && (
                <div className="qcard card-behind" aria-hidden>
                  <CardInner phrase={behind} answers={state.answers} />
                </div>
              )}

              {/* การ์ดใบหน้า */}
              <div
                key={current.id}
                className={`qcard card-front ${animClass}`}
                role="group"
                aria-live="polite"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{
                  transform: dragX ? `translateX(${dragX}px) rotate(${dragX * 0.02}deg)` : undefined,
                  transition:
                    startX.current == null && !busy ? "transform 250ms var(--ease)" : "none",
                  touchAction: "pan-y",
                  cursor: busy ? "default" : "grab",
                }}
              >
                <CardInner phrase={current} answers={state.answers} />
              </div>
            </div>

            {/* ปุ่มสำรองเสมอ (spec C9: swipe ต้องมีปุ่มทางเลือก) */}
            <div className="stack" style={{ gap: "var(--space-2)", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", gap: "var(--space-2)", width: "100%", maxWidth: 420 }}>
                <button
                  type="button"
                  className="btn btn--secondary"
                  style={{ flex: 1 }}
                  onClick={doSkip}
                  disabled={busy}
                >
                  ข้าม
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  style={{ flex: 1 }}
                  onClick={doKeep}
                  disabled={busy}
                >
                  เก็บไว้
                </button>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button type="button" className="btn btn--ghost" onClick={() => setOwnFor(current)}>
                  เขียนเอง
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setRehearseFor(current)}>
                  ซ้อมพูด
                </button>
              </div>
            </div>
          </>
        ) : (
          // เมื่อการ์ดหมด - ไม่มีคำว่า "จบแล้ว"
          <div className="center-screen page-in" style={{ gap: "var(--space-3)" }}>
            <h2>เอาไปเท่าที่ไหวนะ</h2>
            <p className="muted">ไม่ต้องถามครบทุกข้อ ข้อเดียวก็มีค่าแล้ว</p>
            <div className="stack" style={{ gap: "var(--space-2)", width: "100%", maxWidth: 320 }}>
              {!preview && (
                <Link href="/bag" className="btn btn--primary btn--block">
                  ดูการ์ดในกระเป๋า
                </Link>
              )}
              <button type="button" className="btn btn--secondary btn--block" onClick={resetDeck}>
                ขอเพิ่มอีก
              </button>
              {preview && (
                <Link href="/questions" className="btn btn--primary btn--block">
                  เริ่มจริง
                </Link>
              )}
            </div>
          </div>
        )}

        {current && (
          <button
            type="button"
            className="btn btn--ghost"
            style={{ alignSelf: "center" }}
            onClick={() => setShowRecovery(true)}
          >
            ถ้าบทสนทนาไปผิดทาง
          </button>
        )}
      </main>

      {/* เขียนเอง */}
      <BottomSheet open={ownFor !== null} onClose={() => setOwnFor(null)} title="เขียนเป็นคำของคุณเอง">
        {ownFor && (
          <OwnEditor
            phrase={ownFor}
            initial={state.kept.find((k) => k.id === ownFor.id)?.ownNote ?? ""}
            onSave={(text) => {
              if (!preview) {
                dispatch({
                  type: "setOwnNote",
                  payload: { id: ownFor.id, text, category: ownFor.category },
                });
              }
              setOwnFor(null);
            }}
          />
        )}
      </BottomSheet>

      {/* ซ้อมพูด */}
      <BottomSheet open={rehearseFor !== null} onClose={() => setRehearseFor(null)} title="ซ้อมพูด">
        {rehearseFor && <Rehearse text={fill(rehearseFor.text, state.answers)} />}
      </BottomSheet>

      {/* กู้สถานการณ์ (spec B11) */}
      <BottomSheet open={showRecovery} onClose={() => setShowRecovery(false)} title="ประโยคกู้สถานการณ์">
        <div className="stack" style={{ gap: "var(--space-2)" }}>
          {PHRASES.filter((p) => p.category === "recovery").map((p) => (
            <div key={p.id} className="card" style={{ boxShadow: "none", padding: "var(--space-2) var(--space-3)" }}>
              <p style={{ fontSize: "var(--text-body)" }}>{fill(p.text, state.answers)}</p>
              {p.note && (
                <span className="tertiary" style={{ fontSize: "var(--text-small)" }}>
                  {p.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

function OwnEditor({
  phrase,
  initial,
  onSave,
}: {
  phrase: Phrase;
  initial: string;
  onSave: (text: string) => void;
}) {
  const [text, setText] = useState(initial);
  return (
    <div className="stack" style={{ gap: "var(--space-3)" }}>
      <p className="muted" style={{ fontSize: "var(--text-small)" }}>
        {CATEGORY_LABELS[phrase.category]}
      </p>
      <textarea
        className="textarea"
        placeholder="เขียนแบบที่คุณอยากพูดจริงๆ…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <button type="button" className="btn btn--primary btn--block" onClick={() => onSave(text)}>
        เก็บไว้ให้แล้ว
      </button>
    </div>
  );
}

// ซ้อมพูด - textarea + อัดเสียง (เก็บในเครื่อง, spec C6.3)
function Rehearse({ text }: { text: string }) {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (recording) {
      recRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        setUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
      setError(null);
    } catch {
      setError("เปิดไมโครโฟนไม่ได้ ลองซ้อมพูดในใจก่อนก็ได้นะ");
    }
  }

  return (
    <div className="stack" style={{ gap: "var(--space-3)", alignItems: "center" }}>
      <p style={{ fontSize: 22, lineHeight: 1.6, textAlign: "center" }}>{text}</p>
      <p className="tertiary" style={{ fontSize: "var(--text-small)", textAlign: "center" }}>
        ลองพูดออกเสียงดู เสียงเก็บไว้ในเครื่องคุณเท่านั้น เราไม่เห็น
      </p>
      <button type="button" className={recording ? "btn btn--danger" : "btn btn--secondary"} onClick={toggle}>
        {recording ? "หยุดอัด" : "อัดเสียงซ้อม"}
      </button>
      {error && <p style={{ color: "var(--color-error)", fontSize: "var(--text-small)" }}>{error}</p>}
      {url && <audio controls src={url} style={{ width: "100%" }} />}
    </div>
  );
}
