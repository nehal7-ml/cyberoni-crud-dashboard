import { CredentialAuthDTO, authorizeWithPassword } from "@/crud/user";
import { NextRequest, NextResponse } from "next/server";
import { HttpError } from "@/lib/utils";
import { prisma } from "@/prisma/prismaClient";

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