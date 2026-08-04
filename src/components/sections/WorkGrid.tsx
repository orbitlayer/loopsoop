"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { categoryNameToSlug, projects, workFilters } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/sections/ProjectCard";

export function WorkGrid({
  initialCategory = "All Work",
  className,
}: {
  initialCategory?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(initialCategory);

  const filtered =
    active === "All Work"
      ? projects
      : projects.filter((p) => p.filter === active);

  // The active filter is always rendered first, so a deep-linked category
  // (e.g. arriving from Our Editing) appears at the front of the bar and is
  // immediately visible without scrolling.
  const orderedFilters =
    active === "All Work"
      ? workFilters
      : [active, ...workFilters.filter((f) => f !== active)];

  const handleFilter = (name: string) => {
    setActive(name);
    scrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    // Reflect the active filter in the URL (?category=slug) without adding a
    // history entry — Back returns to the previous page (e.g. Our Editing),
    // and the filtered view stays shareable / deep-linkable.
    const slug = name === "All Work" ? null : categoryNameToSlug(name);
    router.replace(slug ? `${pathname}?category=${slug}` : pathname, {
      scroll: false,
    });
  };

  return (
    <section className={cn("pb-8", className)}>
      <Container>
        {/* Filters */}
        <div
          ref={scrollerRef}
          className="no-scrollbar -mx-6 flex gap-7 overflow-x-auto border-b border-line px-6 pb-4 md:mx-0 md:px-0"
        >
          {orderedFilters.map((f) => {
            const isActive = active === f;
            return (
              <motion.button
                key={f}
                layout
                type="button"
                onClick={() => handleFilter(f)}
                aria-pressed={isActive}
                className={cn(
                  "relative shrink-0 pb-1 text-sm transition-colors",
                  isActive ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {f}
                {isActive && (
                  <motion.span
                    layoutId="work-filter-underline"
                    className="absolute -bottom-[17px] left-0 h-px w-full bg-ink"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={p} showArrow />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <p className="mt-16 text-center text-muted">
            No projects in this category yet — check back soon.
          </p>
        )}
      </Container>
    </section>
  );
}
