import { CreateCategory } from "@/crud/DTOs";
import { addCategory } from "@/crud/categories";

import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@/types/global";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request, { params }: { params: { type: CategoryType } }) {
  if (req.method === "POST") {
    const category = (await req.json()) as CreateCategory;
    const newCategory = await addCategory(params.type, category, prisma);
    return NextResponse.json({ message: "Add success", data: newCategory });
  }
}
