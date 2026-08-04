"use client";

// Landing (spec C6.1 + A1) - อบอุ่น มีเนื้อหาที่แตะใจ แต่ไม่เร่งไม่หวือหวา
// ห้าม: เทียน · ดอกไม้ขาว · นาฬิกา · "ผู้ป่วยระยะสุดท้าย" · "ความตาย"

import Link from "next/link";
import FlowerDeco from "@/components/FlowerDeco";
import Reveal from "@/components/Reveal";
import { FontSizeControl } from "@/components/FontSize";
import ShareButton from "@/components/ShareButton";
import { useStore } from "@/lib/store";
import { PHRASES } from "@/lib/content";
import { fill } from "@/lib/tokens";

export default function Landing() {
  const { state } = useStore();
  const hasProgress =
    state.answers.relationship !== null || state.kept.length > 0;
  const startHref = hasProgress ? "/cards" : "/questions";

  const sample = (id: string) => {
    const p = PHRASES.find((x) => x.id === id);
    return p ? fill(p.text, state.answers) : "";
  };

  return (
    <div className="page">
      {/* ชั้นตกแต่งพื้นหลังอุ่น */}
      <div className="bg-decor" aria-hidden>
        <span className="orb orb--1" />
        <span className="orb orb--2" />
        <span className="orb orb--3" />
      </div>
      <div className="grain" aria-hidden />

      {/* Header */}
      <header className="lander-header no-print">
        <Link href="/" className="lander-brand">
          <strong>ก่อนจะลืมถาม</strong>
          <span>ถามตอนที่ยังถามได้</span>
        </Link>
        <nav className="lander-nav">
          <Link href="/about" className="navlink">
            เกี่ยวกับเรา
          </Link>
          <Link href="/resources" className="navlink">
            แหล่งช่วยเหลือ
          </Link>
          <Link href="/letter" className="navlink">
            สำหรับคนที่สายไปแล้ว
          </Link>
          <Link href="/settings" className="navlink">
            ตั้งค่า
          </Link>
          <FontSizeControl />
          <Link href={startHref} className="btn btn--primary" style={{ height: 48 }}>
            เริ่มต้นอย่างช้าๆ
          </Link>
        </nav>
      </header>

      <main className="lander-main" style={{ flex: 1 }}>
        {/* ===== Hero ===== */}
        <section className="hero-grid page-in container container--wide">
          <div className="hero-copy">
            <p className="eyebrow">ก่อนจะลืมถาม · ถามตอนที่ยังถามได้</p>
            <h1 style={{ fontSize: "clamp(30px, 6vw, 46px)", lineHeight: 1.3 }}>
              ไม่ต้องรีบ
              <br />
              เราจะอยู่ตรงนี้กับคุณ
            </h1>
            <p className="hero-italic">เมื่อไหร่ที่พร้อม ค่อยเริ่มก็ได้</p>
            <p className="muted" style={{ fontSize: "var(--text-body)" }}>
              ช่วยคุณเริ่มบทสนทนากับคนที่คุณรัก ด้วยคำถามที่คิดมาให้แล้วอย่างอ่อนโยน
              เพื่อไม่ให้วันหนึ่งต้องเสียดายว่าไม่ได้ถาม
            </p>
            <div className="stack" style={{ gap: "var(--space-2)", width: "100%", maxWidth: 380 }}>
              <Link href={startHref} className="btn btn--primary btn--block">
                <span className="btn-heart" aria-hidden>♥</span>
                {hasProgress ? "กลับไปทำต่อ" : "เริ่มต้นอย่างช้าๆ"}
              </Link>
              <Link href="/cards?preview=1" className="btn btn--ghost btn--block">
                ดูตัวอย่างก่อน
              </Link>
            </div>
            <span className="hint-lock">
              <LockIcon />
              ทั้งหมดถูกบันทึกไว้ในเครื่องของคุณเท่านั้น ไม่มีใครเห็น
            </span>
            {hasProgress && (
              <p className="tertiary" style={{ fontSize: "var(--text-small)" }}>
                ยินดีที่กลับมานะ ของเดิมยังอยู่ครบ
              </p>
            )}
          </div>

          <div className="hero-frame" role="img" aria-label="ภาพวาดดอกไม้สีอบอุ่น">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="hero-bloom" src="/flower/f5.png" alt="" aria-hidden />
            <FlowerDeco name="f3" size={104} className="float" style={{ top: 8, left: 4 }} />
          </div>
        </section>

        {/* ===== ข้อความจากผู้สร้าง (เรื่องเล่า) - แถบครีมเต็มขอบ ===== */}
        <Reveal as="section" className="section band--cream">
          <FlowerDeco name="f13" size={112} style={{ bottom: -18, right: 24, opacity: 0.85 }} />
          <div className="founder-note">
            <div className="founder-note__head">
              <span className="founder-note__icon" aria-hidden>
                <ChatIcon />
              </span>
              <p className="eyebrow">ข้อความจากผู้สร้าง</p>
            </div>
            <h2 className="section-title" style={{ textAlign: "center" }}>
              ผมยังไม่กล้าพูดกับพ่อเลยสักคำ
            </h2>
            <div className="founder-note__body">
              {PARAGRAPHS.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <p className="founder-sign" style={{ textAlign: "center" }}>
              ก่อนจะลืมถาม
              <br />
              ถามตอนที่ยังถามได้
            </p>
          </div>
        </Reveal>

        {/* ===== เสียงในหัว 4 ด่าน (spec A1) ===== */}
        <Reveal as="section" className="section">
          <div className="container container--wide">
            <div className="section-head-block">
              <p className="eyebrow">เรารู้ว่ามันไม่ใช่เรื่องง่าย</p>
              <h2 className="section-title">
                ปัญหาไม่ใช่ “ไม่รู้จะพูดอะไร”
                <br />
                แต่คือ “ไม่กล้าเริ่ม”
              </h2>
              <p className="lead">เสียงในหัวที่หลายคนเจอเหมือนกัน - คุณไม่ได้แปลกอะไรเลย</p>
            </div>
            <div className="voice-grid">
              {VOICES.map((v, i) => (
                <div className="voice" key={v.name}>
                  <div className="voice__mark" aria-hidden>“</div>
                  <p className="voice__quote">{v.quote}</p>
                  <div className="voice__name">- {v.name}</div>
                  <FlowerDeco
                    name={VOICE_FLOWERS[i]}
                    size={92}
                    style={{ bottom: -8, right: -6 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ===== สิ่งที่เราเตรียมไว้ให้ ===== */}
        <Reveal as="section" className="section band--soft">
          <div className="container container--wide">
            <div className="section-head-block">
              <p className="eyebrow">เราอยู่ข้างๆ คุณ</p>
              <h2 className="section-title">สิ่งที่เราเตรียมไว้ให้</h2>
            </div>
            <div className="give-grid">
              {GIVES.map((g) => (
                <div className="give" key={g.title}>
                  <span className="give__icon" aria-hidden>{g.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-body)" }}>{g.title}</div>
                    <div className="muted" style={{ fontSize: "var(--text-small)", marginTop: 4 }}>
                      {g.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ===== ตัวอย่างหมวดคำถาม ===== */}
        <Reveal as="section" className="section">
          <div className="container container--wide">
            <div className="section-head-block">
              <p className="eyebrow">คำถามที่คิดมาให้แล้ว</p>
              <h2 className="section-title">ไม่รู้จะเริ่มถามอะไร เราคิดไว้ให้กว่า 100 ประโยค</h2>
              <p className="lead">ทุกประโยคปรับคำเรียกให้เข้ากับคนของคุณโดยอัตโนมัติ</p>
            </div>
            <div className="cat-grid">
              {CATS.map((c) => (
                <div className="cat" key={c.id}>
                  <span className="cat__label">{c.label}</span>
                  <p className="cat__sample">“{sample(c.id)}”</p>
                  <FlowerDeco name={c.flower} size={78} style={{ bottom: -8, right: -8 }} />
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "var(--space-4)" }}>
              <Link href="/cards?preview=1" className="btn btn--secondary">
                ดูตัวอย่างการ์ดทั้งหมด
              </Link>
            </div>
          </div>
        </Reveal>

        {/* ===== 3 ขั้นตอน ===== */}
        <Reveal as="section" className="section band--soft">
          <div className="container container--wide">
            <div className="section-head-block">
              <p className="eyebrow">ง่ายๆ ไม่มีอะไรซับซ้อน</p>
              <h2 className="section-title">เริ่มยังไง</h2>
            </div>
            <div className="steps">
              {STEPS.map((s, i) => (
                <div className="step" key={i}>
                  <span className="step__num">{i + 1}</span>
                  <strong style={{ fontSize: "var(--text-body)" }}>{s.title}</strong>
                  <span className="muted" style={{ fontSize: "var(--text-small)" }}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ===== บล็อกปิดอบอุ่น ===== */}
        <Reveal as="section" className="section">
          <div className="container">
            <div className="closing-block">
              <FlowerDeco name="f14" size={120} className="float" style={{ top: -10, left: -12 }} />
              <FlowerDeco name="f17" size={140} style={{ bottom: -14, right: -14 }} />
              <h2 className="section-title" style={{ maxWidth: 460 }}>
                ไม่ต้องทำให้จบวันนี้
                <br />
                ออกตอนไหนก็ได้ ของที่ทำไว้จะยังอยู่
              </h2>
              <p className="lead">ถามข้อเดียวก็มีค่าแล้ว เอาไปเท่าที่ไหวนะ</p>
              <div className="stack" style={{ gap: "var(--space-2)", width: "100%", maxWidth: 340 }}>
                <Link href={startHref} className="btn btn--primary btn--block">
                  <span className="btn-heart" aria-hidden>♥</span>
                  {hasProgress ? "กลับไปทำต่อ" : "เริ่มต้นอย่างช้าๆ"}
                </Link>
                <ShareButton className="btn btn--ghost btn--block" />
              </div>
              <div className="feature-strip" style={{ marginTop: "var(--space-3)" }}>
                <FeatureItem icon={<NoSignupIcon />} title="ไม่ต้องสมัครสมาชิก" />
                <FeatureItem icon={<SaveIcon />} title="บันทึกในเครื่องเท่านั้น" />
                <FeatureItem icon={<ExitIcon />} title="ปิดแล้วกลับมาได้เสมอ" />
                <FeatureItem icon={<HeartIcon />} title="คุณเป็นผู้ควบคุมเอง" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* บรรทัดล่างสุด - ห้ามตัดออก (spec C6.1) */}
        <div className="landing-footer container">
          <Link href="/letter" style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-body)", textDecoration: "underline" }}>
            เขาจากไปแล้ว - มีอะไรให้ฉันไหม
          </Link>
          <p style={{ marginTop: "var(--space-3)" }}>ก่อนจะลืมถาม · ถามตอนที่ยังถามได้</p>
        </div>
      </main>
    </div>
  );
}

/* ---------- ข้อมูลเนื้อหา ---------- */
const VOICES = [
  { name: "กลัวเป็นลาง", quote: "ถ้าชวนคุยเรื่องนี้ เหมือนแช่งเขาหรือเปล่า" },
  { name: "เกรงใจ", quote: "เขาจะเสียใจ เขาจะรู้ตัวว่าใกล้แล้ว" },
  { name: "กลัวตัวเอง", quote: "พูดไปคงร้องไห้ ไม่จบแน่" },
  { name: "สมองว่าง", quote: "ตอนอยู่ตรงนั้นจริงๆ นึกอะไรไม่ออกเลย" },
];
const VOICE_FLOWERS = ["f6", "f1", "f11", "f9"];

// เรื่องเล่าจากผู้สร้าง (บรรทัดเปิดใช้เป็นหัวข้อ) - เรียบเรียงเป็นย่อหน้าไหลต่อกัน อ่านง่าย
const PARAGRAPHS: string[] = [
  "พ่อผมยังแข็งแรงดี ยังนั่งกินข้าวโต๊ะเดิม ยังบ่นเรื่องเดิมทุกวัน แต่บางคืนผมนอนคิดว่า ผมยังไม่เคยบอกเขาเลยว่าขอบคุณเรื่องอะไรบ้าง ยังไม่เคยถามว่าตอนหนุ่มๆ เขาเป็นคนยังไง และยังไม่เคยพูดคำว่ารักออกไปสักครั้ง",
  "แล้วผมก็คิดต่อว่า ถ้าวันหนึ่งไม่มีเขาแล้ว ผมจะเสียดายแค่ไหน คิดไปคิดมา ผมร้องไห้อยู่คนเดียว ทั้งที่พ่อยังนอนหลับอยู่ในห้องข้างๆ",
  "ผมไม่กล้าพูดเพราะไม่รู้ว่าจะเริ่มยังไง ไม่รู้ว่าพูดไปแล้วเขาจะคิดมากหรือเปล่า หรือจะตกใจไหมว่าทำไมลูกพูดแบบนี้ และผมเชื่อว่าผมไม่ได้เป็นคนเดียว บ้านคนไทยหลายบ้านก็เป็นแบบนี้ รักกันมาก แต่ไม่เคยพูด เพราะไม่มีใครสอนว่าต้องพูดตอนไหน",
  "ผมเลยทำเว็บนี้ขึ้นมา ไม่ใช่เพราะผมทำได้แล้ว แต่เพราะผมยังทำไม่ได้ ที่นี่มีคำถามที่ผมอยากถามพ่อ มีคำพูดที่ผมยังพูดไม่ออก และมีวิธีชวนเขากินข้าวสักมื้อ โดยไม่ต้องอธิบายว่าทำไม",
  "ไม่ต้องใช้ทั้งหมดก็ได้ ผมเองก็จะเริ่มจากข้อเดียวเหมือนกัน",
];

const CATS = [
  { label: "ความทรงจำ", id: "mem-happiest", flower: "f16" },
  { label: "รู้จักเขาจริงๆ", id: "per-burden", flower: "f11" },
  { label: "ขอบคุณ", id: "th-fromyou", flower: "f5" },
  { label: "ขอโทษ · ให้อภัย", id: "ap-forgive-2", flower: "f15" },
  { label: "รักนะ", id: "lv-3a", flower: "f9" },
  { label: "สิ่งที่เขาห่วง", id: "wo-7", flower: "f4" },
];

const STEPS = [
  { title: "ตอบ 4 คำถามสั้นๆ", desc: "บอกเราว่าเขาเป็นใคร และคุณกลัวอะไรที่สุด" },
  { title: "เปิดการ์ดทีละใบ", desc: "เก็บใบที่ใช่ ข้ามใบที่ไม่ใช่ เขียนเป็นคำของคุณเองก็ได้" },
  { title: "ไปคุยกันจริงๆ", desc: "วางแผนมื้ออาหาร เก็บเสียงไว้ เป็นความทรงจำที่อยู่กับคุณไปนาน" },
];

/* ---- ไอคอนเส้น (วาดเอง) ---- */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const GIVES = [
  {
    title: "บทเปิดที่ไม่เหมือนสั่งเสีย",
    desc: "เริ่มด้วยข้ออ้างดีๆ อย่าง “มื้ออาหาร” ให้เป็นเรื่องปกติ ไม่ใช่พิธีอำลา",
    icon: <ChatIcon />,
  },
  {
    title: "คำถามที่คิดมาให้แล้ว",
    desc: "เพราะตอนอยู่ตรงนั้นจริงๆ สมองมักจะว่างเปล่า นึกอะไรไม่ออก",
    icon: <SparkIcon />,
  },
  {
    title: "ทางถอยเมื่อไปผิดทาง",
    desc: "ประโยคกู้สถานการณ์ เมื่อบรรยากาศหนักเกินไป หรือเมื่อคุณเองร้องไห้",
    icon: <CompassIcon />,
  },
  {
    title: "เก็บเสียงไว้ได้",
    desc: "บันทึกคำตอบและเสียงเล่าเรื่องของเขา เก็บไว้ในเครื่องคุณเท่านั้น",
    icon: <MicIcon />,
  },
];

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke}>
      <rect x="4" y="10" width="16" height="10" rx="2.5" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function NoSignupIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-6.5 7-6.5" />
      <path d="M16 17h5" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <rect x="5" y="4" width="14" height="16" rx="2.5" />
      <path d="M9 9h6M9 13h6M9 17h4" />
    </svg>
  );
}
function ExitIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M14 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7" />
      <path d="M17 8l4 4-4 4M21 12H10" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.6C19 15.4 12 20 12 20z" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H6" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
      <path d="M18 15l.7 1.8L20.5 17.5 18.7 18.2 18 20l-.7-1.8L15.5 17.5 17.3 16.8z" />
    </svg>
  );
}
function CompassIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...stroke}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </svg>
  );
}

function FeatureItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="feature-strip__item">
      <span className="feature-strip__icon" aria-hidden>{icon}</span>
      <span className="feature-strip__title">{title}</span>
    </div>
  );
}
