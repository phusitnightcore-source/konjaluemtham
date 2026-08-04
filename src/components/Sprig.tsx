// ลายดอกไม้ประดับเล็กๆ (baby's breath) - วาดเอง ไม่ใช้รูปนอก

export default function Sprig({
  className,
  size = 46,
  style,
}: {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden
    >
      {/* ก้าน */}
      <path
        d="M30 56 C30 40 26 30 20 20 M30 44 C30 40 34 34 40 28 M30 34 C30 30 24 26 18 30"
        stroke="#c7b39d"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* ดอกเล็กๆ */}
      {[
        [20, 18],
        [40, 26],
        [18, 30],
        [30, 12],
        [44, 34],
        [26, 24],
        [34, 20],
      ].map(([cx, cy], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <circle
                key={a}
                cx={cx + Math.cos(r) * 3.1}
                cy={cy + Math.sin(r) * 3.1}
                r="2.1"
                fill="currentColor"
                opacity="0.9"
              />
            );
          })}
          <circle cx={cx} cy={cy} r="1.6" fill="#dcc38f" />
        </g>
      ))}
    </svg>
  );
}
