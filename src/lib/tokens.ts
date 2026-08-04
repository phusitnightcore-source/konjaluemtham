// ก่อนจะลืมถาม - การแทนคำเรียก/คำแทนตัว ตามคำตอบข้อ 1 (spec B)

import type {
  Answers,
  ConditionId,
  FearId,
  Phrase,
  RelationshipId,
  TimeId,
} from "./types";
import { PHRASES } from "./content";

export interface Option<T extends string> {
  id: T;
  label: string;
}

export const RELATIONSHIPS: Option<RelationshipId>[] = [
  { id: "mother", label: "แม่" },
  { id: "father", label: "พ่อ" },
  { id: "partner", label: "คู่ชีวิต" },
  { id: "child", label: "ลูก" },
  { id: "friend", label: "เพื่อน" },
  { id: "grandma", label: "ย่า" },
  { id: "grandmom", label: "ยาย" },
  { id: "grandpa", label: "ปู่" },
  { id: "granddad", label: "ตา" },
  { id: "other", label: "อื่นๆ" },
];

export const CONDITIONS: Option<ConditionId>[] = [
  { id: "normal", label: "คุยได้ปกติ" },
  { id: "tired", label: "คุยได้แต่เหนื่อยเร็ว" },
  { id: "sometimes", label: "คุยได้บ้างไม่ได้บ้าง" },
  { id: "nonverbal", label: "สื่อสารไม่ได้แล้ว" },
  { id: "gone", label: "เขาจากไปแล้ว" },
];

export const TIMES: Option<TimeId>[] = [
  { id: "months", label: "เป็นเดือน" },
  { id: "weeks", label: "เป็นสัปดาห์" },
  { id: "days", label: "ไม่กี่วัน" },
  { id: "unknown", label: "ไม่รู้เลย" },
];

export const FEARS: Option<FearId>[] = [
  { id: "love", label: "กลัวไม่ได้บอกว่ารักเขา" },
  { id: "anger", label: "กลัวยังโกรธกันอยู่ / ยังไม่ได้ขอโทษ" },
  { id: "know", label: "กลัวจะไม่รู้จักเขาจริงๆ สักที" },
  { id: "practical", label: "กลัวเรื่องปฏิบัติจะยุ่ง" },
  { id: "regret", label: "กลัวเสียใจแล้วไม่ได้ทำอะไรเลย" },
  { id: "unsure", label: "ยังไม่รู้" },
];

// ค่าเริ่มต้นของ {them} / {me} ต่อความสัมพันธ์
const TERMS: Record<RelationshipId, { them: string; me: string }> = {
  mother: { them: "แม่", me: "หนู" },
  father: { them: "พ่อ", me: "หนู" },
  partner: { them: "คุณ", me: "เรา" },
  child: { them: "ลูก", me: "เรา" },
  friend: { them: "เธอ", me: "เรา" },
  grandma: { them: "ย่า", me: "หนู" },
  grandmom: { them: "ยาย", me: "หนู" },
  grandpa: { them: "ปู่", me: "หนู" },
  granddad: { them: "ตา", me: "หนู" },
  other: { them: "คุณ", me: "เรา" },
};

// ตัวเลือกคำแทนตัวเอง ({me}) - เลือกได้ในแบบสอบถาม
export const SELF_OPTIONS: string[] = ["หนู", "ผม", "ดิฉัน", "ฉัน", "เรา"];

export function termsFor(answers: Answers): { them: string; me: string } {
  const rel = answers.relationship;
  const base =
    rel === "other" && answers.relationshipCustom?.trim()
      ? { them: answers.relationshipCustom.trim(), me: "เรา" }
      : rel
        ? TERMS[rel]
        : { them: "แม่", me: "หนู" };
  // ถ้าผู้ใช้เลือกคำแทนตัวเองไว้ ให้ใช้คำนั้นแทน {me} ทุกประโยค
  const me = answers.self?.trim() ? answers.self.trim() : base.me;
  return { them: base.them, me };
}

// แทนคำ {them} / {me} ในประโยค
export function fill(text: string, answers: Answers): string {
  const { them, me } = termsFor(answers);
  return text.replaceAll("{them}", them).replaceAll("{me}", me);
}

export function relationshipLabel(answers: Answers): string {
  if (answers.relationship === "other" && answers.relationshipCustom?.trim()) {
    return answers.relationshipCustom.trim();
  }
  const found = RELATIONSHIPS.find((r) => r.id === answers.relationship);
  return found ? found.label : "เขา";
}

// ---------------------------------------------------------------
// สร้างชุดการ์ด - จัดลำดับปลอดภัย: เปิด → เบา → ลึก (ตามความกลัว) → ปิดอบอุ่น
// ไม่มีตัวนับ "ใบที่ 5 จาก 40" (spec C6.3)
// ---------------------------------------------------------------
export function buildDeck(answers: Answers): Phrase[] {
  const fear = answers.fear;
  const condition = answers.condition;

  // ถ้าสื่อสารไม่ได้แล้ว → ใช้ชุด "พูดข้างเดียว" เป็นหลัก
  if (condition === "nonverbal") {
    const oneway = PHRASES.filter((p) => p.category === "oneway");
    const closing = PHRASES.filter((p) => p.category === "closing");
    return [...oneway, ...closing];
  }

  const openers = PHRASES.filter((p) => p.stage === "open");
  const light = PHRASES.filter((p) => p.stage === "light");
  const deepAll = PHRASES.filter(
    (p) => p.stage === "deep" && p.category !== "recovery",
  );
  const closing = PHRASES.filter((p) => p.stage === "close");

  // เรียงการ์ดลึกตามความกลัว: ที่ตรงความกลัวมาก่อน
  const matchesFear = (p: Phrase) =>
    fear && fear !== "unsure" ? (p.fears ?? []).includes(fear) : false;

  const deepPrioritized = [...deepAll].sort((a, b) => {
    const am = matchesFear(a) ? 0 : 1;
    const bm = matchesFear(b) ? 0 : 1;
    return am - bm;
  });

  // ถ้าเขาเหนื่อยเร็ว → ใส่คำถามเบาเยอะขึ้น ลดคำถามลึกลง
  const deepCount =
    condition === "tired" || condition === "sometimes" ? 10 : deepPrioritized.length;

  return [
    ...openers.slice(0, 6),
    ...light,
    ...deepPrioritized.slice(0, deepCount),
    ...closing,
  ];
}

// 3 คำถามสำรอง เมื่อเขาเหนื่อย (spec C6.4 Backup Plan)
export function backupThree(answers: Answers): Phrase[] {
  const fear = answers.fear;
  const pool = PHRASES.filter(
    (p) => p.stage === "deep" && p.category !== "recovery",
  );
  const matched = pool.filter(
    (p) => fear && fear !== "unsure" && (p.fears ?? []).includes(fear),
  );
  const picked = (matched.length >= 2 ? matched : pool).slice(0, 2);
  const close = PHRASES.find((p) => p.id === "cl-1");
  return close ? [...picked, close] : picked;
}
