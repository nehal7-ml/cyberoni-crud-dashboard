import { create, createEventDTO } from "@/crud/event";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient"

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    if(req.method ==="GET") {
        res.status(400).json({ error: 'Get is not Allowed on this path' })
    }
    if (req.method === "POST") {
        const newEvent = req.body as createEventDTO;
        const event = await create(newEvent, prisma)
        res.status(200).json({ message: 'added product', data: event })
    }
    if(req.method ==="PATCH") {
        res.status(400).json({ error: 'Patch is not Allowed on this path' })
    }
    if(req.method ==="DELETE") {
        res.status(400).json({ error: 'Delete is not Allowed on this path' })
    }
   
   
  }