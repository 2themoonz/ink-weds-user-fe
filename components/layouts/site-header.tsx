"use client";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { CommandMenu } from "@/components/layouts/command-menu";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/layouts/main-nav";
import { MobileNav } from "@/components/layouts/mobile-nav";
import { ThemeToggle } from "@/components/layouts/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "boring-avatars";

export function SiteHeader() {
  const [currentUser] = useAuth();
  console.log({ currentUser });
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center">
            {!currentUser && (
              <Link href="/auth/login">
                <div
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "w-9 px-0"
                  )}
                >
                  <Icons.avatar className="h-6 w-6 fill-current" />
                </div>
              </Link>
            )}
            {currentUser && (
              <Link href="/profile">
                <div className="flex items-center space-x-2">
                  <Avatar
                    size={32}
                    name={currentUser?.displayName}
                    variant="beam"
                  />
                  <span className="text-sm font-semibold">
                    {currentUser?.displayName}
                  </span>
                </div>
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
