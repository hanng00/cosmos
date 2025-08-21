import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm, ConfirmSignUpForm } from "./SignUpForm";
import { ResetPasswordForm, ConfirmResetForm } from "./ResetPasswordForms";
import { useAuthHandlers } from "../hooks/useAuthHandlers";

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<"signIn" | "signUp">("signIn");
  const [signupStep, setSignupStep] = useState<"form" | "confirm">("form");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [resetStep, setResetStep] = useState<"idle" | "email" | "code">("idle");
  const [resetEmail, setResetEmail] = useState("");
  const [signInEmail, setSignInEmail] = useState("");

  const {
    loading,
    error,
    clearError,
    onSignIn,
    onSignUp,
    onConfirmSignUp,
    onResetPassword,
    onConfirmReset,
  } = useAuthHandlers();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as typeof activeTab);
    clearError();
  };

  const handleSignUp = async (data: { email: string; password: string }) => {
    const result = await onSignUp(data);
    if (result) {
      setSignupEmail(result.email);
      setSignupPassword(result.password);
      setSignupStep("confirm");
    }
  };

  const handleConfirmSignUp = async (data: { code: string }) => {
    await onConfirmSignUp(data, signupEmail, signupPassword);
  };

  const handleResetPassword = async (data: { email: string }) => {
    const email = await onResetPassword(data);
    if (email) {
      setResetEmail(email);
      setResetStep("code");
    }
  };

  const handleConfirmReset = async (data: { code: string; newPassword: string }) => {
    const email = await onConfirmReset(data, resetEmail);
    if (email) {
      setActiveTab("signIn");
      setSignInEmail(email);
      setResetStep("idle");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="signIn">Sign in</TabsTrigger>
        <TabsTrigger value="signUp">Create account</TabsTrigger>
      </TabsList>

      <TabsContent value="signIn" className="pt-4">
        {resetStep === "idle" && (
          <SignInForm
            onSubmit={onSignIn}
            loading={loading}
            error={error}
            onForgotPassword={() => setResetStep("email")}
            defaultEmail={signInEmail}
          />
        )}

        {resetStep === "email" && (
          <ResetPasswordForm
            onSubmit={handleResetPassword}
            loading={loading}
            error={error}
            onBackToSignIn={() => setResetStep("idle")}
          />
        )}

        {resetStep === "code" && (
          <ConfirmResetForm
            onSubmit={handleConfirmReset}
            loading={loading}
            error={error}
            onBack={() => setResetStep("email")}
          />
        )}
      </TabsContent>

      <TabsContent value="signUp" className="pt-4">
        {signupStep === "form" ? (
          <SignUpForm
            onSubmit={handleSignUp}
            loading={loading}
            error={error}
          />
        ) : (
          <ConfirmSignUpForm
            onSubmit={handleConfirmSignUp}
            loading={loading}
            error={error}
            email={signupEmail}
            onEditEmail={() => setSignupStep("form")}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
