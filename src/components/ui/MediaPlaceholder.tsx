import { Play } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Media block. If `src` is provided it renders that image (e.g. a YouTube
 * thumbnail); otherwise it renders a self-contained, on-brand monochrome
 * placeholder that varies deterministically by `seed`.
 */
export function MediaPlaceholder({
  seed = 0,
  className,
  vignette = false,
  play = false,
  playSize = "md",
  src,
  alt,
  imgClassName,
  children,
}: {
  seed?: number;
  className?: string;
  vignette?: boolean;
  play?: boolean;
  playSize?: "sm" | "md" | "lg";
  src?: string;
  alt?: string;
  imgClassName?: string;
  children?: React.ReactNode;
}) {
  const hx = (seed * 41) % 100;
  const hy = (seed * 67) % 100;
  const playDims = {
    sm: "h-11 w-11",
    md: "h-14 w-14",
    lg: "h-20 w-20",
  }[playSize];

  return (
    <div
      className={cn(
        src
          ? "relative h-full w-full overflow-hidden bg-black"
          : "media h-full w-full",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            imgClassName,
          )}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(55% 55% at ${hx}% ${hy}%, rgba(255,255,255,0.08), transparent 70%)`,
          }}
        />
      )}
      {vignette && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      )}
      {play && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              "flex items-center justify-center rounded-full border border-white/70 bg-black/20 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110",
              playDims,
            )}
          >
            <Play
              className="h-1/3 w-1/3 translate-x-[1px]"
              fill="currentColor"
              strokeWidth={0}
              aria-hidden
            />
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
