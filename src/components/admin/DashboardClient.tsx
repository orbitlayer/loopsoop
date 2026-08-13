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
import {
  listItems,
  setActive,
  swapOrder,
  deleteItem,
  logoutAction,
} from "@/lib/actions";
import { extractDriveId, videoThumbnail } from "@/lib/video";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { VideoForm } from "./VideoForm";
import { Button, IconButton, SmallButton, Switch } from "./ui";
import {
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
    try {
      setItems(await listItems(categoryId));
    } catch {
      setError("Could not load videos. Check your connection and try again.");
      setItems([]);
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
    try {
      await setActive(item.id, !item.is_active);
    } catch {
      setError("Could not update. Please try again.");
    }
    await fetchItems();
    setBusyId(null);
  }

  async function move(item: PortfolioItem, dir: "up" | "down") {
    const siblings = item.video_type === "long" ? longform : shortform;
    const idx = siblings.findIndex((i) => i.id === item.id);
    const swap = siblings[dir === "up" ? idx - 1 : idx + 1];
    if (!swap) return;
    setBusyId(item.id);
    try {
      await swapOrder(item.id, item.sort_order, swap.id, swap.sort_order);
    } catch {
      setError("Could not reorder. Please try again.");
    }
    await fetchItems();
    setBusyId(null);
  }

  async function doDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setBusyId(id);
    try {
      await deleteItem(id);
    } catch {
      setError("Could not delete. Please try again.");
    }
    setDeleteTarget(null);
    await fetchItems();
    setBusyId(null);
  }

  async function logout() {
    await logoutAction();
    router.replace("/admin/login");
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

        <p className="px-6 pb-2 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-neutral-600">
          Categories
        </p>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {categories.map((c) => {
            const active = c.id === categoryId;
            return (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30 ${
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
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-400 outline-none transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:ring-2 focus-visible:ring-white/30"
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
          <SmallButton variant="ghost" onClick={logout}>
            <LogOut className="h-3.5 w-3.5" /> Logout
          </SmallButton>
        </div>
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
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-neutral-300">
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
          <span className="hidden text-xs text-neutral-600 sm:inline">{hint}</span>
        </h2>
        <SmallButton onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Add
        </SmallButton>
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
          className="flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed border-white/10 px-4 py-9 text-center outline-none transition-colors hover:border-white/25 hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-white/30"
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
            <Row
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              busy={busyId === item.id}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item)}
              onToggle={() => onToggle(item)}
              onMove={(dir) => onMove(item, dir)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function Row({
  item,
  index,
  total,
  busy,
  onEdit,
  onDelete,
  onToggle,
  onMove,
}: {
  item: PortfolioItem;
  index: number;
  total: number;
  busy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const isDrive = item.video_provider === "google_drive";
  const thumb = videoThumbnail({
    provider: item.video_provider,
    youtubeId: item.youtube_id ?? undefined,
    driveId: isDrive ? extractDriveId(item.video_url) ?? undefined : undefined,
    thumbnailUrl: item.thumbnail_url ?? undefined,
  });
  const openUrl = item.video_url || item.youtube_url || undefined;

  return (
    <li
      className={`group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 transition-colors hover:border-white/15 hover:bg-white/[0.035] ${
        item.is_active ? "" : "opacity-60"
      }`}
    >
      <div className="relative aspect-video h-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
        <MediaPlaceholder src={thumb} seed={index + 1} />
        {item.is_featured && (
          <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-amber-300">
            <Star className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{item.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
          {item.subtitle && <span className="truncate">{item.subtitle}</span>}
          <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-neutral-400">
            {isDrive ? "Drive" : "YouTube"}
          </span>
          {openUrl && (
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-neutral-500 transition-colors hover:text-white"
            >
              <ExternalLink className="h-3 w-3" /> open
            </a>
          )}
        </div>
      </div>

      <Switch
        checked={item.is_active}
        disabled={busy}
        onChange={onToggle}
        srLabel={item.is_active ? "Published — click to hide" : "Draft — click to publish"}
      />

      <div className="flex shrink-0 items-center gap-0.5">
        <IconButton
          label="Move up"
          disabled={index === 0 || busy}
          onClick={() => onMove("up")}
        >
          <ChevronUp className="h-4 w-4" />
        </IconButton>
        <IconButton
          label="Move down"
          disabled={index === total - 1 || busy}
          onClick={() => onMove("down")}
        >
          <ChevronDown className="h-4 w-4" />
        </IconButton>
        <IconButton label="Edit" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </IconButton>
        <IconButton label="Delete" onClick={onDelete} danger>
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
    </li>
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
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
