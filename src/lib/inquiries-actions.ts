"use server";

import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import {
  insertInquiry,
  updateInquiryStatus,
  updateInquiryNotes,
  updateInquiryRead,
  deleteInquiry,
  isInquiryStatus,
  type InquiryStatus,
} from "@/lib/inquiries";

/* ----------------------------------------------------------------- Public */
/*
 * Public contact-form submission. NOT admin-gated (visitors submit it). Input
 * is validated + length-capped, a honeypot field drops bots, and the write is
 * parameterized. Falls back to a friendly error (use WhatsApp) on any failure.
 */
export type SubmitState = { ok?: true; error?: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function clientIp(): Promise<string | null> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]?.trim() || null;
    return h.get("x-real-ip") || null;
  } catch {
    return null;
  }
}

export async function submitInquiryAction(
  _prev: SubmitState | undefined,
  formData: FormData,
): Promise<SubmitState> {
  // Honeypot — real users never fill this hidden field.
  if (String(formData.get("company_website") ?? "").trim()) {
    return { ok: true };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const projectType = String(formData.get("project_type") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in your name, email and a short message." };
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { error: "Please enter a valid email address." };
  }
  if (name.length > 200) return { error: "Please shorten your name." };
  if (message.length > 5000) return { error: "Please shorten your message." };

  try {
    await insertInquiry({
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      phone: phone ? phone.slice(0, 40) : null,
      project_type: projectType ? projectType.slice(0, 80) : null,
      message: message.slice(0, 5000),
      ip: await clientIp(),
    });
    await logAudit({
      actorEmail: email,
      action: "inquiry.received",
      resourceType: "inquiry",
      summary: `New inquiry from ${name}`,
    });
    return { ok: true };
  } catch (err) {
    console.error("[inquiry] submit failed:", err);
    return {
      error:
        "Sorry - we couldn't send your message just now. Please try again or reach us on WhatsApp.",
    };
  }
}

/* ------------------------------------------------------------------ Admin */
type Result = { ok: true } | { error: string };
const FAIL = "Could not update the inquiry. Please try again.";

export async function setInquiryStatusAction(
  id: string,
  status: string,
): Promise<Result> {
  const session = await requireAdmin();
  if (!isInquiryStatus(status)) return { error: "Unknown status." };
  try {
    await updateInquiryStatus(id, status as InquiryStatus);
    await logAudit({
      actorId: session.uid,
      actorEmail: session.email,
      action: "inquiry.status",
      resourceType: "inquiry",
      resourceId: id,
      summary: `Set inquiry status to "${status}"`,
    });
    return { ok: true };
  } catch (err) {
    console.error("[inquiry] status failed:", err);
    return { error: FAIL };
  }
}

export async function saveInquiryNotesAction(
  id: string,
  notes: string,
): Promise<Result> {
  const session = await requireAdmin();
  try {
    await updateInquiryNotes(id, notes.slice(0, 5000));
    await logAudit({
      actorId: session.uid,
      actorEmail: session.email,
      action: "inquiry.notes",
      resourceType: "inquiry",
      resourceId: id,
      summary: "Updated notes on an inquiry",
    });
    return { ok: true };
  } catch (err) {
    console.error("[inquiry] notes failed:", err);
    return { error: FAIL };
  }
}

export async function setInquiryReadAction(
  id: string,
  read: boolean,
): Promise<Result> {
  await requireAdmin();
  try {
    await updateInquiryRead(id, read);
    return { ok: true };
  } catch (err) {
    console.error("[inquiry] read failed:", err);
    return { error: FAIL };
  }
}

export async function deleteInquiryAction(id: string): Promise<Result> {
  const session = await requireAdmin();
  try {
    await deleteInquiry(id);
    await logAudit({
      actorId: session.uid,
      actorEmail: session.email,
      action: "inquiry.delete",
      resourceType: "inquiry",
      resourceId: id,
      summary: "Permanently deleted an inquiry",
    });
    return { ok: true };
  } catch (err) {
    console.error("[inquiry] delete failed:", err);
    return { error: FAIL };
  }
}
