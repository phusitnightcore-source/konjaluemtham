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

// สุ่มลำดับ (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// กระจายหมวดแบบ round-robin: หมุนทีละหมวด หมวดละ 1 ใบวนไปเรื่อยๆ
// → ทุกหมวดโผล่ตั้งแต่รอบแรก หลากหลาย ไม่ซ้ำติดกัน (จนกว่าจะเหลือหมวดเดียว)
// การ์ดที่ตรงความกลัวถูกดันขึ้นก่อนภายในหมวดของตัวเอง
function spreadByCategory(items: Phrase[], matches: (p: Phrase) => boolean): Phrase[] {
  const groups: Record<string, Phrase[]> = {};
  for (const p of items) (groups[p.category] ||= []).push(p);
  for (const k in groups) {
    groups[k] = shuffle(groups[k]).sort(
      (a, b) => (matches(b) ? 1 : 0) - (matches(a) ? 1 : 0),
    );
  }
  const order = shuffle(Object.keys(groups)); // ลำดับหมวดที่จะวน (สุ่ม)
  const result: Phrase[] = [];
  let remaining = items.length;
  while (remaining > 0) {
    for (const cat of order) {
      const bucket = groups[cat];
      if (bucket.length > 0) {
        result.push(bucket.shift()!);
        remaining--;
      }
    }
  }
  return result;
}

// ---------------------------------------------------------------
// สร้างชุดการ์ด - เปิดด้วยบทเปิด, ตรงกลางสุ่มคละหมวด, ปิดด้วยความอบอุ่น (spec C6.3)
// ไม่มีตัวนับ "ใบที่ 5 จาก 40"
// ---------------------------------------------------------------
export function buildDeck(answers: Answers): Phrase[] {
  const fear = answers.fear;
  const condition = answers.condition;
  const matchesFear = (p: Phrase) =>
    fear && fear !== "unsure" ? (p.fears ?? []).includes(fear) : false;

  // ถ้าสื่อสารไม่ได้แล้ว → ใช้ชุด "พูดข้างเดียว" เป็นหลัก
  if (condition === "nonverbal") {
    const oneway = shuffle(PHRASES.filter((p) => p.category === "oneway"));
    const closing = shuffle(PHRASES.filter((p) => p.category === "closing"));
    return [...oneway, ...closing];
  }

  const openers = shuffle(PHRASES.filter((p) => p.stage === "open")).slice(0, 3);
  const light = PHRASES.filter((p) => p.stage === "light");
  const deepAll = PHRASES.filter(
    (p) => p.stage === "deep" && p.category !== "recovery",
  );
  const closing = shuffle(PHRASES.filter((p) => p.stage === "close"));

  // เตรียมชุดคำถามลึก: ถ้าเหนื่อยเร็วก็ลดจำนวน (เอาที่ตรงความกลัวไว้ก่อน)
  let deepPool = deepAll;
  if (condition === "tired" || condition === "sometimes") {
    const matched = shuffle(deepAll.filter(matchesFear));
    const rest = shuffle(deepAll.filter((p) => !matchesFear(p)));
    deepPool = [...matched, ...rest].slice(0, 10);
  }

  // ตรงกลาง = คำถามเบา + คำถามลึก คละหมวดกระจายกัน
  const middle = spreadByCategory([...light, ...deepPool], matchesFear);

  return [...openers, ...middle, ...closing.slice(0, 2)];
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
  const picked = shuffle(matched.length >= 2 ? matched : pool).slice(0, 2);
  const close = PHRASES.find((p) => p.id === "cl-1");
  return close ? [...picked, close] : picked;
}
