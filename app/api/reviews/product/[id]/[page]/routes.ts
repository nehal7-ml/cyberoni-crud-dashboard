import { getByProductId, getByServiceId, read, remove, update } from "@/crud/review";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { NextResponse } from 'next/server'
import apiHandler from "@/errorHandler";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get });

async function get(req: Request, { params }: { params: { id: string, page: string } }) {
    const productId = params.id;
    const reviews = await getByProductId(productId, parseInt(params.page), 10, prisma)  // skipping 10 record for every new page
    return NextResponse.json({ message: "found", data: reviews })

}
