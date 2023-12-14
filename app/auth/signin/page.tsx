
import { getProviders, signIn, getCsrfToken, useSession } from "next-auth/react"
import NextAuth, { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/nextAuthAdapter"
import ClientInput from "@/components/ClientInput"
import { ArrowRight, ArrowRightCircle } from "lucide-react"
import Image from "next/image"
import { ReadonlyURLSearchParams, redirect } from "next/navigation"
import { cookies } from 'next/headers'
import { NextRequest } from "next/server"
import Link from "next/link"
import LoginForm from "@/components/LoginForm"

export const dynamic='force-dynamic'

export default async   function SignIn() {

    const session = await getServerSession(authOptions)

    // console.log(search);
    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!


    if (session) {
        redirect('/')
    }

    return (
        <LoginForm />
    )
  
}
