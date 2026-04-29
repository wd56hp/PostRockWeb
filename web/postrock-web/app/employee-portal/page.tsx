import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { EmployeePortalClient } from "@/components/EmployeePortalClient";

export const metadata: Metadata = buildMetadata({
  title: "Employee Portal",
  description: "Redirect to Post Rock Ag SharePoint employee resources.",
  path: "/employee-portal",
});

export default function EmployeePortalPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
      <EmployeePortalClient />
    </div>
  );
}
