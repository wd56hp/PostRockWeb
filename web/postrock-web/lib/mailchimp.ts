import crypto from "crypto";
import mailchimp from "@mailchimp/mailchimp_marketing";

function md5Hex(value: string): string {
  return crypto.createHash("md5").update(value.toLowerCase()).digest("hex");
}

export function mailchimpConfigured(): boolean {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!apiKey || !listId) return false;
  mailchimp.setConfig({
    apiKey,
    server: process.env.MAILCHIMP_DC ?? "us21",
  });
  return true;
}

/** Upsert subscriber and apply tags (merge-safe). */
export async function subscribeWithTags(email: string, tags: string[]) {
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!listId || !mailchimpConfigured()) {
    throw new Error("Mailchimp not configured");
  }

  const hash = md5Hex(email);
  await mailchimp.lists.setListMember(listId, hash, {
    email_address: email,
    status_if_new: "subscribed",
  });

  await mailchimp.lists.updateListMemberTags(listId, hash, {
    tags: tags.map((name) => ({ name, status: "active" as const })),
  });
}
