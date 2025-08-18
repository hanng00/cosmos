"use client";

import CosmosLogo from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";

export function NavBar() {
  return (
    <div className="sticky top-0 z-20 bg-background/60 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between text-foreground/80">
        <CosmosLogo />
        <UserMenu />
      </div>
    </div>
  );
}


