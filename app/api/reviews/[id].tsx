import { read } from "@/crud/review";
import { NextApiRequest, NextApiResponse } from "next";
import {prisma } from "@/prisma/prismaClient";
export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    if(req.method ==="GET") {
        const reviewId = req.query.id as string;
        const review =await read(reviewId,prisma)
        res.status(200).json({ data: review })
    }
    if (req.method === "PATCH") {
        res.status(400).json({ error: 'Patch is not Allowed on this path' })
    }
    if (req.method === "DELETE") {
        res.status(400).json({ error: 'Delete is not Allowed on this path' })
    }
   
  }