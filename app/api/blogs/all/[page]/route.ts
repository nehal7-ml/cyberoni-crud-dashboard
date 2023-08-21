import { getAll, read, remove, update } from "@/crud/blog";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        const page = parseInt(req.query.page as string);
        const blog = await getAll((page - 1) * 10, prisma)  // skipping 10 record for every new page
        res.status(200).json({ message: "found", data: blog })
    }
    if (req.method === "POST") {
        res.status(405).json({ error: 'POST is not Allowed on this path' })
    }
    if (req.method === "PUT") {
        res.status(405).json({ error: 'PUT is not Allowed on this path' })
    }
    if (req.method === "DELETE") {
        res.status(405).json({ error: 'Delete is not Allowed on this path' })
    }

}


