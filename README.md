# ก่อนจะลืมถาม — ถามตอนที่ยังถามได้

พื้นที่ปลอดภัยสำหรับคนที่กำลังจะสูญเสียคนสำคัญ — บทเปิดที่ไม่เหมือนสั่งเสีย
คำถามที่คิดมาให้แล้ว และทางถอยเมื่อบทสนทนาไปผิดทาง

> "ฉันไม่จำเป็นต้องรีบ และฉันไม่ได้อยู่คนเดียว"

## หลักการ

- **เก็บในเครื่องเท่านั้น** — ทุกอย่างอยู่ใน `localStorage` ไม่มี backend ไม่มีการส่งข้อมูลออก (spec C11)
- **ไม่มี gamification** — ไม่มี progress bar / % / countdown (spec C1)
- **คอนเทนต์คือโปรดักต์** — คลังคำพูดกว่า 100 ประโยค tokenized สลับคำเรียก/คำแทนตัวตามความสัมพันธ์

## Flow

```
Landing → Questionnaire (4 ข้อ) → Conversation Cards → Meal → Memory → Letter · Resources
```

ตอบข้อ 2 ว่า "เขาจากไปแล้ว" → ข้ามไปหน้า Letter ทันที

## โครงสร้าง

| ที่อยู่ | หน้าที่ |
|---|---|
| `src/app/globals.css` | Design tokens ทั้งหมด (spec C2) |
| `src/lib/content.ts` | คลังคำพูด ส่วน B (หัวใจของโปรดักต์) |
| `src/lib/tokens.ts` | แทนคำ `{them}`/`{me}` + สร้างชุดการ์ด |
| `src/lib/store.tsx` | state + autosave ลง localStorage |
| `src/app/*/page.tsx` | แต่ละหน้าจอ |

## รัน

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # รัน production
```

Export PDF ใช้ print stylesheet (`@media print`) — กดปุ่ม "บันทึกเป็น PDF" แล้วสั่งพิมพ์เป็น PDF

## หมายเหตุ

MVP นี้ครอบคลุม Phase 1–4 ของ roadmap (Questionnaire, Cards, PDF, Meal, Memory อัดเสียง, Letter, Resources)
ก่อนขยายต่อ: เอาคลังคำพูด (ส่วน B) ไปให้คนที่เพิ่งสูญเสียอ่าน — คอนเทนต์ต้องมาก่อน UI
