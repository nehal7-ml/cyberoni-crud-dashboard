import ClientInput from "@/components/ClientInput"
import { sendPasswordReset } from "@/lib/sendgrid";
import { sign } from "jsonwebtoken";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react"
import React from 'react'

function ForgotPassword({ searchParams }: { searchParams: { success: string, sent: string } }) {

  let success = searchParams.success === "true" ? true : searchParams.success === "false" ? false : null
  let sent = searchParams.sent === "true" ? true : false
  async function resetPassword(formData: FormData) {
    'use server'
    const email = formData.get('username');
    await sendPasswordReset(email as string, sign({ email }, process.env.NEXTAUTH_SECRET as string));

  }
  return (
    <div>
      {success === null ? <form action={resetPassword}>
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
        success === true ? <>
          <div className="flex gap-3 p-4 ring-green-500 bg-green-400/60 ring-2 ">
            <CheckCircle2 className="text-emerald-900" /> Successfully reset Password check email
          </div>
        </> :

          success === false ? <>
            <div className="flex gap-3 p-4 ring-red-500 bg-rose-400/60 ring-2 ">
            <XCircle className="text-rose-900" /> Failed to reset Password
          </div>
          </> : <></>

      }
    </div>
  )
}

export default ForgotPassword