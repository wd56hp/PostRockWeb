"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function LoginDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm" className="gap-1 border-primary/30">
          Portals
          <ChevronDown className="size-4 opacity-70" aria-hidden />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-[100] min-w-[260px] rounded-md border border-border bg-background p-2 shadow-lg"
          align="end"
          sideOffset={8}
        >
          <DropdownMenu.Item asChild>
            <Link
              href="/employee-portal"
              className="flex cursor-pointer flex-col rounded px-3 py-2 text-sm outline-none hover:bg-muted focus:bg-muted"
            >
              <span className="font-semibold text-primary">Employee Portal</span>
              <span className="text-xs text-foreground/70">Microsoft 365 sign-in</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href="/producer-portal"
              className="flex cursor-pointer flex-col rounded px-3 py-2 text-sm outline-none hover:bg-muted focus:bg-muted"
            >
              <span className="font-semibold text-primary">Producer Portal</span>
              <span className="text-xs text-foreground/70">Coming June 2026</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              href="/investor-portal"
              className="flex cursor-pointer flex-col rounded px-3 py-2 text-sm outline-none hover:bg-muted focus:bg-muted"
            >
              <span className="font-semibold text-primary">Investor inquiries</span>
              <span className="text-xs text-foreground/70">Submit an inquiry</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item asChild>
            <a
              href={siteConfig.employeePortalUrl}
              rel="noopener noreferrer"
              className="flex cursor-pointer rounded px-3 py-2 text-xs text-foreground/70 outline-none hover:bg-muted focus:bg-muted"
            >
              Direct SharePoint link →
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
