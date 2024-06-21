
import { CreateSoftwareProductDTO } from "@/crud/DTOs";
import { create } from "@/crud/softwareProduct";
import apiHandler from "@/errorHandler";
import { authOptions } from "@/lib/nextAuthAdapter";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function post(req: Request) {
    const product = (await req.json()) as CreateSoftwareProductDTO;
    const session = await getServerSession(authOptions) ;
    product.userId = session?.user?.id ?? undefined;
    const newProduct = await create(product, prisma);
    return NextResponse.json({ message: "Add success", data: newProduct });
}

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });
