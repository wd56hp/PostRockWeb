"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

export function EmployeePortalClient() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.assign(siteConfig.employeePortalUrl);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <h1 className="font-heading text-3xl font-semibold text-primary">Employee login</h1>
      <p className="text-foreground/80">Redirecting to Microsoft sign-in…</p>
      <p className="text-sm text-foreground/70">
        If you are not redirected, use the{" "}
        <Link href={siteConfig.employeePortalUrl} className="font-medium text-primary underline">
          manual link to SharePoint
        </Link>
        .
      </p>
    </div>
  );
}
