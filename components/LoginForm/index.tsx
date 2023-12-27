'use client'
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import React, { useEffect, useState } from 'react'
import ClientInput from "../ClientInput";
import { getCsrfToken } from "next-auth/react";

function LoginForm() {
    const searchParams = useSearchParams();
    const [csrfToken, setCsrfToken] = useState("");
    const [search, setSearch] = useState({
        error: searchParams.get('error') as string,

    });

    useEffect(() => {
        async function loadToken() {
            const csrfToken = await getCsrfToken()
            setCsrfToken(csrfToken as string);
        }
        loadToken();
    }, []);

    useEffect(() => {
        setSearch({
            error: searchParams.get('error') as string,
        })
    }, [searchParams]);

    return (
        <>
            <div className="container mx-auto max-w-md">

                <form method="POST" action={'/api/auth/callback/credentials'} className="flex flex-col p-5 lg:p-10 bg-gray-50 text-gray-950">
                    <h1 className="text-bold text-4xl">Sign In</h1>
                    {search.error === 'CredentialsSignin' ?
                        <div className="bg-rose-500/80 rounded-lg px-4 py-1 text-gray-200 my-3 ring-red-600 ring-2">
                            Wrong credentials try again with correct credentials
                        </div> : <></>}
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                    <div className="relative my-10">

                        <ClientInput
                            className="peer shadow-lg appearance-none border rounded-xl w-full py-4 px-4 bg-transparent text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                            name="username"
                            id="email"
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
                        <label className="block absolute top-0 left-3 -translate-y-3 peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-3 peer-focus:text-blue-500 bg-gray-50  px-1 text-gray-500 transition-all   text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                    </div>
                    <div className="flex items-center justify-center">
                        <button disabled={csrfToken == ""} className="flex disabled:cursor-not-allowed disabled:text-gray-400 hover:shadow-sm p-4 font-bold text-2xl gap-2 text-center justify-center items-center" type="submit">
                            <div className="flex-1">Sign in</div>
                            <div className="w-10 h-10 rounded-full bg-black flex justify-center items-center">
                                <ArrowRight className="text-white" />
                            </div>

                        </button></div>

                    <Link className="text-blue-500 hover:underline text-center text-sm" href={'/auth/forgot'}>Forgot Password?</Link>
                </form>
            </div>
        </>
    )
}

export default LoginForm