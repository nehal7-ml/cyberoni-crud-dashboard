'use client'
import ClientInput from "@/components/ClientInput"


import { CheckCircle2, RotateCcw, XCircle } from "lucide-react"
import React from 'react'
import { resetPassword } from "./submit";
import { Message } from "@/components/AuthMessage";

function ForgotPassword({ searchParams }: { searchParams: { success: string, sent: string, error: string } }) {

  let success = searchParams.success === "true" ? true : searchParams.success === "false" ? false : null
  let sent = searchParams.sent === "true" ? true : searchParams.success === "false" ? false : null
  let error = searchParams.error || null

  return (
    <div className="">
      {(success === null && sent === null && error === null) ?

        <form action={resetPassword}>
          <h1 className="text-bold text-4xl">Reset Password</h1>

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
          <div className="flex items-center justify-center">
            <button className="flex rounded-xl hover:shadow-md p-4 font-bold text-2xl gap-2 text-center justify-center items-center" type="submit">
              <div className="flex-1">Reset password</div>
              <div className="w-10 h-10 rounded-full bg-black flex justify-center items-center">
                <RotateCcw className="text-white" />
              </div>

            </button></div>
        </form> :

        error === 'NotFound' ?
          <>
            <Message message="User Not found" type="red" />

          </> :
          sent === true ? <Message message="Password reset link has been sent check email" type="green" /> :
            sent === false ? <Message message="Faield to send message" type="red" /> :
              success === true ? <>
                <Message message="Pssword reset check email for new password" type="green" />
              </> :

                success === false ? <Message message="Failed to reset Password" type="red" />
                  : <></>

      }
    </div>
  )
}




export default ForgotPassword