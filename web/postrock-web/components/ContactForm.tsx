"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CONTACT_TOPIC_OPTIONS, contactSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Form = z.infer<typeof contactSchema>;

export function ContactForm() {
  const searchParams = useSearchParams();
  const initialTopic = useMemo(() => {
    const raw = searchParams.get("topic")?.toLowerCase() ?? "";
    const map: Record<string, Form["topic"]> = {
      agronomy: "Agronomy",
      energy: "Energy",
      grain: "Grain",
      feed: "Feed and Supply",
      marketing: "Marketing",
      careers: "Careers",
      general: "General",
      other: "Other",
    };
    return map[raw] ?? "General";
  }, [searchParams]);

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<Form>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "General",
      message: "",
    },
  });

  useEffect(() => {
    form.setValue("topic", initialTopic);
  }, [initialTopic, form]);

  async function onSubmit(data: Form) {
    setStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("success");
      form.reset({
        ...data,
        message: "",
      });
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input id="contact-name" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-xs text-red-700">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-700">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input id="contact-phone" type="tel" autoComplete="tel" {...form.register("phone")} />
          {form.formState.errors.phone ? (
            <p className="text-xs text-red-700">{form.formState.errors.phone.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-topic">Topic</Label>
          <select
            id="contact-topic"
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            {...form.register("topic")}
          >
            {CONTACT_TOPIC_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {form.formState.errors.topic ? (
            <p className="text-xs text-red-700">{form.formState.errors.topic.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={6} {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-xs text-red-700">{form.formState.errors.message.message}</p>
        ) : null}
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending…" : "Send message"}
      </Button>

      {status === "success" ? (
        <p className="text-sm text-primary" role="status">
          Thanks — your message was sent. Our team will follow up shortly.
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
