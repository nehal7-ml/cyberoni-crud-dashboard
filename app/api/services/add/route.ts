import { create, createServiceDTO } from "@/crud/service";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    if (req.method === "POST") {
        const service = await req.json() as createServiceDTO;
        const newUser = await create(service, prisma);
        return NextResponse.json({ message: "Add success", data: newUser });
    }


}