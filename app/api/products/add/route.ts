import { create, createProductDTO } from "@/crud/product";
import { Product } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        res.status(405).json({ error: 'Get is not Allowed on this path' })
    }
    if (req.method === "POST") {
        const newProduct = req.body as createProductDTO
        const product=  await create(newProduct, prisma)
        res.status(200).json({ message: 'Product Added', data: product })
    }
    if (req.method === "PUT") {
        res.status(405).json({ error: 'PUT is not Allowed on this path' })
    }
    if (req.method === "DELETE") {
        res.status(405).json({ error: 'Delete is not Allowed on this path' })
    }

}