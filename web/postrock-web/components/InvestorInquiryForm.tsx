"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { investorInquirySchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Form = z.infer<typeof investorInquirySchema>;

export function InvestorInquiryForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const form = useForm<Form>({
    resolver: zodResolver(investorInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      message: "",
    },
  });

  async function onSubmit(data: Form) {
    setStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/investor-inquiry", {
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
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inv-name">Name</Label>
          <Input id="inv-name" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-xs text-red-700">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-email">Email</Label>
          <Input id="inv-email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-700">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inv-phone">Phone (optional)</Label>
          <Input id="inv-phone" type="tel" autoComplete="tel" {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-org">Organization</Label>
          <Input id="inv-org" {...form.register("organization")} />
          {form.formState.errors.organization ? (
            <p className="text-xs text-red-700">{form.formState.errors.organization.message}</p>
          ) : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inv-msg">Message</Label>
        <Textarea id="inv-msg" rows={6} {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-xs text-red-700">{form.formState.errors.message.message}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending…" : "Submit inquiry"}
      </Button>
      {status === "success" ? (
        <p className="text-sm text-primary" role="status">
          Thank you. If your inquiry fits our qualification process, our team will follow up.
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
