"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { extractYouTubeId, youtubeThumb, youtubeWatchUrl } from "@/lib/youtube";
import type { AdminCategory, PortfolioItem, VideoType } from "./types";

/* Add / edit a portfolio video. Handles its own Supabase insert/update; calls
   onSaved() so the dashboard can refetch. RLS ensures only admins can write. */
export function VideoForm({
  categories,
  item,
  defaultCategoryId,
  defaultType,
  nextSortOrder,
  onClose,
  onSaved,
}: {
  categories: AdminCategory[];
  item: PortfolioItem | null; // null = create
  defaultCategoryId: string;
  defaultType: VideoType;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = Boolean(item);
  const [title, setTitle] = useState(item?.title ?? "");
  const [url, setUrl] = useState(item?.youtube_url ?? "");
  const [subtitle, setSubtitle] = useState(item?.subtitle ?? "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? defaultCategoryId);
  const [videoType, setVideoType] = useState<VideoType>(item?.video_type ?? defaultType);
  const [order, setOrder] = useState<number>(item?.sort_order ?? nextSortOrder);
  const [isActive, setIsActive] = useState(item?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const previewId = extractYouTubeId(url);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    const youtubeId = extractYouTubeId(url);
    if (!youtubeId) {
      setError(
        "Enter a valid YouTube URL (watch, youtu.be, embed or shorts link).",
      );
      return;
    }

    setPending(true);
    const supabase = createClient();
    const payload = {
      category_id: categoryId,
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      youtube_id: youtubeId,
      youtube_url: youtubeWatchUrl(youtubeId),
      video_type: videoType,
      sort_order: Number.isFinite(order) ? order : nextSortOrder,
      is_active: isActive,
      is_featured: isFeatured,
    };

    const { error: dbError } = editing
      ? await supabase.from("portfolio_items").update(payload).eq("id", item!.id)
      : await supabase.from("portfolio_items").insert(payload);

    if (dbError) {
      setError(dbError.message || "Could not save. Please try again.");
      setPending(false);
      return;
    }

    onSaved();
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm transition-opacity duration-200 sm:items-center ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "Edit video" : "Add video"}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className={`my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#141417] p-6 shadow-2xl transition-all duration-200 ${
          mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <h2 className="font-display text-lg font-medium text-white">
          {editing ? "Edit video" : "Add video"}
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          Paste a YouTube link — the thumbnail and player are generated for you.
        </p>

        <div className="mt-5 space-y-4">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Documentary Editing Sample 01"
              className={inputCls}
              autoFocus
            />
          </Field>

          <Field label="YouTube URL">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className={inputCls}
            />
            {url.trim() && (
              <div className="mt-2.5">
                {previewId ? (
                  <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={youtubeThumb(previewId)}
                      alt=""
                      className="h-10 w-[71px] rounded object-cover"
                    />
                    <span className="text-xs text-emerald-300">
                      Valid video
                      <span className="ml-1 text-emerald-500/70">{previewId}</span>
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-amber-400">
                    Not a recognizable YouTube link yet.
                  </p>
                )}
              </div>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <SelectWrap>
                <select
                  value={videoType}
                  onChange={(e) => setVideoType(e.target.value as VideoType)}
                  className={selectCls}
                >
                  <option value="long">Long Form</option>
                  <option value="short">Short Form</option>
                </select>
              </SelectWrap>
            </Field>
            <Field label="Category">
              <SelectWrap>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={selectCls}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </SelectWrap>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Subtitle (optional)">
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Travel Documentary"
                className={inputCls}
              />
            </Field>
            <Field label="Order">
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10))}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Toggle label="Published" checked={isActive} onChange={setIsActive} />
            <Toggle
              label="Featured on home"
              checked={isFeatured}
              onChange={setIsFeatured}
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Saving…" : editing ? "Save changes" : "Add video"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-white/40 focus:ring-2 focus:ring-white/10";

const selectCls =
  "w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 pr-9 text-sm text-white outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/10";

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-neutral-300 transition-colors hover:border-white/20"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-emerald-500/80" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}
