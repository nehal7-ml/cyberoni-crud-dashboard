
import  { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuthAdapter";

import {  redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { User } from "next-auth";


export default async function SignIn() {
  const session = await getServerSession(authOptions);

  // console.log(search);
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!

  if (session) {
    const user = session.user as User;
    if (user.role == "ADMIN" || user.role == "SUPERUSER") redirect("/");
  }

  return <LoginForm />;
}
