import { create, createUserDTO } from "@/crud/user";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { NextResponse } from 'next/server';

export const POST = handler;

async function handler(req: Request) {

    if (req.method === "POST") {
        const user = await req.json() as createUserDTO;
        const updatedUser = await create(user, prisma);
        return NextResponse.json({ message: "Add success", data: updatedUser });
    }


}