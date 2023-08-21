import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createReviewDTO, read, remove, update } from "@/crud/review";
import { NextResponse } from 'next/server'


export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELTE = handler;



async function handler(req: NextApiRequest, { params }: { params: { id: string } } ) {

    if (req.method === "GET") {
        const reviewId = params.id as string;
        const review = await read(reviewId, prisma)
        return NextResponse.json({ data: review })

    }
    if (req.method === "PUT") {
        const reviewId = params.id as string;
        const review = req.body as createReviewDTO;
        const updatedUser = await update(reviewId, review, prisma);
        return NextResponse.json({ message: "update success", data: updatedUser });
    }
    if (req.method === "DELETE") {
        const reviewId = params.id as string;
        const deleted = await remove(reviewId, prisma);
        return NextResponse.json({ message: "delete success" });

    }
    if(req.method ==="POST") {
        return NextResponse.error()
    }


}