import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removePrompt, update } from "@/crud/prompt";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { revalidatePath } from "next/cache";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const promptId = params.id as string;
  const prompt = (await req.json()) as CreateGptPromptDTO;
  const updatedPrompt = await update(promptId, prompt, prisma);
  revalidatePath(`/dashboard/prompts/view/${promptId}`);
  return NextResponse.json({ message: "update success", data: updatedPrompt});
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const promptId = params.id as string;
  const deleted = await removePrompt(promptId, prisma);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const promptId = params.id as string;
  const prompt = await read(promptId, prisma);
  return NextResponse.json({ data: prompt });
}
