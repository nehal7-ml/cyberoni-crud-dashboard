import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { CreateProductDTO, read, remove as removeProduct, update } from "@/crud/product";
import { NextRequest, NextResponse } from 'next/server'
import apiHandler from "@/errorHandler";


export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get, PUT: put, DELETE: remove });

async function put(req: NextRequest, { params }: { params: { id: string } }) {

    const productId = params.id as string;
    const product = await req.json() as CreateProductDTO;
    const updatedUser = await update(productId, product, prisma);
    return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id as string;
    const deleted = await removeProduct(productId, prisma);
    return NextResponse.json({ message: "delete success" });
}


async function get(req: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id as string;
    const product = await read(productId, prisma)
    return NextResponse.json({ data: product })


}