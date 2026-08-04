import type { MetadataRoute } from "next";

// Web App Manifest - served at /manifest.webmanifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ก่อนจะลืมถาม - ถามตอนที่ยังถามได้",
    short_name: "ก่อนจะลืมถาม",
    description:
      "พื้นที่ปลอดภัยที่ช่วยให้คุณได้เริ่มบทสนทนากับคนที่คุณรัก ตอนที่ยังถามได้",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f5",
    theme_color: "#fbf8f5",
    lang: "th",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
