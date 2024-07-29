import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { CreateSoftwareProductDTO } from "@/crud/DTOs";
import { update, remove as removeSoftware, read } from "@/crud/softwareProduct";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const product = (await req.json()) as CreateSoftwareProductDTO;
  const updatedProduct = await update(productId, product, session.user);
  revalidatePath(`/dashboard/softwares/view/${productId}`);
  return NextResponse.json({ message: "update success", data: updatedProduct });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const productId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const deleted = await removeSoftware(productId, session.user);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const product = await read(productId, session.user);
  return NextResponse.json({ data: product });
}
