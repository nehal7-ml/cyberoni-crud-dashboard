import { create, CreateReferralDTO } from "@/crud/referral";
import apiHandler from "@/errorHandler";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {


    if (req.method === "POST") {
        const referral = await req.json() as CreateReferralDTO;
        const newEvent = await create(referral, prisma);
        return NextResponse.json({ message: "Add success", data: newEvent });
    }


}