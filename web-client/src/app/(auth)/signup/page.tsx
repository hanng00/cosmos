"use client";

import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthTabs } from "../components/AuthTabs";
import "@/lib/amplify";

function LoginPageContent() {
  return (
    <div className="min-h-svh bg-muted flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Cosmos</CardTitle>
          <CardDescription>
            Sign in to continue or create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthTabs />
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-svh bg-muted flex items-center justify-center">
        Loading...
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}