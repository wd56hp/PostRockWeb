import { NextResponse } from "next/server";
import { producerNotifySchema } from "@/lib/validators";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { mailchimpConfigured, subscribeWithTags } from "@/lib/mailchimp";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`producer-notify:${ip}`, 15, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = producerNotifySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  if (!mailchimpConfigured()) {
    console.warn("[notify-producer-portal] Mailchimp not configured — noop.");
    return NextResponse.json({ ok: true, mode: "noop" });
  }

  try {
    await subscribeWithTags(parsed.data.email, ["producer-portal-launch"]);
  } catch (e) {
    console.error("[notify-producer-portal]", e);
    return NextResponse.json({ error: "Notify signup failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
