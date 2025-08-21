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
import { signInSchema, type SignInData } from "../schemas";

interface SignInFormProps {
  onSubmit: (data: SignInData) => void;
  loading: boolean;
  error: string | null;
  onForgotPassword: () => void;
  defaultEmail?: string;
}

export function SignInForm({ 
  onSubmit, 
  loading, 
  error, 
  onForgotPassword,
  defaultEmail = ""
}: SignInFormProps) {
  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: defaultEmail, password: "" },
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
                  placeholder="••••••••"
                  autoComplete="current-password"
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
          <span />
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm underline"
          >
            Forgot password?
          </button>
        </div>

        <Button className="w-full" disabled={loading} type="submit">
          {loading && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
