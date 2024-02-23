"use client";
import ClientInput from "@/components/ClientInput";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import React from "react";
import { resetPassword } from "./submit";
import { Message } from "@/components/AuthMessage";

function ForgotPassword({
  searchParams,
}: {
  searchParams: { success: string; sent: string; error: string };
}) {
  let success =
    searchParams.success === "true"
      ? true
      : searchParams.success === "false"
        ? false
        : null;
  let sent =
    searchParams.sent === "true"
      ? true
      : searchParams.success === "false"
        ? false
        : null;
  let error = searchParams.error || null;

  return (
    <div className="">
      {success === null && sent === null && error === null ? (
        <form action={resetPassword}>
          <h1 className="text-bold text-4xl">Reset Password</h1>

          <div className="relative my-10">
            <ClientInput
              className="focus:shadow-outline peer w-full appearance-none rounded-xl border bg-transparent px-4 py-4 leading-tight  text-gray-700 shadow-lg focus:outline-none"
              name="username"
              id="username"
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
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-2 rounded-xl p-4 text-center text-2xl font-bold hover:shadow-md"
              type="submit"
            >
              <div className="flex-1">Reset password</div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <RotateCcw className="text-white" />
              </div>
            </button>
          </div>
        </form>
      ) : error === "NotFound" ? (
        <>
          <Message message="User Not found" type="red" />
        </>
      ) : sent === true ? (
        <Message
          message="Password reset link has been sent check email"
          type="green"
        />
      ) : sent === false ? (
        <Message message="Faield to send message" type="red" />
      ) : success === true ? (
        <>
          <Message
            message="Password reset check email for new password"
            type="green"
          />
        </>
      ) : success === false ? (
        <Message message="Failed to reset Password" type="red" />
      ) : (
        <></>
      )}
    </div>
  );
}

export default ForgotPassword;
