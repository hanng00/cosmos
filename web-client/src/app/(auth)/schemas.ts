import { z } from "zod";

// Form schemas
export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const confirmSignUpSchema = z.object({
  code: z.string().min(1, "Confirmation code is required"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export const confirmResetSchema = z.object({
  code: z.string().min(1, "Confirmation code is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Types
export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type ConfirmSignUpData = z.infer<typeof confirmSignUpSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ConfirmResetData = z.infer<typeof confirmResetSchema>;
