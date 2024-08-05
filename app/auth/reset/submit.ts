"use server";
import {  reset } from "@/crud/user";

export async function resetPassword(state: {
  token: string;
  password: string;
  recaptcha: string;
  success?: boolean;
  error?: string;
}) {
  const { success } = { success: true };
  if (success && state.password.length > 7) {
    try {
      const password = state.password;
      //const { email } = verify(state.token, process.env.NEXTAUTH_SECRET as string) as { email: string }
      await reset(state.token, password);
      state.success = true;
    } catch (error) {
      console.log(error);
      state.success = false;

      state.error = (error as Error).toString();
    }
  } else {
    state.success = false;
    state.error = "captcha failed or Invalid password ";
  }
  return state;
}
