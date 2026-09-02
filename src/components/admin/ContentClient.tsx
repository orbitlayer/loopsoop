"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  saveContentDraftAction,
  publishContentAction,
  discardContentDraftAction,
} from "@/lib/content-actions";
import { Button, IconButton, SmallButton, TextInput } from "./ui";

type Faq = { q: string; a: string };

/*
 * FAQ content editor (first CMS slice). Draft → Publish workflow:
 *   - Save draft  : persists work-in-progress (not live)
 *   - Preview     : saves the draft, then opens /contact?preview=1 (admin-only)
 *   - Publish     : pushes the current content to the live site (confirmed)
 *   - Discard     : reverts unpublished changes back to what's live (confirmed)
 * The public site falls back to built-in defaults if nothing is published.
 */
export function ContentClient({
  initialItems,
  publishedItems,
  updatedBy,
}: {
  initialItems: Faq[];
  publishedItems: Faq[];
  publishedAt: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}) {
  const [items, setItems] = useState<Faq[]>(initialItems);
  const [published, setPublished] = useState<Faq[]>(publishedItems);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<null | "publish" | "discard">(null);

  const dirty = useMemo(
    () => JSON.stringify(items) !== JSON.stringify(published),
    [items, published],
  );

  function update(i: number, field: keyof Faq, value: string) {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)),
    );
  }
  function add() {
    setItems((prev) => [...prev, { q: "", a: "" }]);
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: "up" | "down") {
    setItems((prev) => {
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function clean(list: Faq[]): Faq[] {
    return list
      .map((it) => ({ q: it.q.trim(), a: it.a.trim() }))
      .filter((it) => it.q || it.a);
  }

  async function saveDraft(): Promise<boolean> {
    setError(null);
    setNotice(null);
    setPending(true);
    const res = await saveContentDraftAction("faqs", clean(items));
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return false;
    }
    setNotice("Draft saved. It isn't live until you publish.");
    return true;
  }

  async function preview() {
    const ok = await saveDraft();
    if (ok) window.open("/contact?preview=1", "_blank", "noopener");
  }

  async function doPublish() {
    setError(null);
    setNotice(null);
    setPending(true);
    // Persist the on-screen content as the draft, then publish it live.
    const saved = await saveContentDraftAction("faqs", clean(items));
    if ("error" in saved) {
      setPending(false);
      setError(saved.error);
      return;
    }
    const res = await publishContentAction("faqs");
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setPublished(clean(items));
    setItems(clean(items));
    setConfirm(null);
    setNotice("Published — the FAQs are now live on the site.");
  }

  async function doDiscard() {
    setError(null);
    setNotice(null);
    setPending(true);
    const res = await discardContentDraftAction("faqs");
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setItems(published);
    setConfirm(null);
    setNotice("Discarded unpublished changes.");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-dark-muted">
          <FileText className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-medium tracking-[-0.02em] text-white">
              FAQs
            </h1>
            <span
              className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${
                dirty
                  ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30"
                  : "bg-white/[0.06] text-dark-muted ring-1 ring-white/10"
              }`}
            >
              {dirty ? "Unpublished changes" : "Published"}
            </span>
          </div>
          <p className="text-sm text-dark-faint">
            Shown on the Contact page.
            {updatedBy ? ` Last edited by ${updatedBy}.` : ""}
          </p>
        </div>
      </div>

      {notice && (
        <p className="mt-6 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white">
          {notice}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-9 text-center">
            <p className="text-sm text-dark-muted">No FAQs</p>
            <p className="mt-1 text-xs text-dark-faint">Add the first question.</p>
          </div>
        )}

        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.15em] text-dark-faint">
                Q{i + 1}
              </span>
              <div className="flex items-center gap-0.5">
                <IconButton
                  label="Move up"
                  disabled={i === 0 || pending}
                  onClick={() => move(i, "up")}
                >
                  <ChevronUp className="h-4 w-4" />
                </IconButton>
                <IconButton
                  label="Move down"
                  disabled={i === items.length - 1 || pending}
                  onClick={() => move(i, "down")}
                >
                  <ChevronDown className="h-4 w-4" />
                </IconButton>
                <IconButton label="Remove" danger onClick={() => remove(i)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              <TextInput
                value={item.q}
                onChange={(e) => update(i, "q", e.target.value)}
                placeholder="Question"
              />
              <textarea
                value={item.a}
                onChange={(e) => update(i, "a", e.target.value)}
                rows={3}
                placeholder="Answer"
                className="w-full rounded-xl border border-white/10 bg-dark-surface px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-dark-faint hover:border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>
        ))}

        <SmallButton variant="ghost" onClick={add} disabled={pending}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Add question
        </SmallButton>
      </div>

      {/* Action bar */}
      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
        <Button onClick={() => setConfirm("publish")} disabled={pending}>
          Publish
        </Button>
        <Button variant="ghost" onClick={saveDraft} disabled={pending}>
          Save draft
        </Button>
        <Button variant="ghost" onClick={preview} disabled={pending}>
          <Eye className="h-4 w-4" /> Preview
        </Button>
        {dirty && (
          <button
            type="button"
            onClick={() => setConfirm("discard")}
            disabled={pending}
            className="ml-auto text-sm text-dark-faint underline-offset-4 transition-colors hover:text-white hover:underline disabled:opacity-50"
          >
            Discard changes
          </button>
        )}
      </div>

      {/* Confirmation dialog */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => !pending && setConfirm(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[20px] border border-white/10 bg-dark-surface p-6 shadow-2xl shadow-black/50"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="font-display text-base font-medium tracking-[-0.02em] text-white">
              {confirm === "publish"
                ? "Publish FAQs to the live site?"
                : "Discard unpublished changes?"}
            </h2>
            <p className="mt-2 text-sm text-dark-muted">
              {confirm === "publish"
                ? "The current questions and answers will replace what visitors see on the Contact page."
                : "Your unpublished edits will be reverted to what's currently live."}
            </p>
            {error && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirm(null)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                variant={confirm === "discard" ? "danger" : "primary"}
                onClick={confirm === "publish" ? doPublish : doDiscard}
                disabled={pending}
              >
                {pending
                  ? "Working…"
                  : confirm === "publish"
                    ? "Publish"
                    : "Discard"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
