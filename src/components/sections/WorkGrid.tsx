"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects, workFilters } from "@/lib/data";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/sections/ProjectCard";

export function WorkGrid() {
  const [active, setActive] = useState<string>("All Work");

  const filtered =
    active === "All Work"
      ? projects
      : projects.filter((p) => p.filter === active);

  return (
    <section className="pb-8">
      <Container>
        {/* Filters */}
        <div className="no-scrollbar -mx-6 flex gap-7 overflow-x-auto border-b border-line px-6 pb-4 md:mx-0 md:px-0">
          {workFilters.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
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
              </button>
            );
          })}
        </div>

        {/* Grid */}
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
      </Container>
    </section>
  );
}
