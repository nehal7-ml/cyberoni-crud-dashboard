import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createUserDTO, read, remove, update } from "@/crud/user";
import { NextResponse } from 'next/server'


export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELTE = handler;



async function handler(req: NextApiRequest, { params }: { params: { id: string } } ) {

    if (req.method === "GET") {
        const userId = params.id as string;
        const user = await read(userId, prisma)
        return NextResponse.json({ data: user })

    }
    if (req.method === "PUT") {
        const userId = params.id as string;
        const user = req.body as createUserDTO;
        const updatedUser = await update(userId, user, prisma);
        return NextResponse.json({ message: "update success", data: updatedUser });
    }
    if (req.method === "DELETE") {
        const userId = params.id as string;
        const deleted = await remove(userId, prisma);
        return NextResponse.json({ message: "delete success" });

    }
    if(req.method ==="POST") {
        return NextResponse.error()
    }


}