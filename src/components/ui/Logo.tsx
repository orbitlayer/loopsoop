import Link from "next/link";

/* The LOOPSOOP mark: two interlocking loops (an infinity / chain link). */
export function LoopMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 26"
      fill="none"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path
        d="M22 13c-2.4-4.1-5.2-6.5-8.6-6.5C9.3 6.5 6.5 9.4 6.5 13S9.3 19.5 13.4 19.5c3.4 0 6.2-2.4 8.6-6.5Zm0 0c2.4-4.1 5.2-6.5 8.6-6.5C34.7 6.5 37.5 9.4 37.5 13S34.7 19.5 30.6 19.5c-3.4 0-6.2-2.4-8.6-6.5Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  onDark = false,
  showWordmark = true,
}: {
  className?: string;
  onDark?: boolean;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="LOOPSOOP — home"
      className={`inline-flex items-center gap-2.5 ${
        onDark ? "text-white" : "text-ink"
      } ${className ?? ""}`}
    >
      <LoopMark className="h-[22px] w-auto" />
      {showWordmark && (
        <span className="font-display text-[1.15rem] font-semibold tracking-[0.14em]">
          LOOPSOOP
        </span>
      )}
    </Link>
  );
}
