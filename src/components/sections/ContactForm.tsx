"use client";

import { useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, Upload } from "lucide-react";
import { projectTypes } from "@/lib/data";
import { cn } from "@/lib/cn";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder:text-white/40 transition-colors focus:border-white/30 focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      phone: String(data.get("phone") || ""),
      projectType: String(data.get("projectType") || ""),
      message: String(data.get("message") || ""),
      reference: fileName ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
      setFileName(null);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.03] p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink">
          <Check className="h-7 w-7" strokeWidth={2} />
        </span>
        <h3 className="mt-6 font-display text-2xl font-medium text-white">
          Message sent.
        </h3>
        <p className="mt-3 max-w-sm text-sm text-dark-muted">
          Thanks for reaching out — we&apos;ll get back to you within 24 hours.
          Check your inbox for a confirmation.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-white underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full Name" className={field} aria-label="Full Name" />
        <input name="email" type="email" required placeholder="Email Address" className={field} aria-label="Email Address" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="company" placeholder="Company / Brand (Optional)" className={field} aria-label="Company or Brand" />
        <input name="phone" type="tel" placeholder="Phone Number" className={field} aria-label="Phone Number" />
      </div>

      <div className="relative">
        <select
          name="projectType"
          required
          defaultValue=""
          aria-label="Project Type"
          className={cn(field, "appearance-none pr-10 text-white/70 [&:valid]:text-white")}
        >
          <option value="" disabled hidden>
            Project Type
          </option>
          {projectTypes.map((t) => (
            <option key={t} value={t} className="text-ink">
              {t}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
      </div>

      <textarea
        name="message"
        required
        rows={4}
        placeholder="Tell us about your project"
        className={cn(field, "resize-none")}
        aria-label="Project description"
      />

      {/* Reference upload */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-4 text-left transition-colors hover:border-white/30"
      >
        <span className="flex items-center gap-3">
          <Upload className="h-5 w-5 text-white/60" strokeWidth={1.5} />
          <span className="text-sm">
            <span className="block text-white/90">
              {fileName ?? "Upload Reference (Optional)"}
            </span>
            <span className="block text-xs text-white/40">
              Drag &amp; drop or click to upload
            </span>
          </span>
        </span>
        <span className="hidden text-xs text-white/40 sm:block">
          PNG, JPG, MP4 · max 50MB
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".png,.jpg,.jpeg,.mp4"
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />

      {status === "error" && (
        <p className="text-sm text-red-300">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
      </button>
    </form>
  );
}
