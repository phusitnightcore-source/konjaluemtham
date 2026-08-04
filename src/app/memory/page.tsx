"use client";

// Memory (spec C6.5) - อัดเสียง/พิมพ์คำตอบ, preview เหมือนหนังสือ, export PDF/เสียง/ZIP
// "เก็บไว้ในเครื่องคุณเท่านั้น เราไม่เห็น ไม่มีใครเห็น"

import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useStore } from "@/lib/store";
import { relationshipLabel } from "@/lib/tokens";
import { makeZip, type ZipEntry } from "@/lib/zip";

interface Clip {
  blob: Blob;
  url: string;
  at: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function MemoryPage() {
  const { state, dispatch, ready } = useStore();
  const [clips, setClips] = useState<Clip[]>([]);

  if (!ready) return <div className="center-screen">กำลังเปิด…</div>;

  const answered = state.kept.filter((k) => k.ownNote?.trim() || k.text);

  function buildBookHtml(): string {
    const title = `บทสนทนากับ${relationshipLabel(state.answers)}`;
    const rows = answered
      .map((k) => {
        const q = k.ownNote?.trim() ? k.ownNote : k.text;
        const a = state.memory.notes[k.id]?.trim() ?? "";
        return `<div class="qa"><p class="q">${escapeHtml(q)}</p>${
          a ? `<p class="a">${escapeHtml(a)}</p>` : ""
        }</div>`;
      })
      .join("\n");
    return `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(
      title,
    )}</title><style>body{font-family:'Noto Sans Thai',-apple-system,sans-serif;background:#fbf8f5;color:#3f332d;max-width:680px;margin:0 auto;padding:48px 24px;line-height:1.75}.cover{text-align:center;margin-bottom:36px}.cover small{color:#9a8f89;letter-spacing:.05em}h1{font-size:28px;margin:6px 0 0}.qa{padding:18px 0;border-bottom:1px solid #eee6df}.q{font-weight:600;margin:0;font-size:18px}.a{color:#6e625d;margin:8px 0 0;white-space:pre-wrap}.foot{text-align:center;color:#9a8f89;margin-top:36px;font-size:14px}</style></head><body><div class="cover"><small>บันทึกความทรงจำ</small><h1>${escapeHtml(
      title,
    )}</h1></div>${rows}<p class="foot">ก่อนจะลืมถาม · ถามตอนที่ยังถามได้</p></body></html>`;
  }

  async function exportZip() {
    const enc = new TextEncoder();
    const entries: ZipEntry[] = [
      { name: "ความทรงจำ.html", data: enc.encode(buildBookHtml()) },
    ];
    for (let i = 0; i < clips.length; i++) {
      const buf = new Uint8Array(await clips[i].blob.arrayBuffer());
      entries.push({ name: `เสียง/เสียง-${i + 1}.webm`, data: buf });
    }
    const blob = makeZip(entries);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ความทรงจำ.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return (
    <div className="page">
      <Navbar bag={state.kept.length || undefined} />

      <main
        className="container print-page page-in"
        style={{ flex: 1, paddingTop: "var(--space-3)", paddingBottom: "var(--space-6)" }}
      >
        <div className="stack" style={{ gap: "var(--space-1)", marginBottom: "var(--space-4)" }}>
          <p className="eyebrow no-print">ความทรงจำ</p>
          <h1 style={{ fontSize: "var(--text-h2)" }}>เก็บเสียงและคำตอบไว้</h1>
          <p className="muted" style={{ fontSize: "var(--text-small)" }}>
            เก็บไว้ในเครื่องคุณเท่านั้น เราไม่เห็น ไม่มีใครเห็น
          </p>
        </div>

        <Recorder onClip={(c) => setClips((prev) => [c, ...prev])} />

        {/* รายการเสียงที่อัด */}
        {clips.length > 0 && (
          <div className="stack no-print" style={{ gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
            {clips.map((c, i) => (
              <div key={i} className="card" style={{ boxShadow: "none", padding: "var(--space-2)" }}>
                <span className="tertiary" style={{ fontSize: "var(--text-small)" }}>{c.at}</span>
                <audio controls src={c.url} style={{ width: "100%", marginTop: 6 }} />
                <a
                  href={c.url}
                  download={`เสียง-${i + 1}.webm`}
                  className="btn btn--ghost"
                  style={{ paddingLeft: 0 }}
                >
                  ดาวน์โหลดไฟล์เสียง
                </a>
              </div>
            ))}
          </div>
        )}

        {/* preview เหมือนหนังสือ */}
        <section className="card" style={{ marginTop: "var(--space-5)", padding: "var(--space-4)" }}>
          <div
            className="stack"
            style={{ alignItems: "center", gap: 4, marginBottom: "var(--space-4)", textAlign: "center" }}
          >
            <p className="eyebrow">บันทึกความทรงจำ</p>
            <h2 style={{ fontSize: "var(--text-h3)" }}>
              บทสนทนากับ{relationshipLabel(state.answers)}
            </h2>
          </div>

          {answered.length === 0 ? (
            <p className="tertiary" style={{ textAlign: "center" }}>
              ยังไม่มีคำตอบ - เก็บการ์ดจากหน้าคำถามก่อนนะ
            </p>
          ) : (
            <div className="stack" style={{ gap: "var(--space-4)" }}>
              {answered.map((k) => (
                <div key={k.id} className="stack" style={{ gap: 8 }}>
                  <p style={{ fontWeight: 600, fontSize: "var(--text-body)" }}>
                    {k.ownNote?.trim() ? k.ownNote : k.text}
                  </p>
                  <textarea
                    className="textarea no-print"
                    style={{ minHeight: 90 }}
                    placeholder="คำตอบของเขา… (พิมพ์เก็บไว้ก็ได้)"
                    value={state.memory.notes[k.id] ?? ""}
                    onChange={(e) =>
                      dispatch({
                        type: "setMemoryNote",
                        payload: { id: k.id, text: e.target.value },
                      })
                    }
                  />
                  {state.memory.notes[k.id]?.trim() && (
                    <p className="muted print-only">{state.memory.notes[k.id]}</p>
                  )}
                  <hr className="divider" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Export (spec C6.5: PDF · ไฟล์เสียง · ทั้งหมด ZIP) */}
        <div className="stack no-print" style={{ gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
          <button type="button" className="btn btn--keepsake btn--block" onClick={() => window.print()}>
            บันทึกเป็น PDF
          </button>
          <button type="button" className="btn btn--secondary btn--block" onClick={exportZip}>
            ดาวน์โหลดทั้งหมด (ZIP)
          </button>
          <Link href="/bag" className="btn btn--ghost btn--block">
            กลับไปที่กระเป๋าคำพูด
          </Link>
        </div>
      </main>
    </div>
  );
}

// ปุ่มอัดเสียงวงกลม 88px - วงแหวนขยายช้าๆ (ไม่ใช่คลื่นเต้นแรง, spec C6.5)
function Recorder({ onClip }: { onClip: (c: Clip) => void }) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

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
        onClip({ blob, url: URL.createObjectURL(blob), at: new Date().toLocaleString("th-TH") });
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
      setError(null);
    } catch {
      setError("เปิดไมโครโฟนไม่ได้ - ลองอนุญาตไมค์ในเบราว์เซอร์ หรือพิมพ์เก็บไว้แทนก็ได้");
    }
  }

  return (
    <div className="stack no-print" style={{ alignItems: "center", gap: "var(--space-2)" }}>
      <button
        type="button"
        onClick={toggle}
        aria-label={recording ? "หยุดอัดเสียง" : "เริ่มอัดเสียง"}
        style={{
          position: "relative",
          width: 88,
          height: 88,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: recording ? "var(--color-error)" : "var(--color-keepsake)",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontSize: 28,
        }}
      >
        {recording && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              border: "2px solid var(--color-error)",
              animation: "rec-ring 2s var(--ease) infinite",
            }}
          />
        )}
        <span aria-hidden>{recording ? "■" : "●"}</span>
      </button>
      <span className="muted" style={{ fontSize: "var(--text-small)" }}>
        {recording ? "กำลังอัด… แตะเพื่อหยุด" : "แตะเพื่ออัดเสียงเขาเล่าเรื่อง"}
      </span>
      {error && <p style={{ color: "var(--color-error)", fontSize: "var(--text-small)" }}>{error}</p>}
    </div>
  );
}
