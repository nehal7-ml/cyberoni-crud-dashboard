import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { CreateReferralDTO, read, remove as removeEvent, update } from "@/crud/referral";
import { NextRequest, NextResponse } from 'next/server'
import apiHandler from "@/errorHandler";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get, PUT: put, DELETE: remove });

async function put(req: NextRequest, { params }: { params: { id: string } }) {

    const referralId = params.id as string;
    const referral = await req.json() as CreateReferralDTO;
    const updatedUser = await update(referralId, referral, prisma);
    return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(req: NextRequest, { params }: { params: { id: string } }) {
    const referralId = params.id as string;
    const deleted = await removeEvent(referralId, prisma);
    return NextResponse.json({ message: "delete success" });
}


async function get(req: NextRequest, { params }: { params: { id: string } }) {
    const referralId = params.id as string;
    const referral = await read(referralId, prisma)
    return NextResponse.json({ data: referral })


}