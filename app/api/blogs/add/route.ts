import { create } from "@/crud/blog";
import { CreateBlogDTO } from "@/crud/DTOs";
import apiHandler from "@/errorHandler";
import { authOptions } from "@/lib/nextAuthAdapter";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
    const blog = (await req.json()) as CreateBlogDTO;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" })
    const newUser = await create(blog, session.user);
    revalidatePath("/dashboard/blogs/1");
    return NextResponse.json({ message: "Add success", data: newUser });
}
