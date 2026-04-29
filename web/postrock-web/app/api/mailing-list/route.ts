import { NextResponse } from "next/server";
import { mailingListSchema } from "@/lib/validators";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { mailchimpConfigured, subscribeWithTags } from "@/lib/mailchimp";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`mailing:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = mailingListSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  if (!mailchimpConfigured()) {
    console.warn("[mailing-list] Mailchimp not configured — noop.");
    return NextResponse.json({ ok: true, mode: "noop" });
  }

  try {
    await subscribeWithTags(parsed.data.email, ["general-newsletter"]);
  } catch (e) {
    console.error("[mailing-list]", e);
    return NextResponse.json({ error: "Subscription failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
