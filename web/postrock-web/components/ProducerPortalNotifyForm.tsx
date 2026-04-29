"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { producerNotifySchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Form = z.infer<typeof producerNotifySchema>;

export function ProducerPortalNotifyForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<Form>({
    resolver: zodResolver(producerNotifySchema),
    defaultValues: { email: "", name: "" },
  });

  async function onSubmit(data: Form) {
    setStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/notify-producer-portal", {
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
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pp-name">Name (optional)</Label>
          <Input id="pp-name" autoComplete="name" {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pp-email">Email</Label>
          <Input id="pp-email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-700">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "…" : "Notify me"}
      </Button>
      {status === "success" ? (
        <p className="text-sm text-primary" role="status">
          You&apos;re on the list — we&apos;ll email you when the Producer Portal launches.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-700" role="alert">
          {errorMsg}
        </p>
      ) : null}
    </form>
  );
}
