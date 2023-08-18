import { createServiceDTO, read, update } from "@/crud/service";
import { NextApiRequest, NextApiResponse } from "next";
import {prisma } from "@/prisma/prismaClient";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    if(req.method ==="GET") {
        const serviceId = req.query.id as string;
        const service =await read(serviceId,prisma)
        res.status(200).json({ data: service })
    }
    if(req.method ==="PUT") {
        const serviceId = req.query.id as string;
        const service = req.body as createServiceDTO
        await update(serviceId, service, prisma)
        res.status(200).json({ message: 'Service updated' })
    }
    if(req.method ==="DELETE") {
        res.status(200).json({ name: 'John Doe' })
    }
   
   
  }