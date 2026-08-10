"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { adminPath } from "@/lib/admin-nav";
import { youtubeThumb, youtubeWatchUrl } from "@/lib/youtube";
import { VideoForm } from "./VideoForm";
import {
  ITEM_COLUMNS,
  type AdminCategory,
  type PortfolioItem,
  type VideoType,
} from "./types";

type FormState =
  | { mode: "add"; type: VideoType }
  | { mode: "edit"; item: PortfolioItem }
  | null;

export function DashboardClient({
  categories,
  adminEmail,
}: {
  categories: AdminCategory[];
  adminEmail: string | null;
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);

  const fetchItems = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    const { data, error: dbError } = await createClient()
      .from("portfolio_items")
      .select(ITEM_COLUMNS)
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });
    if (dbError) {
      setError("Could not load videos. Check your connection and try again.");
      setItems([]);
    } else {
      setItems((data ?? []) as PortfolioItem[]);
    }
    setLoading(false);
  }, [categoryId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const longform = useMemo(
    () => items.filter((i) => i.video_type === "long"),
    [items],
  );
  const shortform = useMemo(
    () => items.filter((i) => i.video_type === "short"),
    [items],
  );
  const nextSortOrder =
    items.reduce((max, i) => Math.max(max, i.sort_order), -1) + 1;

  async function toggleActive(item: PortfolioItem) {
    setBusyId(item.id);
    const { error: dbError } = await createClient()
      .from("portfolio_items")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    if (dbError) setError(dbError.message);
    await fetchItems();
    setBusyId(null);
  }

  async function move(item: PortfolioItem, dir: "up" | "down") {
    const siblings = item.video_type === "long" ? longform : shortform;
    const idx = siblings.findIndex((i) => i.id === item.id);
    const swap = siblings[dir === "up" ? idx - 1 : idx + 1];
    if (!swap) return;
    setBusyId(item.id);
    const supabase = createClient();
    const [r1, r2] = await Promise.all([
      supabase
        .from("portfolio_items")
        .update({ sort_order: swap.sort_order })
        .eq("id", item.id),
      supabase
        .from("portfolio_items")
        .update({ sort_order: item.sort_order })
        .eq("id", swap.id),
    ]);
    if (r1.error || r2.error)
      setError("Could not reorder. Please try again.");
    await fetchItems();
    setBusyId(null);
  }

  async function doDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setBusyId(id);
    const { error: dbError } = await createClient()
      .from("portfolio_items")
      .delete()
      .eq("id", id);
    if (dbError) setError(dbError.message);
    setDeleteTarget(null);
    await fetchItems();
    setBusyId(null);
  }

  async function logout() {
    await createClient().auth.signOut();
    router.replace(adminPath("/login"));
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0d]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <div className="flex items-baseline gap-2">
            <span className="font-logo text-lg font-bold tracking-tight text-white">
              Loopsoop
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-500">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            {adminEmail && (
              <span className="hidden text-xs text-neutral-500 sm:inline">
                {adminEmail}
              </span>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/5"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Portfolio Management
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Add, edit and order the videos shown on the public site.
            </p>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-neutral-400">
              Category
            </span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full min-w-[220px] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-white/40"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-8 space-y-10">
          <Section
            title="Long Form"
            items={longform}
            loading={loading}
            busyId={busyId}
            onAdd={() => setForm({ mode: "add", type: "long" })}
            onEdit={(item) => setForm({ mode: "edit", item })}
            onDelete={setDeleteTarget}
            onToggle={toggleActive}
            onMove={move}
          />
          <Section
            title="Short Form"
            items={shortform}
            loading={loading}
            busyId={busyId}
            onAdd={() => setForm({ mode: "add", type: "short" })}
            onEdit={(item) => setForm({ mode: "edit", item })}
            onDelete={setDeleteTarget}
            onToggle={toggleActive}
            onMove={move}
          />
        </div>
      </main>

      {form && (
        <VideoForm
          categories={categories}
          item={form.mode === "edit" ? form.item : null}
          defaultCategoryId={categoryId}
          defaultType={form.mode === "add" ? form.type : "long"}
          nextSortOrder={nextSortOrder}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            fetchItems();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this portfolio video?"
          body="This will remove it from the public portfolio. This cannot be undone."
          confirmLabel="Delete"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={doDelete}
        />
      )}
    </div>
  );
}

function Section({
  title,
  items,
  loading,
  busyId,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
  onMove,
}: {
  title: string;
  items: PortfolioItem[];
  loading: boolean;
  busyId: string | null;
  onAdd: () => void;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
  onToggle: (item: PortfolioItem) => void;
  onMove: (item: PortfolioItem, dir: "up" | "down") => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-300">
          {title}
          <span className="text-xs font-normal text-neutral-500">
            {items.length}
          </span>
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Add Video
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-[68px] animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-neutral-500">
          No {title.toLowerCase()} videos yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5"
            >
              <div className="relative h-11 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubeThumb(item.youtube_id)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {item.title}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                  <span className="truncate">
                    {item.subtitle || "—"}
                  </span>
                  <a
                    href={item.youtube_url || youtubeWatchUrl(item.youtube_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-neutral-400 hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3" /> open
                  </a>
                </div>
              </div>

              <button
                onClick={() => onToggle(item)}
                disabled={busyId === item.id}
                title={item.is_active ? "Published — click to hide" : "Hidden — click to publish"}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold transition-colors disabled:opacity-50 ${
                  item.is_active
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                    : "bg-white/10 text-neutral-400 hover:bg-white/20"
                }`}
              >
                {item.is_active ? "Published" : "Draft"}
              </button>

              <div className="flex shrink-0 items-center gap-0.5">
                <IconBtn
                  label="Move up"
                  disabled={i === 0 || busyId === item.id}
                  onClick={() => onMove(item, "up")}
                >
                  <ChevronUp className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="Move down"
                  disabled={i === items.length - 1 || busyId === item.id}
                  onClick={() => onMove(item, "down")}
                >
                  <ChevronDown className="h-4 w-4" />
                </IconBtn>
                <IconBtn label="Edit" onClick={() => onEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </IconBtn>
                <IconBtn
                  label="Delete"
                  onClick={() => onDelete(item)}
                  danger
                >
                  <Trash2 className="h-4 w-4" />
                </IconBtn>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors disabled:opacity-30 ${
        danger ? "hover:bg-red-500/15 hover:text-red-300" : "hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141416] p-6 shadow-2xl"
      >
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-neutral-400">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
