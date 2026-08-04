// ก่อนจะลืมถาม - shared types

export type RelationshipId =
  | "mother"
  | "father"
  | "partner"
  | "child"
  | "friend"
  | "grandpa"
  | "grandma"
  | "granddad"
  | "grandmom"
  | "other";

export type ConditionId =
  | "normal" // คุยได้ปกติ
  | "tired" // คุยได้แต่เหนื่อยเร็ว
  | "sometimes" // คุยได้บ้างไม่ได้บ้าง
  | "nonverbal" // สื่อสารไม่ได้แล้ว
  | "gone"; // เขาจากไปแล้ว

export type TimeId = "months" | "weeks" | "days" | "unknown";

export type FearId =
  | "love" // กลัวไม่ได้บอกว่ารักเขา
  | "anger" // กลัวยังโกรธกันอยู่ / ยังไม่ได้ขอโทษ
  | "know" // กลัวจะไม่รู้จักเขาจริงๆ สักที
  | "practical" // กลัวเรื่องปฏิบัติจะยุ่ง
  | "regret" // กลัวเสียใจแล้วไม่ได้ทำอะไรเลย
  | "unsure"; // ยังไม่รู้

// หมวดคำพูด (spec B1–B12)
export type Category =
  | "opener" // B1 บทเปิด
  | "memory" // B2 ความทรงจำ
  | "person" // B3 รู้จักเขาในฐานะคน
  | "thanks" // B4 ขอบคุณ
  | "apology" // B5 ขอโทษ/ขอขมา/ให้อภัย
  | "love" // B6 รักนะ
  | "worries" // B7 เรื่องที่เขาห่วง
  | "practical" // B8 เรื่องปฏิบัติ
  | "light" // B9 คำถามเบาๆ
  | "oneway" // B10 พูดข้างเดียว
  | "recovery" // B11 กู้สถานการณ์
  | "closing"; // B11 ปิดท้าย

// ตำแหน่งในบทสนทนา (spec C6.4 meal timeline)
export type Stage = "open" | "light" | "deep" | "close";

export interface Phrase {
  id: string;
  category: Category;
  text: string; // tokenized ด้วย {them} / {me}
  stage: Stage;
  fears?: FearId[]; // ตรงกับความกลัวข้อ 4 ข้อไหนบ้าง
  note?: string; // คำแนะนำเล็กๆ ใต้การ์ด (ไม่ tokenized)
}

export interface Answers {
  relationship: RelationshipId | null;
  relationshipCustom?: string; // สำหรับ "อื่นๆ"
  self: string | null; // คำแทนตัวผู้ใช้ ({me}) เช่น หนู / ผม / ดิฉัน / เรา
  condition: ConditionId | null;
  time: TimeId | null;
  fear: FearId | null;
}

export type CardAction = "kept" | "skipped";

export interface KeptCard {
  id: string;
  text: string; // เก็บข้อความที่ substitute แล้ว
  category: Category;
  ownNote?: string; // "เขียนเอง"
}

export interface AppState {
  answers: Answers;
  seen: string[]; // id ที่เห็นแล้ว (kept หรือ skipped)
  kept: KeptCard[]; // อยู่ในกระเป๋า
  meal: {
    where: string | null;
    who: string;
    when: string | null;
    bring: string[]; // checklist ids
  };
  memory: {
    notes: Record<string, string>; // phraseId -> คำตอบที่พิมพ์
  };
  letter: string;
  updatedAt: number | null;
}
