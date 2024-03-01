import { create } from "@/crud/prompt";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
  if (req.method === "POST") {
    const prompt = (await req.json()) as CreateGptPromptDTO;
    const newUser = await create(prompt, prisma);
    return NextResponse.json({ message: "Add success", data: newUser });
  }
}
