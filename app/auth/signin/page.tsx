import { getProviders, signIn, getCsrfToken } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/nextAuthAdapter"
import ClientInput from "@/components/ClientInput"
import { ArrowRight, ArrowRightCircle } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

export default async function SignIn({ }) {

    const session = await getServerSession(authOptions)

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        redirect('/')
    }

    
    const csrfToken = cookies().get('next-auth.csrf-token')?.value.split('|')[0]

    return (
        <>
            <div className="container mx-auto max-w-md">
                <div></div>
                <form method="POST" action={'/api/auth/callback/credentials'} className="flex flex-col p-5 lg:p-10 bg-gray-50 text-gray-950 rounded-[30px] shadow-lg">
                    <Image className="mx-auto" src={"/signin-1.png"} alt="signin" height={500} width={300} />
                    <h1 className="text-bold text-4xl">Sign In</h1>

                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <div className="relative my-10">

                        <ClientInput
                            className="peer shadow-lg appearance-none border rounded-xl w-full py-4 px-4 bg-transparent text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                            name="username"
                            id="username"
                            type="email"
                            placeholder=""
                            required
                        />
                        <label className="block absolute top-0 left-3 -translate-y-3 peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-3 peer-focus:text-blue-500 bg-gray-50  px-1 text-gray-500 transition-all   text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                    </div>
                    <div className="relative my-10">

                        <ClientInput
                            className="peer shadow-lg appearance-none border rounded-xl w-full py-4 px-4 bg-transparent text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                            name="password"
                            type="password"
                            placeholder=""
                            required
                        />
                        <label className="block absolute top-0 left-3 -translate-y-3 peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-3 peer-focus:text-blue-500 bg-gray-50  px-1 text-gray-500 transition-all   text-sm font-bold mb-2" htmlFor="email">
                            Password
                        </label>
                    </div>
                    <div className="flex items-center justify-center">
                        <button className="flex hover:shadow-sm p-4 font-bold text-2xl gap-2 text-center justify-center items-center" type="submit">
                            <div className="flex-1">Sign in</div>
                            <div className="w-10 h-10 rounded-full bg-black flex justify-center items-center">
                                <ArrowRight className="text-white" />
                            </div>

                        </button></div>
                </form>
            </div>
        </>
    )
}
