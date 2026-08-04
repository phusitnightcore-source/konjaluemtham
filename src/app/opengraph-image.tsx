import { ImageResponse } from "next/og";

export const alt = "ก่อนจะลืมถาม - ถามตอนที่ยังถามได้";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// OG image เป็นภาพกราฟิกล้วน (ไม่มีข้อความไทย) - หัวข้อ/คำอธิบายไทยมาจาก metadata
export default function OpengraphImage() {
  const petals = [0, 60, 120, 180, 240, 300];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fbf8f5 0%, #f4e8db 55%, #efe0cf 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 240,
            height: 240,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {petals.map((a) => (
            <div
              key={a}
              style={{
                position: "absolute",
                width: 78,
                height: 132,
                background: "#e3b7ab",
                borderRadius: "50%",
                transform: `rotate(${a}deg) translateY(-50px)`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#dcc38f",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 40,
            letterSpacing: 6,
            color: "#8a5a3c",
            textTransform: "uppercase",
          }}
        >
          luemtham
        </div>
        <div style={{ marginTop: 10, fontSize: 26, color: "#6e625d" }}>
          ask while you still can
        </div>
      </div>
    ),
    size,
  );
}
