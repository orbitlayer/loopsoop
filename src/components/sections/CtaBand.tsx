import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function CtaBand({
  label,
  title,
  subtitle,
  aside,
  buttonLabel,
  buttonHref = "/contact",
  dark = false,
  className,
}: {
  label?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  aside?: React.ReactNode;
  buttonLabel: string;
  buttonHref?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Container>
      <Reveal
        className={cn(
          "overflow-hidden rounded-[24px] px-7 py-10 md:px-14 md:py-14",
          dark
            ? "on-dark bg-dark text-white"
            : "border border-line bg-subtle text-ink",
          className,
        )}
      >
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            {label && (
              <SectionLabel onDark={dark} className="mb-4">
                {label}
              </SectionLabel>
            )}
            <h2 className="font-display text-3xl font-medium leading-[1.08] md:text-[2.75rem]">
              {title}
            </h2>
            {subtitle && (
              <p
                className={cn(
                  "mt-4 max-w-md text-base",
                  dark ? "text-dark-muted" : "text-muted",
                )}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start gap-7 md:items-end">
            {aside}
            <Button
              href={buttonHref}
              variant={dark ? "invert" : "primary"}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
