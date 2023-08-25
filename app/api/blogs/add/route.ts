import { create, createBlogDTO } from "@/crud/blog";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {


    if (req.method === "POST") {
        const blog = await req.json() as createBlogDTO;
        const newUser = await create(blog, prisma);
        return NextResponse.json({ message: "Add success", data: newUser });
    }


}