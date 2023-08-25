import { create, createProductDTO } from "@/crud/product";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    if (req.method === "POST") {
        const product = await req.json() as createProductDTO;
        const newProduct = await create(product, prisma);
        return NextResponse.json({ message: "Add success", data: newProduct });
    }


}