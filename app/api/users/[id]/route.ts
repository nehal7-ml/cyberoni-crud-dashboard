import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createUserDTO, read, remove, update } from "@/crud/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        const userId = req.query.id as string;
        const user = await read(userId, prisma)
        res.status(200).json({ data: user })

    }
    if (req.method === "PUT") {
        const userId = req.query.id as string;
        const user = req.body as createUserDTO;
        const updatedUser = await update(userId, user, prisma);
        res.status(200).json({ message: "update success", data: updatedUser });
    }
    if (req.method === "DELETE") {
        const userId = req.query.id as string;
        const deleted = await remove(userId, prisma);
        res.status(200).json({ message: "delete success" });

    }
    if(req.method ==="POST") {
        res.status(405).json({ error: 'POST is not Allowed on this path' })
    }


}