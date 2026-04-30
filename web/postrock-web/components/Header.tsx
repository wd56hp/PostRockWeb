"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { LoginDropdown } from "@/components/LoginDropdown";
import { Button } from "@/components/ui/button";
import { brandImages } from "@/lib/brand-assets";
import { siteConfig } from "@/lib/site-config";

function navItemIsActive(pathname: string, hash: string, href: string): boolean {
  if (href === "/about#team") return pathname === "/about" && hash === "#team";
  if (href === "/about") return pathname === "/about" && hash !== "#team";
  return pathname === href;
}

export function Header() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(typeof window !== "undefined" ? window.location.hash : "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex min-w-0 shrink items-center">
          <Image
            src={brandImages.postRockLogoHeader}
            alt={siteConfig.name}
            width={1024}
            height={682}
            className="h-9 w-auto max-w-[min(220px,52vw)] sm:h-10 sm:max-w-[260px] lg:h-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                navItemIsActive(pathname, hash, item.href) ? "bg-muted text-primary" : "text-foreground/90",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LoginDropdown />
          </div>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/40" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-[90] flex w-[min(100vw,320px)] flex-col bg-background p-4 shadow-xl outline-none">
                <div className="mb-6 flex items-center justify-between">
                  <Dialog.Title className="font-heading text-lg font-semibold text-primary">Menu</Dialog.Title>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="sm" aria-label="Close menu">
                      <X className="size-6" />
                    </Button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col gap-1" aria-label="Mobile primary">
                  {primaryNav.map((item) => (
                    <Dialog.Close key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "rounded-md px-3 py-3 text-base font-medium hover:bg-muted",
                          navItemIsActive(pathname, hash, item.href) ? "bg-muted text-primary" : "",
                        )}
                      >
                        {item.label}
                      </Link>
                    </Dialog.Close>
                  ))}
                </nav>
                <div className="mt-auto border-t border-border pt-4">
                  <LoginDropdown />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
