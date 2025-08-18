"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  signIn,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";
import "@/lib/amplify";
import { claimFreeBrandVoice } from "@/features/brand-voices/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupStep, setSignupStep] = useState<"form" | "confirm">("form");
  const [signupCode, setSignupCode] = useState("");

  const [resetStep, setResetStep] = useState<"idle" | "requested">("idle");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");

  useEffect(() => {
    setError(null);
  }, [activeTab, signupStep, resetStep]);

  const canSubmitSignIn = useMemo(() => {
    const e = emailSchema.safeParse(email);
    const p = passwordSchema.safeParse(password);
    return e.success && p.success;
  }, [email, password]);

  const canSubmitSignUp = useMemo(() => {
    const e = emailSchema.safeParse(signupEmail);
    const p = passwordSchema.safeParse(signupPassword);
    return e.success && p.success;
  }, [signupEmail, signupPassword]);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await signIn({ username: email, password });
      const freeVoiceId = searchParams.get("free_brand_voice_id");
      if (freeVoiceId) {
        try {
          const { brandId } = await claimFreeBrandVoice({ freeVoiceId });
          router.replace(`/brands/${brandId}`);
          return;
        } catch {
          // fall through to normal navigation
        }
      }
      const next = searchParams.get("next") || "/brands";
      router.replace(next);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    try {
      await signUp({
        username: signupEmail,
        password: signupPassword,
        options: { userAttributes: { email: signupEmail } },
      });
      setSignupStep("confirm");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmSignUp() {
    setLoading(true);
    setError(null);
    try {
      await confirmSignUp({
        username: signupEmail,
        confirmationCode: signupCode,
      });
      setActiveTab("signIn");
      setEmail(signupEmail);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetRequest() {
    setLoading(true);
    setError(null);
    try {
      await resetPassword({ username: resetEmail });
      setResetStep("requested");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetConfirm() {
    setLoading(true);
    setError(null);
    try {
      await confirmResetPassword({
        username: resetEmail,
        confirmationCode: resetCode,
        newPassword: resetNewPassword,
      });
      setActiveTab("signIn");
      setEmail(resetEmail);
      setResetStep("idle");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

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
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signIn">Sign in</TabsTrigger>
              <TabsTrigger value="signUp">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signIn" className="pt-4">
              {resetStep === "idle" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setResetStep("requested")}
                      className="text-sm underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Button
                    className="w-full"
                    disabled={!canSubmitSignIn || loading}
                    onClick={handleSignIn}
                  >
                    Sign in
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email</Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={
                      loading || !emailSchema.safeParse(resetEmail).success
                    }
                    onClick={handleResetRequest}
                  >
                    Send reset code
                  </Button>
                  {resetStep === "requested" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resetCode">Confirmation code</Label>
                        <Input
                          id="resetCode"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          placeholder="123456"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      {error && <p className="text-sm text-red-600">{error}</p>}
                      <Button
                        className="w-full"
                        disabled={
                          loading ||
                          !passwordSchema.safeParse(resetNewPassword).success ||
                          resetCode.length === 0
                        }
                        onClick={handleResetConfirm}
                      >
                        Update password
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="signUp" className="pt-4">
              {signupStep === "form" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button
                    className="w-full"
                    disabled={!canSubmitSignUp || loading}
                    onClick={handleSignUp}
                  >
                    Create account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We sent a verification code to {signupEmail}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="signupCode">Confirmation code</Label>
                    <Input
                      id="signupCode"
                      value={signupCode}
                      onChange={(e) => setSignupCode(e.target.value)}
                      placeholder="123456"
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      disabled={loading || signupCode.length === 0}
                      onClick={handleConfirmSignUp}
                    >
                      Confirm
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setSignupStep("form")}
                    >
                      Edit email
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err)
    return String((err as { message?: unknown }).message);
  return "Something went wrong. Please try again.";
}
