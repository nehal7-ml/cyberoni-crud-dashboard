import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createProductDTO, read, remove, update } from "@/crud/product";
import { NextResponse } from 'next/server'


export const GET = handler;
export const PUT = handler;
export const DELTE = handler;



async function handler(req: Request, { params }: { params: { id: string } } ) {

    if (req.method === "GET") {
        const productId = params.id as string;
        const product = await read(productId, prisma)
        return NextResponse.json({ data: product })

    }
    if (req.method === "PUT") {
        const productId = params.id as string;
        const product = await req.json() as createProductDTO;
        const updatedUser = await update(productId, product, prisma);
        return NextResponse.json({ message: "update success", data: updatedUser });
    }
    if (req.method === "DELETE") {
        const productId = params.id as string;
        const deleted = await remove(productId, prisma);
        return NextResponse.json({ message: "delete success" });

    }
    if(req.method ==="POST") {
        return NextResponse.error()
    }


}