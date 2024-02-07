import { create, createReviewDTO } from "@/crud/review";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });


async function post(req: Request) {


    if (req.method === "POST") {
        const review = await req.json() as createReviewDTO;
        const newReview = await create(review, prisma);
        return NextResponse.json({ message: "Add success", data: newReview }, { status: 200 });
    }


}