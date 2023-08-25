import { create, createEventDTO } from "@/crud/event";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    if (req.method === "POST") {
        const event = await req.json() as createEventDTO;
        const newUser = await create(event, prisma);
        return NextResponse.json({ message: "Add success", data: newUser });
    }


}