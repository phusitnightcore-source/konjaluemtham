// ไอคอนความทรงจำ - bookmark + หัวใจ (แทนอีโมจิกระเป๋าเดิม)

export default function MemoryIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
      <path d="M12 8.4c-.9-1.3-3-.9-3 .7 0 1.3 1.7 2.3 3 3.3 1.3-1 3-2 3-3.3 0-1.6-2.1-2-3-.7z" />
    </svg>
  );
}
