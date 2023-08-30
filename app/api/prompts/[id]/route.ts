import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createGptPromptDTO, read, remove, update } from "@/crud/prompt";
import { NextResponse } from 'next/server'


export const GET = handler;
export const PUT = handler;
export const DELTE = handler;



async function handler(req: Request, { params }: { params: { id: string } } ) {

    if (req.method === "GET") {
        const promptId = params.id as string;
        const prompt = await read(promptId, prisma)
        return NextResponse.json({ data: prompt })

    }
    if (req.method === "PUT") {
        const promptId = params.id as string;
        const prompt = await req.json() as createGptPromptDTO;
        const updatedUser = await update(promptId, prompt, prisma);
        return NextResponse.json({ message: "update success", data: updatedUser });
    }
    if (req.method === "DELETE") {
        const promptId = params.id as string;
        const deleted = await remove(promptId, prisma);
        return NextResponse.json({ message: "delete success" });

    }
    if(req.method ==="POST") {
        return NextResponse.error()
    }


}