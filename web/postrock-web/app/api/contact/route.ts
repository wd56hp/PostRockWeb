import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { getResend } from "@/lib/resend";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`contact:${ip}`, 15, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const resend = getResend();
  const to = process.env.CONTACT_TO_EMAIL ?? process.env.NEXT_PUBLIC_CONTACT_TO_EMAIL ?? "info@postrockag.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!resend) {
    console.warn("[contact] RESEND_API_KEY missing — accepting submission without send.");
    return NextResponse.json({ ok: true, mode: "noop" });
  }

  const subject = `[postrockag.com] Contact: ${data.topic} from ${data.name}`;
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    <p><strong>Topic:</strong> ${escapeHtml(data.topic)}</p>
    <hr />
    <pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(data.message)}</pre>
  `;

  await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject,
    html,
  });

  return NextResponse.json({ ok: true });
}
