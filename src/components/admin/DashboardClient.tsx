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
  Star,
  Clapperboard,
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

  const activeCategory = categories.find((c) => c.id === categoryId) ?? null;

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
    if (r1.error || r2.error) setError("Could not reorder. Please try again.");
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
    <div className="lg:pl-64">
      {/* ---------------------------------------------------------- Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/[0.06] bg-white/[0.015] backdrop-blur lg:flex">
        <div className="flex items-baseline gap-2 px-6 py-6">
          <span className="font-logo text-lg font-bold tracking-tight text-white">
            Loopsoop
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500">
            Admin
          </span>
        </div>

        <div className="px-4 pb-2">
          <p className="px-2 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-neutral-600">
            Categories
          </p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {categories.map((c) => {
            const active = c.id === categoryId;
            return (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-white/[0.08] font-medium text-white"
                    : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    active ? "bg-white" : "bg-neutral-600 group-hover:bg-neutral-400"
                  }`}
                />
                {c.name}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <div className="truncate px-3 pb-2 text-xs text-neutral-500">
            {adminEmail}
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* -------------------------------------------------- Mobile top bar */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#08080a]/85 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-baseline gap-2">
            <span className="font-logo text-base font-bold tracking-tight text-white">
              Loopsoop
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-neutral-500">
              Admin
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/5"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
        {/* Mobile category pills */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
          {categories.map((c) => {
            const active = c.id === categoryId;
            return (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "border border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </header>

      {/* -------------------------------------------------------- Main area */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300">
            <Clapperboard className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-medium tracking-tight text-white">
              {activeCategory?.name ?? "Portfolio"}
            </h1>
            <p className="text-sm text-neutral-500">
              {items.length} {items.length === 1 ? "video" : "videos"} · manage
              what appears on the public site
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <div className="mt-8 space-y-10">
          <Section
            title="Long Form"
            hint="16:9 landscape"
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
            hint="9:16 vertical"
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
  hint,
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
  hint: string;
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
        <h2 className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-white">{title}</span>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[0.65rem] font-medium text-neutral-400">
            {items.length}
          </span>
          <span className="text-xs text-neutral-600">{hint}</span>
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Add
        </button>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-[76px] animate-pulse rounded-2xl border border-white/[0.05] bg-white/[0.02]"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <button
          onClick={onAdd}
          className="flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed border-white/10 px-4 py-9 text-center transition-colors hover:border-white/25 hover:bg-white/[0.02]"
        >
          <span className="text-sm text-neutral-400">
            No {title.toLowerCase()} videos yet
          </span>
          <span className="text-xs text-neutral-600">
            Click to add the first one
          </span>
        </button>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li
              key={item.id}
              className={`group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15 hover:bg-white/[0.035] ${
                item.is_active ? "" : "opacity-60"
              }`}
            >
              <div className="relative aspect-video h-14 shrink-0 overflow-hidden rounded-lg bg-neutral-800 ring-1 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubeThumb(item.youtube_id)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {item.is_featured && (
                  <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-amber-300">
                    <Star className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {item.title}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                  {item.subtitle && (
                    <span className="truncate">{item.subtitle}</span>
                  )}
                  <a
                    href={item.youtube_url || youtubeWatchUrl(item.youtube_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-neutral-500 transition-colors hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3" /> open
                  </a>
                </div>
              </div>

              {/* Publish toggle (green = published, grey = draft) */}
              <Switch
                checked={item.is_active}
                disabled={busyId === item.id}
                onChange={() => onToggle(item)}
              />

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
                <IconBtn label="Delete" onClick={() => onDelete(item)} danger>
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

function Switch({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Published — click to hide" : "Draft — click to publish"}
      title={checked ? "Published — click to hide" : "Draft — click to publish"}
      className="hidden shrink-0 disabled:opacity-50 sm:block"
    >
      <span
        className={`relative block h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-emerald-500/80" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
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
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors disabled:opacity-25 ${
        danger
          ? "hover:bg-red-500/15 hover:text-red-300"
          : "hover:bg-white/10 hover:text-white"
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
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-300">
          <Trash2 className="h-5 w-5" />
        </div>
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
