'use server'
import {  read, reset, update } from "@/crud/user";
//import { verifyCaptcha } from "@/lib/";
import { redirect } from "next/navigation";
import { verify } from "jsonwebtoken";
import { getUserByEmail } from "@/crud/user";
import { prisma } from "@/prisma/prismaClient";


export async function resetPassword(state: {
    token: string,
    password: string,
    recaptcha:string,
    success?: boolean,
    error? :string,

}) {
    const { success } = {success:true}
    if (success && state.password.length > 7) {
        try {
            const password = state.password;
            //const { email } = verify(state.token, process.env.NEXTAUTH_SECRET as string) as { email: string }
             await reset(state.token, password, prisma);
            state.success= true
        } catch (error) {
            console.log(error);
            state.success= false

            state.error=( error as Error).toString()
        }
    } else {
        state.success= false
        state.error= "captcha failed or Invalid password "
    }
    return state
}