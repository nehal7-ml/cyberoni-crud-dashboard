import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removePrompt, update } from "@/crud/prompt";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from 'next/server'
import apiHandler from "@/errorHandler";


export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get, PUT: put, DELETE: remove });

async function put(req: NextRequest, { params }: { params: { id: string } }) {

    const promptId = params.id as string;
    const prompt = await req.json() as CreateGptPromptDTO;
    const updatedUser = await update(promptId, prompt, prisma);
    return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(req: NextRequest, { params }: { params: { id: string } }) {
    const promptId = params.id as string;
    const deleted = await removePrompt(promptId, prisma);
    return NextResponse.json({ message: "delete success" });
}


async function get(req: NextRequest, { params }: { params: { id: string } }) {
    const promptId = params.id as string;
    const prompt = await read(promptId, prisma)
    return NextResponse.json({ data: prompt })


}