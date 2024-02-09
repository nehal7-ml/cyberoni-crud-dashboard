'use server'

import { getUserByEmail } from "@/crud/user";
import { sendPasswordReset } from "@/lib/sendgrid";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
    const email = formData.get('username');
    try {
        await getUserByEmail(email as string, prisma);
    } catch (error) {
        console.log(error);
        redirect('/auth/forgot?error=NotFound');

    }
    const res = await sendPasswordReset(email as string,
        sign({ email },
            process.env.NEXTAUTH_SECRET as string, {
            expiresIn: '15m'
        }));
    if (res === 202) redirect('/auth/forgot?sent=true');
    else redirect('/auth/forgot?sent=false');
}