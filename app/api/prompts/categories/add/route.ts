
import { CreateCategory, CreateTagDTO } from "@/crud/DTOs";
import { addCategories } from "@/crud/prompt";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
  if (req.method === "POST") {
    const category = (await req.json()) as CreateCategory;
    const newCategory = await addCategories(category, prisma);
    return NextResponse.json({ message: "Add success", data: newCategory });
  }
}
