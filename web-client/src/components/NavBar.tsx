"use client";

import CosmosLogo from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useMe } from "@/features/auth/useMe";

export function NavBar() {
  const { data: me } = useMe();

  return (
    <div className="sticky top-0 z-20 bg-background/60 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between text-foreground/80">
        <CosmosLogo />
        <div className="flex items-center gap-2">
          {me?.email && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/d">
                Dashboard <ChevronRight />
              </Link>
            </Button>
          )}
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
