import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { BlogCategory, GptCategory, ProductCategory } from "@prisma/client";
import { CreateCategory } from "@/crud/DTOs";
import {
    getCategories,
    readCategory,
    removeCategory,
    updateCategory,
} from "@/crud/categories";
import { CategoryType } from "@/types/global";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
    GET: get,
    PUT: put,
    DELETE: remove,
});

async function put(
    req: NextRequest,
    { params }: { params: { type: CategoryType; id: string } },
) {
    const categoryId = params.id as string;
    const category = (await req.json()) as CreateCategory;
    const session = await getServerSession(authOptions)
    if(!session) return NextResponse.json({ message: "Unauthorized" })
    let updatedCategory: ProductCategory | BlogCategory | GptCategory =
        await updateCategory(categoryId, category, params.type, session.user);

    return NextResponse.json({ message: "update success", data: updatedCategory });
}
async function remove(
    req: NextRequest,
    { params }: { params: { id: string; type: CategoryType } },
) {
    const session = await getServerSession(authOptions)
    if(!session) return NextResponse.json({ message: "Unauthorized" })
    const categoryId = params.id as string;
    await removeCategory(categoryId, params.type, session.user);
    return NextResponse.json({ message: "delete success" });
}

async function get(
    req: NextRequest,
    { params }: { params: { id: string; type: CategoryType } },
) {
    const session = await getServerSession(authOptions)
    if(!session) return NextResponse.json({ message: "Unauthorized" })
    const categoryId = params.id as string;
    const category = await readCategory(categoryId, params.type, session.user);

    return NextResponse.json({ data: category });
}
