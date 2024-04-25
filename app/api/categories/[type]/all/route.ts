
import { getCategories } from "@/crud/categories";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { CategoryType } from "@/types/global";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get });

async function get(req: Request, { params }: { params: { type: CategoryType } }) {

    const newCategory = await getCategories(params.type, prisma);
    return NextResponse.json({ message: "success", data: newCategory });

}
