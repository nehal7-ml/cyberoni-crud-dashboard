import { CredentialAuthDTO, authorizeWithPassword } from "@/crud/agent";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { HttpError } from "@/lib/utils";

export async function POST(req: NextRequest) {
    try {
        const credentials = await req.json() as CredentialAuthDTO;
        const user = await authorizeWithPassword(credentials, prisma)
        return NextResponse.json({ user })
    } catch (error) {
        console.log(error)
        const errorMsg = error as HttpError
        return NextResponse.json({ message: errorMsg.message }, { status: errorMsg.status || 500 })
    }

}