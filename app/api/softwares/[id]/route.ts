import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { CreateSoftwareProductDTO } from "@/crud/DTOs";
import { update, remove as removeSoftware, read } from "@/crud/softwareProduct";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id as string;

  const product = (await req.json()) as CreateSoftwareProductDTO;
  const updatedProduct = await update(productId, product, prisma);
  return NextResponse.json({ message: "update success", data: updatedProduct });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const productId = params.id as string;
  const deleted = await removeSoftware(productId, prisma);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id as string;
  const product = await read(productId, prisma);
  return NextResponse.json({ data: product });
}
