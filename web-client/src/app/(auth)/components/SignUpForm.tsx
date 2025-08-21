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
import { signUpSchema, confirmSignUpSchema, type SignUpData, type ConfirmSignUpData } from "../schemas";

interface SignUpFormProps {
  onSubmit: (data: SignUpData) => void;
  loading: boolean;
  error: string | null;
}

export function SignUpForm({ onSubmit, loading, error }: SignUpFormProps) {
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
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
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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

        <Button className="w-full" disabled={loading} type="submit">
          {loading && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
    </Form>
  );
}

interface ConfirmSignUpFormProps {
  onSubmit: (data: ConfirmSignUpData) => void;
  loading: boolean;
  error: string | null;
  email: string;
  onEditEmail: () => void;
}

export function ConfirmSignUpForm({ 
  onSubmit, 
  loading, 
  error, 
  email, 
  onEditEmail 
}: ConfirmSignUpFormProps) {
  const form = useForm<ConfirmSignUpData>({
    resolver: zodResolver(confirmSignUpSchema),
    defaultValues: { code: "" },
  });

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        We sent a verification code to {email}
      </p>
      
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

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={loading}
              type="submit"
            >
              {loading && <Loader2 className="animate-spin" />}
              Confirm
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onEditEmail}
            >
              Edit email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
