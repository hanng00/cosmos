import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
} from "aws-amplify/auth";

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
}

export interface ConfirmSignUpParams {
  email: string;
  confirmationCode: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ConfirmResetPasswordParams {
  email: string;
  confirmationCode: string;
  newPassword: string;
}

export async function signIn({ email, password }: SignInParams): Promise<void> {
  await amplifySignIn({ username: email, password });
}

export async function signUp({ email, password }: SignUpParams): Promise<void> {
  await amplifySignUp({
    username: email,
    password,
    options: { userAttributes: { email } },
  });
}

export async function confirmSignUp({ email, confirmationCode }: ConfirmSignUpParams): Promise<void> {
  await amplifyConfirmSignUp({
    username: email,
    confirmationCode,
  });
}

export async function resetPassword({ email }: ResetPasswordParams): Promise<void> {
  await amplifyResetPassword({ username: email });
}

export async function confirmResetPassword({ 
  email, 
  confirmationCode, 
  newPassword 
}: ConfirmResetPasswordParams): Promise<void> {
  await amplifyConfirmResetPassword({
    username: email,
    confirmationCode,
    newPassword,
  });
}
