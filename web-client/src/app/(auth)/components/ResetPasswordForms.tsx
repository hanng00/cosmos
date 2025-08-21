import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "./PasswordInput";
import { 
  resetPasswordSchema, 
  confirmResetSchema, 
  type ResetPasswordData, 
  type ConfirmResetData 
} from "../schemas";

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordData) => void;
  loading: boolean;
  error: string | null;
  onBackToSignIn: () => void;
}

export function ResetPasswordForm({ 
  onSubmit, 
  loading, 
  error, 
  onBackToSignIn 
}: ResetPasswordFormProps) {
  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-sm underline"
            onClick={onBackToSignIn}
          >
            Back to sign in
          </button>
          <Button disabled={loading} type="submit">
            {loading && <Loader2 className="animate-spin" />}
            Send reset code
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface ConfirmResetFormProps {
  onSubmit: (data: ConfirmResetData) => void;
  loading: boolean;
  error: string | null;
  onBack: () => void;
}

export function ConfirmResetForm({ 
  onSubmit, 
  loading, 
  error, 
  onBack 
}: ConfirmResetFormProps) {
  const form = useForm<ConfirmResetData>({
    resolver: zodResolver(confirmResetSchema),
    defaultValues: { code: "", newPassword: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation code</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="At least 8 characters"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-sm underline"
            onClick={onBack}
          >
            Back
          </button>
          <Button disabled={loading} type="submit">
            {loading && <Loader2 className="animate-spin" />}
            Update password
          </Button>
        </div>
      </form>
    </Form>
  );
}
