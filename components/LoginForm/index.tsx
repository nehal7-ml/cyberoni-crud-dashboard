"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ClientInput from "../ClientInput";
import { getCsrfToken } from "next-auth/react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [csrfToken, setCsrfToken] = useState("");
  const [search, setSearch] = useState({
    error: searchParams.get("error") as string,
  });

  useEffect(() => {
    async function loadToken() {
      const csrfToken = await getCsrfToken();
      setCsrfToken(csrfToken as string);
    }
    loadToken();
  }, []);

  useEffect(() => {
    setSearch({
      error: searchParams.get("error") as string,
    });
  }, [searchParams]);

  return (
    <>
      <div className="container mx-auto max-w-md">
        <form
          method="POST"
          action={"/api/auth/callback/credentials"}
          className="flex flex-col bg-gray-50 p-5 text-gray-950 lg:p-10"
        >
          <h1 className="text-bold text-4xl">Sign In</h1>
          {search.error === "CredentialsSignin" ? (
            <div className="my-3 rounded-lg bg-rose-500/80 px-4 py-1 text-gray-200 ring-2 ring-red-600">
              Wrong credentials try again with correct credentials
            </div>
          ) : (
            <></>
          )}
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="relative my-10">
            <ClientInput
              className="focus:shadow-outline peer w-full appearance-none rounded-xl border bg-transparent px-4 py-4 leading-tight  text-gray-700 shadow-lg focus:outline-none"
              name="username"
              id="email"
              type="email"
              placeholder=""
              required
            />
            <label
              className="absolute left-3 top-0 mb-2 block -translate-y-3 bg-gray-50 px-1 text-sm  font-bold text-gray-500 transition-all   peer-placeholder-shown:translate-y-3 peer-focus:-translate-y-3 peer-focus:text-blue-500"
              htmlFor="email"
            >
              Email
            </label>
          </div>
          <div className="relative my-10">
            <ClientInput
              className="focus:shadow-outline peer w-full appearance-none rounded-xl border bg-transparent px-4 py-4 leading-tight  text-gray-700 shadow-lg focus:outline-none"
              name="password"
              type="password"
              placeholder=""
              required
            />
            <label
              className="absolute left-3 top-0 mb-2 block -translate-y-3 bg-gray-50 px-1 text-sm  font-bold text-gray-500 transition-all   peer-placeholder-shown:translate-y-3 peer-focus:-translate-y-3 peer-focus:text-blue-500"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="flex items-center justify-center">
            <button
              disabled={csrfToken == ""}
              className="flex items-center justify-center gap-2 p-4 text-center text-2xl font-bold hover:shadow-sm disabled:cursor-not-allowed disabled:text-gray-400"
              type="submit"
          id="#login-button"
            >
              <div className="flex-1">Sign in</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <ArrowRight className="text-white" />
              </div>
            </button>
          </div>

          <Link
            className="text-center text-sm text-blue-500 hover:underline"
            href={"/auth/forgot"}
          >
            Forgot Password?
          </Link>
        </form>
      </div>
    </>
  );
}

export default LoginForm;
