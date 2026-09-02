import "server-only";
import { query } from "./db";
import { faqs as defaultFaqs } from "./data";

/*
 * CMS content layer (Phase 4). Editable website content lives in `content_blocks`
 * as JSON, each with a draft (work-in-progress) and a published (live) value.
 *
 * READ path (public site) is fail-safe + time-bounded: missing table, DB error,
 * slow DB, empty/invalid JSON all fall back to the built-in code defaults, so
 * the public site can never break from content. WRITE path is admin-only.
 */

export type Faq = { q: string; a: string };

function validateFaqs(raw: unknown): Faq[] {
  if (!Array.isArray(raw)) throw new Error("Expected a list of FAQs.");
  const out: Faq[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const q = String(rec.q ?? "").trim();
    const a = String(rec.a ?? "").trim();
    if (!q && !a) continue;
    out.push({ q, a });
  }
  return out;
}

/* ---------------------------------------------------------- contact.copy */
export type ContactCopy = {
  heroSubtitle: string;
  quoteHeading: string;
  quoteBody: string;
};

export const DEFAULT_CONTACT_COPY: ContactCopy = {
  heroSubtitle:
    "Have a project in mind? Message us on WhatsApp - tell us your vision and we'll send over a tailored quote, fast.",
  quoteHeading: "Get a quote on WhatsApp",
  quoteBody:
    "Skip the forms. Send us your project details - length, style and deadline - and we'll reply with a tailored quote, usually within a few hours.",
};

function str(v: unknown, fallback: string, max: number): string {
  const s = typeof v === "string" ? v.trim() : "";
  return (s || fallback).slice(0, max);
}

function validateContactCopy(raw: unknown): ContactCopy {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    heroSubtitle: str(r.heroSubtitle, DEFAULT_CONTACT_COPY.heroSubtitle, 2000),
    quoteHeading: str(r.quoteHeading, DEFAULT_CONTACT_COPY.quoteHeading, 300),
    quoteBody: str(r.quoteBody, DEFAULT_CONTACT_COPY.quoteBody, 2000),
  };
}

type BlockDef = {
  label: string;
  description: string;
  validate: (raw: unknown) => unknown;
};

/** Registry of editable content blocks. Add entries here as pages are migrated. */
export const CONTENT: Record<string, BlockDef> = {
  faqs: {
    label: "FAQs",
    description: "Questions & answers shown on the Contact page.",
    validate: validateFaqs,
  },
  "contact.copy": {
    label: "Contact page copy",
    description: "Hero subtitle and the WhatsApp quote section text.",
    validate: validateContactCopy,
  },
};

export function isContentKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(CONTENT, key);
}

/* ------------------------------------------------------------------ helpers */
function parse<T>(s: string | null | undefined): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const t = setTimeout(() => resolve(fallback), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (err) => {
        clearTimeout(t);
        console.error("[content] read failed (non-fatal, using defaults):", err);
        resolve(fallback);
      },
    );
  });
}

function safeValidateFaqs(raw: unknown, fallback: Faq[]): Faq[] {
  try {
    return validateFaqs(raw);
  } catch {
    return fallback;
  }
}

function safeValidate<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------- public reads */
/** Live FAQs for the public site. Falls back to code defaults. Never throws. */
export async function getFaqs(): Promise<Faq[]> {
  const def = defaultFaqs as Faq[];
  const rows = await withTimeout<{ published: string | null }[] | null>(
    query<{ published: string | null }>(
      "SELECT `published` FROM content_blocks WHERE `key` = 'faqs' LIMIT 1",
    ),
    2500,
    null,
  );
  const raw = parse<unknown>(rows?.[0]?.published);
  return raw == null ? def : safeValidateFaqs(raw, def);
}

/* --------------------------------------------------------------- admin reads */
export type FaqsEditable = {
  draft: Faq[];
  published: Faq[]; // effective live value (falls back to code default)
  hasDraft: boolean; // unpublished changes exist
  isCustom: boolean; // a custom published value exists (vs code default)
  updatedAt: string | null;
  updatedBy: string | null;
  publishedAt: string | null;
};

/** FAQs for the admin editor + preview. Graceful before the table exists. */
export async function getFaqsForEdit(): Promise<FaqsEditable> {
  const def = defaultFaqs as Faq[];
  try {
    const rows = await query<{
      draft: string | null;
      published: string | null;
      updated_at: string | null;
      updated_by: string | null;
      published_at: string | null;
    }>(
      "SELECT draft, published, updated_at, updated_by, published_at " +
        "FROM content_blocks WHERE `key` = 'faqs' LIMIT 1",
    );
    const row = rows[0];
    const publishedRaw = parse<unknown>(row?.published);
    const published = publishedRaw ? safeValidateFaqs(publishedRaw, def) : def;
    const draftRaw = parse<unknown>(row?.draft);
    const draft = draftRaw ? safeValidateFaqs(draftRaw, published) : published;
    return {
      draft,
      published,
      hasDraft: JSON.stringify(draft) !== JSON.stringify(published),
      isCustom: publishedRaw != null,
      updatedAt: row?.updated_at ?? null,
      updatedBy: row?.updated_by ?? null,
      publishedAt: row?.published_at ?? null,
    };
  } catch (err) {
    console.error("[content] getFaqsForEdit failed:", err);
    return {
      draft: def,
      published: def,
      hasDraft: false,
      isCustom: false,
      updatedAt: null,
      updatedBy: null,
      publishedAt: null,
    };
  }
}

/** Live contact-page copy for the public site. Falls back to code defaults. */
export async function getContactCopy(): Promise<ContactCopy> {
  const rows = await withTimeout<{ published: string | null }[] | null>(
    query<{ published: string | null }>(
      "SELECT `published` FROM content_blocks WHERE `key` = 'contact.copy' LIMIT 1",
    ),
    2500,
    null,
  );
  const raw = parse<unknown>(rows?.[0]?.published);
  if (raw == null) return DEFAULT_CONTACT_COPY;
  try {
    return validateContactCopy(raw);
  } catch {
    return DEFAULT_CONTACT_COPY;
  }
}

export type ContactCopyEditable = {
  draft: ContactCopy;
  published: ContactCopy;
  hasDraft: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
  publishedAt: string | null;
};

export async function getContactCopyForEdit(): Promise<ContactCopyEditable> {
  const def = DEFAULT_CONTACT_COPY;
  try {
    const rows = await query<{
      draft: string | null;
      published: string | null;
      updated_at: string | null;
      updated_by: string | null;
      published_at: string | null;
    }>(
      "SELECT draft, published, updated_at, updated_by, published_at " +
        "FROM content_blocks WHERE `key` = 'contact.copy' LIMIT 1",
    );
    const row = rows[0];
    const publishedRaw = parse<unknown>(row?.published);
    const published = publishedRaw
      ? safeValidate(() => validateContactCopy(publishedRaw), def)
      : def;
    const draftRaw = parse<unknown>(row?.draft);
    const draft = draftRaw
      ? safeValidate(() => validateContactCopy(draftRaw), published)
      : published;
    return {
      draft,
      published,
      hasDraft: JSON.stringify(draft) !== JSON.stringify(published),
      updatedAt: row?.updated_at ?? null,
      updatedBy: row?.updated_by ?? null,
      publishedAt: row?.published_at ?? null,
    };
  } catch (err) {
    console.error("[content] getContactCopyForEdit failed:", err);
    return {
      draft: def,
      published: def,
      hasDraft: false,
      updatedAt: null,
      updatedBy: null,
      publishedAt: null,
    };
  }
}

/* -------------------------------------------------------------- admin writes */
export async function saveDraft(
  key: string,
  value: unknown,
  updatedBy?: string | null,
): Promise<void> {
  if (!isContentKey(key)) throw new Error("Unknown content block.");
  const validated = CONTENT[key].validate(value);
  await query(
    "INSERT INTO content_blocks (`key`, draft, updated_by) VALUES (?, ?, ?) " +
      "ON DUPLICATE KEY UPDATE draft = VALUES(draft), updated_by = VALUES(updated_by)",
    [key, JSON.stringify(validated), updatedBy ?? null],
  );
}

export async function publishBlock(
  key: string,
  updatedBy?: string | null,
): Promise<void> {
  if (!isContentKey(key)) throw new Error("Unknown content block.");
  await query(
    "UPDATE content_blocks SET published = draft, published_at = CURRENT_TIMESTAMP, " +
      "updated_by = ? WHERE `key` = ? AND draft IS NOT NULL",
    [updatedBy ?? null, key],
  );
}

export async function discardDraft(
  key: string,
  updatedBy?: string | null,
): Promise<void> {
  if (!isContentKey(key)) throw new Error("Unknown content block.");
  await query(
    "UPDATE content_blocks SET draft = published, updated_by = ? WHERE `key` = ?",
    [updatedBy ?? null, key],
  );
}
