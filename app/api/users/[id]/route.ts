import { prisma } from "@/prisma/prismaClient";
import { CreateUserDTO, read, remove as removeUser, update } from "@/crud/user";
import { NextRequest, NextResponse } from 'next/server'
import apiHandler from "@/errorHandler";


export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get, PUT: put, DELETE: remove });
async function put(req: NextRequest, { params }: { params: { id: string } }) {

    const userId = params.id as string;
    const user = await req.json() as CreateUserDTO;
    //console.log(user);
    const updatedUser = await update(userId, user, prisma);
    return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id as string;
    const deleted = await removeUser(userId, prisma);
    return NextResponse.json({ message: "success" });
}


async function get(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = params.id as string;
    const user = await read(userId, prisma)
    return NextResponse.json({ data: user })


}