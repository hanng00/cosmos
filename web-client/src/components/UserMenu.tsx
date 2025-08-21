"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "aws-amplify/auth";
import { useMe } from "@/features/auth/useMe";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useMe();

  const email = me?.email || null;

  async function handleSignOut() {
    await signOut();
    queryClient.clear();
    router.refresh();
  }

  function handleSignIn() {
    router.push("/signup");
  }

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className="rounded-full border" disabled>
        …
      </Button>
    );
  }

  if (!email) {
    return (
      <Button size="sm" onClick={handleSignIn}>
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full border">
          {email}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Signed in as {email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


