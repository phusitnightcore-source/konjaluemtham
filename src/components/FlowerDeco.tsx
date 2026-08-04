// รูปดอกไม้ตกแต่ง (watercolor จริงจาก public/flower) - ใช้ตกแต่งมุมต่างๆ

export default function FlowerDeco({
  name,
  className = "",
  style,
  size = 90,
  float = false,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  float?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flower/${name}.png`}
      alt=""
      aria-hidden
      draggable={false}
      loading="lazy"
      className={`flower-deco ${float ? "float" : ""} ${className}`}
      style={{ width: size, height: "auto", ...style }}
    />
  );
}
