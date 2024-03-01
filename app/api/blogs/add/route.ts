import { create } from "@/crud/blog";
import { CreateBlogDTO } from "@/crud/DTOs";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
  if (req.method === "POST") {
    const blog = (await req.json()) as CreateBlogDTO;
    const newUser = await create(blog, prisma);
    return NextResponse.json({ message: "Add success", data: newUser });
  }
}
