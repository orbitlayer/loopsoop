import { NextResponse } from "next/server";
import { site } from "@/lib/data";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  projectType?: string;
  message?: string;
  reference?: string;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message || !isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid fields." },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || site.email;

  // If no email provider is configured, accept the message so the UI works.
  // Wire up delivery by setting RESEND_API_KEY (and optionally CONTACT_TO_EMAIL).
  if (!apiKey) {
    console.info("[contact] Received (delivery not configured):", {
      name,
      email,
      projectType: body.projectType,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${site.name} <onboarding@resend.dev>`,
        to: [to],
        reply_to: email,
        subject: `New project enquiry — ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${body.company || "—"}`,
          `Phone: ${body.phone || "—"}`,
          `Project type: ${body.projectType || "—"}`,
          `Reference: ${body.reference || "—"}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[contact] Resend error:", detail);
      return NextResponse.json({ ok: false, error: "Delivery failed." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "Delivery failed." }, { status: 500 });
  }
}
