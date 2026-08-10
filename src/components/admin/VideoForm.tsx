"use client";

import { useState } from "react";
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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "Edit video" : "Add video"}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="my-8 w-full max-w-lg rounded-2xl border border-white/10 bg-[#141416] p-6 shadow-2xl"
      >
        <h2 className="text-lg font-semibold text-white">
          {editing ? "Edit video" : "Add video"}
        </h2>

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
            {url.trim() &&
              (previewId ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={youtubeThumb(previewId)}
                    alt=""
                    className="h-9 w-16 rounded object-cover"
                  />
                  Valid video · {previewId}
                </div>
              ) : (
                <p className="mt-1.5 text-xs text-amber-400">
                  Not a recognizable YouTube link yet.
                </p>
              ))}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value as VideoType)}
                className={inputCls}
              >
                <option value="long">Long Form</option>
                <option value="short">Short Form</option>
              </select>
            </Field>
            <Field label="Category">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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

          <div className="flex flex-wrap gap-5 pt-1">
            <Checkbox
              label="Published"
              checked={isActive}
              onChange={setIsActive}
            />
            <Checkbox
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
  "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-white/40";

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

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-black/30 accent-white"
      />
      {label}
    </label>
  );
}
