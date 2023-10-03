import { create, createGptPromptDTO } from "@/crud/prompt";
import apiHandler from "@/errorHandler";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

export async function post(req: Request) {

    if (req.method === "POST") {
        const prompt = await req.json() as createGptPromptDTO;
        const newUser = await create(prompt, prisma);
        return NextResponse.json({ message: "Add success", data: newUser });
    }


}