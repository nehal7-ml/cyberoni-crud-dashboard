import { CreateCategory } from "@/crud/DTOs";
import { addCategory } from "@/crud/categories";

import apiHandler from "@/errorHandler";
import { authOptions } from "@/lib/nextAuthAdapter";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@/types/global";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request, { params }: { params: { type: CategoryType } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ message: "Unauthorized" })
  const category = (await req.json()) as CreateCategory;
  const newCategory = await addCategory(params.type, category, session.user);
  return NextResponse.json({ message: "Add success", data: newCategory });
}
