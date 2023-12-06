import { create, CreateReferralDTO } from "@/crud/referral";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    if (req.method === "POST") {
        const referral = await req.json() as CreateReferralDTO;
        const newEvent = await create(referral, prisma);
        return NextResponse.json({ message: "Add success", data: newEvent });
    }


}