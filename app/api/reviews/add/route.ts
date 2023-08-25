import { create, createReviewDTO } from "@/crud/review";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    if (req.method === "POST") {
        const review = await req.json() as createReviewDTO;
        const newUser = await create(review, prisma);
        return NextResponse.json({ message: "Add success", data: newUser });
    }


}