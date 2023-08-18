import { createProductDTO, read, remove, update } from "@/crud/product";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        const productId = req.query.id as string;
        const product = await read(productId, prisma)
        res.status(200).json({ message: "found", data: product })
    }
    if (req.method === "PUT") {
        const productId = req.query.id as string;
        const product = req.body as createProductDTO
        await update(productId, product, prisma)
        res.status(200).json({ message: 'Product updated' })
    }
    if (req.method === "DELETE") {
        const productId = req.query.id as string;
        await remove(productId, prisma);
        res.status(200).json({ message: 'John Doe' })
    }


}