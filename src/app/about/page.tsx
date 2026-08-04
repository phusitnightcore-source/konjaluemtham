import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import FlowerDeco from "@/components/FlowerDeco";

export const metadata: Metadata = {
  title: "เกี่ยวกับ ก่อนจะลืมถาม - ถามตอนที่ยังถามได้",
  description:
    "ก่อนจะลืมถาม คือพื้นที่ปลอดภัยที่ช่วยให้คุณได้เริ่มบทสนทนาสำคัญกับคนที่คุณรัก ตอนที่ยังถามได้ - เราสร้างมาเพื่ออะไร และมีจุดประสงค์อย่างไร",
};

export default function AboutPage() {
  return (
    <div className="page">
      {/* พื้นหลังอุ่น */}
      <div className="bg-decor" aria-hidden>
        <span className="orb orb--1" />
        <span className="orb orb--2" />
      </div>
      <div className="grain" aria-hidden />

      <Navbar />

      <main className="container page-in" style={{ flex: 1, paddingBottom: "var(--space-7)" }}>
        {/* หัวเรื่อง + ดอกไม้ */}
        <section
          className="section"
          style={{ textAlign: "center", position: "relative", paddingBottom: "var(--space-3)" }}
        >
          <div
            style={{
              position: "relative",
              width: 180,
              height: 180,
              margin: "0 auto var(--space-3)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/flower/f7.png"
              alt=""
              aria-hidden
              style={{ width: "100%", height: "auto", filter: "drop-shadow(0 14px 28px rgba(107,76,54,.18))" }}
            />
          </div>
          <p className="eyebrow">เกี่ยวกับเรา</p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.35, marginTop: 8 }}>
            ก่อนจะลืมถาม
          </h1>
          <p className="hero-italic" style={{ marginTop: 8 }}>
            ถามตอนที่ยังถามได้
          </p>
          <p className="lead" style={{ margin: "var(--space-3) auto 0" }}>
            พื้นที่ปลอดภัยที่ช่วยให้คุณได้เริ่มบทสนทนากับคนที่คุณรัก
            ด้วยคำถามที่คิดมาให้แล้วอย่างอ่อนโยน - ก่อนที่จะสายเกินไป
          </p>
        </section>

        {/* ทำไมเราถึงสร้าง */}
        <Reveal as="section" className="section">
          <div className="section-head-block">
            <p className="eyebrow">ทำไมเราถึงสร้างสิ่งนี้</p>
            <h2 className="section-title">
              คนเรามักไม่เสียใจกับสิ่งที่พูดไป
              <br />
              แต่เสียใจกับสิ่งที่ “ไม่ได้ถาม”
            </h2>
          </div>
          <div className="card" style={{ position: "relative", overflow: "hidden", padding: "var(--space-5)" }}>
            <FlowerDeco name="f13" size={110} style={{ top: -10, right: -12 }} />
            <div className="stack" style={{ gap: "var(--space-3)", position: "relative", zIndex: 1 }}>
              <p>
                ปัญหาไม่ได้อยู่ที่ “ไม่รู้จะพูดอะไร” แต่อยู่ที่ “ไม่กล้าเริ่ม”
              </p>
              <p>
                กลัวว่าชวนคุยเรื่องนี้แล้วจะเหมือนเป็นลาง · เกรงใจว่าเขาจะเสียใจ ·
                กลัวว่าพูดไปแล้วตัวเองจะร้องไห้ไม่จบ · และพอถึงเวลาจริงๆ
                สมองก็ว่างเปล่า นึกอะไรไม่ออกเลย
              </p>
              <p>
                เราเลยอยากทำพื้นที่เล็กๆ ที่ช่วยคุณข้ามด่านเหล่านี้ -
                มีคำถามที่คิดมาให้แล้ว เผื่อวันที่คิดเองไม่ทัน
                มีบทเปิดที่ไม่เหมือนสั่งเสีย เริ่มจากชวนไปกินข้าวก็ได้
                และมีทางถอย เมื่อบทสนทนาหนักเกินไป
              </p>
            </div>
          </div>
        </Reveal>

        {/* จุดประสงค์ */}
        <Reveal as="section" className="section">
          <div className="section-head-block">
            <p className="eyebrow">เราสร้างมาเพื่ออะไร</p>
            <h2 className="section-title">จุดประสงค์ของเรา</h2>
          </div>
          <div className="give-grid">
            {PURPOSES.map((p) => (
              <div className="give" key={p.title}>
                <span className="give__icon" aria-hidden>
                  {p.no}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-body)" }}>{p.title}</div>
                  <div className="muted" style={{ fontSize: "var(--text-small)", marginTop: 4 }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* คำสัญญาเรื่องความเป็นส่วนตัว */}
        <Reveal as="section" className="section">
          <div
            className="card"
            style={{
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              padding: "var(--space-5)",
              background: "var(--color-keepsake-soft)",
              border: "1px solid color-mix(in srgb, var(--color-keepsake) 30%, transparent)",
            }}
          >
            <FlowerDeco name="f3" size={100} style={{ bottom: -14, left: -10 }} />
            <h3 style={{ fontSize: "var(--text-h3)", position: "relative", zIndex: 1 }}>
              เรื่องแบบนี้ มันส่วนตัวเกินกว่าจะให้ใครมาเห็น
            </h3>
            <p className="muted" style={{ margin: "var(--space-2) auto 0", position: "relative", zIndex: 1 }}>
              เราไม่เก็บข้อมูลของคุณ ไม่ต้องสมัคร ทุกอย่างถูกบันทึกไว้ในเครื่องคุณเท่านั้น
              ไม่มีใครเห็น แม้แต่เรา
            </p>
          </div>
        </Reveal>

        {/* ปิดท้าย */}
        <Reveal as="section" className="section">
          <div className="closing-block">
            <FlowerDeco name="f14" size={116} className="float" style={{ top: -10, left: -12 }} />
            <FlowerDeco name="f17" size={132} style={{ bottom: -12, right: -14 }} />
            <h2 className="section-title" style={{ maxWidth: 500 }}>
              เป้าหมายของเราไม่ใช่ให้คุณจำเว็บนี้ได้
              <br />
              แต่อยากให้สักวัน คุณจำได้ว่า “วันนั้น ได้คุยกับเขา”
            </h2>
            <div className="stack" style={{ gap: "var(--space-2)", width: "100%", maxWidth: 340 }}>
              <Link href="/questions" className="btn btn--primary btn--block">
                <span className="btn-heart" aria-hidden>
                  ♥
                </span>
                เริ่มต้นอย่างช้าๆ
              </Link>
              <Link href="/letter" className="btn btn--ghost btn--block">
                เขาจากไปแล้ว - มีอะไรให้ฉันไหม
              </Link>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}

const PURPOSES = [
  {
    no: "1",
    title: "ช่วยให้กล้าเริ่ม",
    desc: "ปัญหาไม่ใช่ไม่รู้จะพูดอะไร แต่ไม่กล้าเริ่ม เราจึงเตรียมบทเปิดและคำถามไว้ให้",
  },
  {
    no: "2",
    title: "ทำให้เป็นเรื่องปกติ",
    desc: "ใช้ “มื้ออาหาร” เป็นสะพาน ให้เป็นกิจกรรมธรรมดา ไม่ใช่พิธีอำลา",
  },
  {
    no: "3",
    title: "เก็บความทรงจำไว้",
    desc: "อัดเสียง เก็บคำตอบ เป็นสิ่งที่อยู่กับคนข้างหลังต่อไปอีกนาน",
  },
  {
    no: "4",
    title: "ปลอดภัยและส่วนตัว",
    desc: "ไม่มีบัญชี ไม่เก็บข้อมูล ทุกอย่างอยู่ในเครื่องคุณเท่านั้น",
  },
  {
    no: "5",
    title: "ไม่ทิ้งใครไว้ข้างหลัง",
    desc: "คนที่สายไปแล้ว ก็มีทางให้เขียนสิ่งที่อยากบอกได้เสมอ",
  },
];
