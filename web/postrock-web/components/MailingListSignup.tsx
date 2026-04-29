"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mailingListSchema } from "@/lib/validators";
import type { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Form = z.infer<typeof mailingListSchema>;

export function MailingListSignup({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<Form>({
    resolver: zodResolver(mailingListSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: Form) {
    setStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("success");
      form.reset();
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className={variant === "compact" ? "" : "rounded-lg border border-border bg-muted/40 p-4"}>
      {variant === "full" ? (
        <p className="mb-3 text-sm font-medium text-primary">Subscribe for company updates</p>
      ) : null}
      <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex-1 space-y-2">
          <Label htmlFor={`nl-email-${variant}`} className="sr-only">
            Email
          </Label>
          <Input
            id={`nl-email-${variant}`}
            type="email"
            autoComplete="email"
            placeholder="you@farm.com"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-700">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "…" : "Subscribe"}
        </Button>
      </form>
      {status === "success" ? (
        <p className="mt-2 text-xs text-primary" role="status">
          Thanks — check your inbox to confirm (when Mailchimp double opt-in is enabled).
        </p>
      ) : null}
      {status === "error" ? (
        <p className="mt-2 text-xs text-red-700" role="alert">
          {errorMsg}
        </p>
      ) : null}
    </div>
  );
}
