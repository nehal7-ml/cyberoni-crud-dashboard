import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createEventDTO, read, remove, update } from "@/crud/event";
import { NextResponse } from 'next/server'


export const GET = handler;
export const PUT = handler;
export const DELTE = handler;



async function handler(req: Request, { params }: { params: { id: string } } ) {

    if (req.method === "GET") {
        const eventId = params.id as string;
        const event = await read(eventId, prisma)
        return NextResponse.json({ data: event })

    }
    if (req.method === "PUT") {
        const eventId = params.id as string;
        const event = await req.json() as createEventDTO;
        const updatedEvent = await update(eventId, event, prisma);
        return NextResponse.json({ message: "update success", data: updatedEvent });
    }
    if (req.method === "DELETE") {
        const eventId = params.id as string;
        const deleted = await remove(eventId, prisma);
        return NextResponse.json({ message: "delete success" });

    }


}