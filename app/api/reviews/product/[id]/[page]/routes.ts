import { getByProductId, getByServiceId, read, remove, update } from "@/crud/review";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { NextResponse } from 'next/server'

export const GET = async (req: Request, { params }: { params: { id: string, page: string } }) => {
    const productId = params.id;
    const reviews = await getByProductId(productId, parseInt(params.page), 10, prisma)  // skipping 10 record for every new page
    return NextResponse.json({ message: "found", data: reviews })

}
