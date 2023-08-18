import { create, createServiceDTO } from "@/crud/service";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient"

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    if(req.method ==="GET") {
        res.status(400).json({ error: 'Get is not Allowed on this path' })
    }
    if (req.method === "POST") {
        const newService = req.body as createServiceDTO;
        const service = await create(newService, prisma)
        res.status(200).json({ message: 'added product', data: service })
    }
    if(req.method ==="PATCH") {
        res.status(400).json({ error: 'Patch is not Allowed on this path' })
    }
    if(req.method ==="DELETE") {
        res.status(400).json({ error: 'Delete is not Allowed on this path' })
    }
   
   
  }