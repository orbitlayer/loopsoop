import Link from "next/link";
import { cn } from "@/lib/cn";

/* The real LOOPSOOP mark. It's a black silhouette (transparent background), so
   on dark surfaces we invert it to white via CSS. */
export function LoopMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/loopmark.png"
      alt=""
      aria-hidden
      className={className}
      draggable={false}
    />
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
      className={cn(
        "inline-flex items-center gap-2.5",
        onDark ? "text-white" : "text-ink",
        className,
      )}
    >
      <LoopMark className={cn("h-[22px] w-auto", onDark && "invert")} />
      {showWordmark && (
        <span className="font-display text-[1.15rem] font-semibold tracking-[0.14em]">
          LOOPSOOP
        </span>
      )}
    </Link>
  );
}
