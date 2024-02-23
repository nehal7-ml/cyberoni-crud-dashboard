"use client";
import ClientInput from "@/components/ClientInput";
import { RotateCcw } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { resetPassword } from "./submit";
import { useRouter, useSearchParams } from "next/navigation";
import { Message } from "@/components/AuthMessage";
import { useFormState } from "react-dom";
import PasswordChecklist from "react-password-checklist";
import Link from "next/link";

function ResetPasswordForm() {
  const [active, setActive] = useState(false);
  const searchParams = useSearchParams();
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean | undefined>(false);
  const [state, setState] = useState<{
    token: string;
    password: string;
    recaptcha: string;
    success?: boolean;
    error?: string;
  }>({
    password: "",
    success: success,
    recaptcha: "",
    token: searchParams.get("token") as string,
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  async function submit() {
    const newState = await resetPassword(state);
    setState(newState);
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      token: searchParams.get("token") as string,
    }));
  }, [searchParams]);

  return (
    <>
      {state.success === true ? (
        <div>
          <Message message="Password reset Sucessfull" type="green" />
          <Link
            href={"/api/auth/signin"}
            className="cursor-pointer text-blue-600 underline"
          >
            click to login
          </Link>
        </div>
      ) : state.error ? (
        <>
          <Message message={`Error occured: ${state.error}`} type="red" />
        </>
      ) : (
        <form className="container " action={submit}>
          <h1 className="text-bold text-4xl">Reset Password</h1>
          <input name="recaptcha" type="hidden" defaultValue={""} />
          <input
            name="token"
            type="hidden"
            defaultValue={searchParams.get("token") as string}
          />
          <input name="success" type="hidden" defaultValue={"false"} />
          <input name="error" type="hidden" defaultValue={""} />
          <div className="relative my-10">
            <ClientInput
              className="focus:shadow-outline invalid peer w-full appearance-none rounded-xl border bg-transparent px-4 py-4  leading-tight text-gray-700 shadow-lg focus:outline-none"
              name="password"
              id="password"
              type="password"
              placeholder=""
              value={state.password}
              onChange={(e) =>
                setState((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
            <label
              className="absolute left-3 top-0 mb-2 block -translate-y-3 bg-gray-50 px-1 text-sm  font-bold text-gray-500 transition-all   peer-placeholder-shown:translate-y-3 peer-focus:-translate-y-3 peer-focus:text-blue-500"
              htmlFor="email"
            >
              New Password
            </label>
          </div>
          <div className="relative my-10">
            <ClientInput
              className="focus:shadow-outline invalid peer w-full appearance-none rounded-xl border bg-transparent px-4 py-4  leading-tight text-gray-700 shadow-lg focus:outline-none"
              name="passwordRepeat"
              id="passwordRepeat"
              type="password"
              placeholder=""
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <label
              className="absolute left-3 top-0 mb-2 block -translate-y-3 bg-gray-50 px-1 text-sm  font-bold text-gray-500 transition-all   peer-placeholder-shown:translate-y-3 peer-focus:-translate-y-3 peer-focus:text-blue-500"
              htmlFor="email"
            >
              Confirm Password
            </label>
          </div>

          <PasswordChecklist
            className="mb-4"
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={8}
            value={state.password}
            valueAgain={confirm}
            onChange={(isValid) => {
              setActive(isValid);
            }}
          />

          <div className="flex items-center justify-center">
            <button
              disabled={!active && searchParams.get("token") == null}
              className={`flex items-center justify-center gap-2 rounded-xl bg-blue-600 p-4 text-center text-2xl font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500`}
              type="submit"
            >
              <div className="flex-1">Reset password</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <RotateCcw className="text-white" />
              </div>
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default ResetPasswordForm;
