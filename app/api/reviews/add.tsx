import { create, createReviewDTO } from "@/crud/review";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        res.status(405).json({ error: 'Get is not Allowed on this path' })
    }
    if (req.method === "POST") {
        const newReview = req.body as createReviewDTO;
        const review = await create(newReview, prisma)
        res.status(200).json({ message: 'added product', data: review })
    }
    if (req.method === "PATCH") {
        res.status(405).json({ error: 'Patch is not Allowed on this path' })
    }
    if (req.method === "DELETE") {
        res.status(405).json({ error: 'Delete is not Allowed on this path' })
    }

}