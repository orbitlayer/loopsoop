"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Search,
} from "lucide-react";
import {
  listItems,
  setActive,
  swapOrder,
  deleteItem,
  logoutAction,
} from "@/lib/actions";
import { extractDriveId, videoThumbnail } from "@/lib/video";
import { site } from "@/lib/data";
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
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close the profile menu on outside-click / Escape.
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const q = search.trim().toLowerCase();
  const isSearching = q.length > 0;
  const longform = useMemo(
    () =>
      items.filter(
        (i) =>
          i.video_type === "long" &&
          (!q ||
            i.title.toLowerCase().includes(q) ||
            (i.subtitle?.toLowerCase().includes(q) ?? false)),
      ),
    [items, q],
  );
  const shortform = useMemo(
    () =>
      items.filter(
        (i) =>
          i.video_type === "short" &&
          (!q ||
            i.title.toLowerCase().includes(q) ||
            (i.subtitle?.toLowerCase().includes(q) ?? false)),
      ),
    [items, q],
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

  const initial = (adminEmail?.trim()?.[0] ?? "A").toUpperCase();

  return (
    <div className="min-h-screen">
      {/* ----------------------------------------------------------- Top bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-dark/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6">
          <div className="flex items-baseline gap-2">
            <span className="font-logo text-lg font-bold tracking-[-0.02em] text-white">
              Loopsoop
            </span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-dark-faint">
              Admin
            </span>
          </div>

          {/* Search — filters the videos in the current category */}
          <div className="relative ml-1 hidden min-w-0 flex-1 sm:block sm:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-faint" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos in this category…"
              aria-label="Search videos"
              className="h-10 w-full rounded-full border border-white/10 bg-dark-surface pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-dark-faint hover:border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/10"
            />
          </div>

          {/* Profile menu */}
          <div className="relative ml-auto" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-2.5 text-sm text-dark-muted outline-none transition-colors hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-dark">
                {initial}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-white/10 bg-dark-surface p-1.5 shadow-2xl shadow-black/50"
              >
                <div className="px-3 py-2">
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-dark-faint">
                    Signed in as
                  </p>
                  <p className="mt-0.5 truncate text-sm text-white">
                    {adminEmail ?? "Admin"}
                  </p>
                </div>
                <div className="my-1 h-px bg-white/10" />
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-dark-muted outline-none transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06]"
                >
                  <ExternalLink className="h-4 w-4" /> View live site
                </a>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-dark-muted outline-none transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:bg-white/[0.06]"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        {/* --------------------------------------------------------- Sidebar */}
        <aside className="hidden border-r border-white/10 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <p className="px-6 pb-2 pt-6 text-[0.65rem] font-medium uppercase tracking-[0.15em] text-dark-faint">
            Portfolio Categories
          </p>
          <nav className="space-y-0.5 px-3 pb-6">
            {categories.map((c) => {
              const active = c.id === categoryId;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30 ${
                    active
                      ? "bg-white/[0.08] font-medium text-white"
                      : "text-dark-muted hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      active
                        ? "bg-white"
                        : "bg-dark-faint group-hover:bg-white/60"
                    }`}
                  />
                  {c.name}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ------------------------------------------------ Mobile category bar */}
        <div className="border-b border-white/10 lg:hidden">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
            {categories.map((c) => {
              const active = c.id === categoryId;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "bg-white text-dark"
                      : "border border-white/10 text-dark-muted hover:text-white"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------- Main area */}
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-1.5 text-xs text-dark-faint"
          >
            <span>Portfolio</span>
            <span aria-hidden>/</span>
            <span className="text-dark-muted">
              {activeCategory?.name ?? "All"}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-dark-muted">
              <Clapperboard className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-medium tracking-[-0.02em] text-white">
                {activeCategory?.name ?? "Portfolio"}
              </h1>
              <p className="text-sm text-dark-faint">
                {items.length} {items.length === 1 ? "video" : "videos"} · manage
                what appears on the public site
              </p>
            </div>
          </div>

          {/* Mobile search */}
          <div className="relative mt-6 sm:hidden">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-faint" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos…"
              aria-label="Search videos"
              className="h-11 w-full rounded-full border border-white/10 bg-dark-surface pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-dark-faint hover:border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/10"
            />
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
              searching={isSearching}
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
              searching={isSearching}
              onAdd={() => setForm({ mode: "add", type: "short" })}
              onEdit={(item) => setForm({ mode: "edit", item })}
              onDelete={setDeleteTarget}
              onToggle={toggleActive}
              onMove={move}
            />
          </div>
        </main>
      </div>

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
  searching,
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
  searching?: boolean;
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
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[0.65rem] font-medium text-dark-muted">
            {items.length}
          </span>
          <span className="hidden text-xs text-dark-faint sm:inline">{hint}</span>
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
        searching ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-9 text-center">
            <p className="text-sm text-dark-muted">No matching videos</p>
            <p className="mt-1 text-xs text-dark-faint">
              Try a different search term.
            </p>
          </div>
        ) : (
          <button
            onClick={onAdd}
            className="flex w-full flex-col items-center gap-1 rounded-2xl border border-dashed border-white/10 px-4 py-9 text-center outline-none transition-colors hover:border-white/25 hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span className="text-sm text-dark-muted">
              No {title.toLowerCase()} videos yet
            </span>
            <span className="text-xs text-dark-faint">
              Click to add the first one
            </span>
          </button>
        )
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
      className={`group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition-colors hover:border-white/20 hover:bg-white/[0.04] ${
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
        <p className="truncate text-sm font-medium text-white">
          {item.title?.trim() || item.subtitle?.trim() || "Untitled"}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-dark-faint">
          {item.subtitle && <span className="truncate">{item.subtitle}</span>}
          <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-dark-muted">
            {isDrive ? "Drive" : "YouTube"}
          </span>
          {openUrl && (
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-dark-faint transition-colors hover:text-white"
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
        srLabel={item.is_active ? "Shown on portfolio - click to hide" : "Hidden from portfolio - click to show"}
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
        className="w-full max-w-sm rounded-[20px] border border-white/10 bg-dark-surface p-6 shadow-2xl shadow-black/50"
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-300">
          <Trash2 className="h-5 w-5" />
        </div>
        <h2 className="font-display text-base font-medium tracking-[-0.02em] text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-dark-muted">{body}</p>
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
