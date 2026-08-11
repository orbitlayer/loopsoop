"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Shared admin UI primitives. One source of truth for toggles, buttons, inputs
 * and selects so every control in the dashboard + modals is visually and
 * behaviourally consistent. Dark Loopsoop-admin visual language.
 */

/* ------------------------------------------------------------------ Switch */
export function Switch({
  checked,
  onChange,
  disabled,
  label,
  srLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
  srLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ? undefined : srLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full text-sm text-neutral-300 outline-none disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-white/30",
      )}
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors",
          checked ? "bg-emerald-500" : "bg-white/20",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </span>
      {label && <span className="whitespace-nowrap">{label}</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ Button */
type ButtonVariant = "primary" | "ghost" | "danger";

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-50";
const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-white text-black hover:bg-neutral-200",
  ghost: "border border-white/15 text-neutral-300 hover:bg-white/5 hover:text-white",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(BTN_BASE, "px-4 py-2", BTN_VARIANT[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

/** Compact button (e.g. the per-section "Add" action). */
export function SmallButton({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(BTN_BASE, "px-3 py-1.5 text-xs", BTN_VARIANT[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------- IconButton */
export function IconButton({
  label,
  danger,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-25",
        danger
          ? "hover:bg-red-500/15 hover:text-red-300"
          : "hover:bg-white/10 hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- Fields */
const CONTROL =
  "h-10 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 hover:border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/10";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={cn(CONTROL, props.className)} />;
}

export function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(CONTROL, "cursor-pointer appearance-none pr-9", className)}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}
