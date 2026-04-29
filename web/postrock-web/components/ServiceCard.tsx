import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ServiceCard(props: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="flex h-full flex-col transition hover:border-accent/80 hover:shadow-md">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">{props.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <Link
          href={props.href}
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
        >
          Division overview <ArrowRight className="size-4" aria-hidden />
        </Link>
      </CardContent>
    </Card>
  );
}
