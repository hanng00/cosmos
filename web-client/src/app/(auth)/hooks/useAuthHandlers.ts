import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  signIn,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
} from "@/features/auth/api";
import { useAuthEvents } from "@/features/auth/AuthProvider";
import type {
  SignInData,
  SignUpData,
  ConfirmSignUpData,
  ResetPasswordData,
  ConfirmResetData,
} from "../schemas";

function getErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err)
    return String((err as { message?: unknown }).message);
  return "Something went wrong. Please try again.";
}

export function useAuthHandlers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerAuthSuccess } = useAuthEvents();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleAuthSuccess = async () => {
    // Trigger registered auth success handlers
    await triggerAuthSuccess();
    
    // Default fallback navigation if no handler redirected
    const next = searchParams.get("next") || "/d/brands";
    router.replace(next);
  };

  const onSignIn = async (data: SignInData) => {
    setLoading(true);
    clearError();
    try {
      await signIn({ email: data.email, password: data.password });
      console.log("Sign in successful, invalidating auth queries...");
      
      // Invalidate the "me" query to update auth state immediately
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      
      console.log("Auth queries invalidated, handling auth success...");
      await handleAuthSuccess();
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (data: SignUpData) => {
    setLoading(true);
    clearError();
    try {
      await signUp({ email: data.email, password: data.password });
      return { email: data.email, password: data.password };
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onConfirmSignUp = async (data: ConfirmSignUpData, email: string, password: string) => {
    setLoading(true);
    clearError();
    try {
      await confirmSignUp({
        email: email,
        confirmationCode: data.code,
      });
      
      // Auto sign in after confirmation
      await signIn({ email: email, password });
      
      // Invalidate the "me" query to update auth state immediately
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      
      await handleAuthSuccess();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data: ResetPasswordData) => {
    setLoading(true);
    clearError();
    try {
      await resetPassword({ email: data.email });
      return data.email;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onConfirmReset = async (data: ConfirmResetData, email: string) => {
    setLoading(true);
    clearError();
    try {
      await confirmResetPassword({
        email: email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });
      return email;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    clearError,
    onSignIn,
    onSignUp,
    onConfirmSignUp,
    onResetPassword,
    onConfirmReset,
  };
}
