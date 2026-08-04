import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/data";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

export function ProjectCard({
  project,
  showArrow = false,
  className,
}: {
  project: Project;
  showArrow?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[20px] border border-line/50 bg-dark",
        "transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <MediaPlaceholder
          seed={project.seed}
          vignette
          play
          className="transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div>
          <h3 className="font-display text-lg font-medium leading-tight text-white">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-white/60">{project.category}</p>
        </div>
        {showArrow && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors duration-300 group-hover:text-white">
            <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </span>
        )}
      </div>
    </article>
  );
}
