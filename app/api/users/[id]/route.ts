import { prisma } from "@/lib/prisma";
import { CreateUserDTO, read, remove as removeUser, update } from "@/crud/user";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});
async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id as string;
  const user = (await req.json()) as CreateUserDTO;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  //console.log(user);
  const updatedUser = await update(userId, user, session.user);
  revalidatePath(`/dashboard/users/view/${userId}`);
  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const deleted = await removeUser(userId, session.user);
  return NextResponse.json({ message: "success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const user = await read(userId, session.user);
  return NextResponse.json({ data: user });
}
