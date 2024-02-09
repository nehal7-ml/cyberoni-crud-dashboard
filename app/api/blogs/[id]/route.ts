import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removeBlog, update } from "@/crud/blog";
import { CreateBlogDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from 'next/server'
import apiHandler from "@/errorHandler";


export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get, PUT: put, DELETE: remove });

async function put(req: NextRequest, { params }: { params: { id: string } }) {

    const blogID = params.id as string;
    const blog = await req.json() as CreateBlogDTO;
    const updatedUser = await update(blogID, blog, prisma);
    return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(req: NextRequest, { params }: { params: { id: string } }) {
    const blogID = params.id as string;
    const deleted = await removeBlog(blogID, prisma);
    return NextResponse.json({ message: "delete success" });
}


async function get(req: NextRequest, { params }: { params: { id: string } }) {
    const blogID = params.id as string;
    const blog = await read(blogID, prisma)
    return NextResponse.json({ data: blog })


}