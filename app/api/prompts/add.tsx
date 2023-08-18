import { create, createGptPromptDTO } from "@/crud/prompts";
import { GptPrompt } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        res.status(405).json({ error: 'Get is not Allowed on this path' })
    }
    if (req.method === "POST") {
        const newPrompt = req.body as createGptPromptDTO
        const prompt=  await create(newPrompt, prisma)
        res.status(200).json({ message: 'Prompt Added', data: prompt })
    }
    if (req.method === "PUT") {
        res.status(405).json({ error: 'PUT is not Allowed on this path' })
    }
    if (req.method === "DELETE") {
        res.status(405).json({ error: 'Delete is not Allowed on this path' })
    }

}