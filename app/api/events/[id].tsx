import { read } from "@/crud/event";
import { NextApiRequest, NextApiResponse } from "next";
import {prisma } from "@/prisma/prismaClient";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    if(req.method ==="GET") {
        const eventId = req.query.id as string;
        const event =await read(eventId,prisma)
        res.status(200).json({ data: event })
    }
    if(req.method ==="PATCH") {
        res.status(200).json({ name: 'John Doe' })
    }
    if(req.method ==="DELETE") {
        res.status(200).json({ name: 'John Doe' })
    }
   
   
  }