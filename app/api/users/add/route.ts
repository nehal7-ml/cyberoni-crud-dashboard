import { create, createUserDTO } from "@/crud/user";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    if (req.method === "POST") {
        const user = await req.json() as createUserDTO;
        const newUser = await create(user, prisma);
        return NextResponse.json({ message: "Add success", data: newUser });
    }


}