import { create } from "@/crud/service";
import { CreateServiceDTO } from "@/crud/DTOs";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
    const service = (await req.json()) as CreateServiceDTO;
    const session = await getServerSession(authOptions) ;
    service.userId = session?.user?.id ?? undefined;
    const newService = await create(service, prisma);
    return NextResponse.json({ message: "Add success", data: newService });
}
