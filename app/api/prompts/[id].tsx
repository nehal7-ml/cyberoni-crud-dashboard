import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createGptPromptDTO, read, remove, update } from "@/crud/prompts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        const promptId = req.query.id as string;
        const prompt = await read(promptId, prisma)
        res.status(200).json({ data: prompt })

    }
    if (req.method === "PUT") {
        const promptId = req.query.id as string;
        const prompt = req.body as createGptPromptDTO;
        const updatedUser = await update(promptId, prompt, prisma);
        res.status(200).json({ message: "update success", data: updatedUser });
    }
    if (req.method === "DELETE") {
        const promptId = req.query.id as string;
        const deleted = await remove(promptId, prisma);
        res.status(200).json({ message: "delete success" });

    }
    if(req.method ==="POST") {
        res.status(405).json({ error: 'POST is not Allowed on this path' })
    }


}