import { notFound } from "next/navigation";

/** Careers postings are hidden while the careers section is disabled. */
export function generateStaticParams() {
  return [];
}

export default function CareerPostingPage() {
  notFound();
}
