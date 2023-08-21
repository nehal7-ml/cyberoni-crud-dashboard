import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prismaClient";
import { createBlogDTO, read, remove, update } from "@/crud/blog";
import { NextResponse } from 'next/server'


export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELTE = handler;



async function handler(req: NextApiRequest, { params }: { params: { id: string } } ) {

    if (req.method === "GET") {
        const blogId = params.id as string;
        const blog = await read(blogId, prisma)
        return NextResponse.json({ data: blog })

    }
    if (req.method === "PUT") {
        const blogId = params.id as string;
        const blog = req.body as createBlogDTO;
        const updatedUser = await update(blogId, blog, prisma);
        return NextResponse.json({ message: "update success", data: updatedUser });
    }
    if (req.method === "DELETE") {
        const blogId = params.id as string;
        const deleted = await remove(blogId, prisma);
        return NextResponse.json({ message: "delete success" });

    }
    if(req.method ==="POST") {
        return NextResponse.error()
    }


}