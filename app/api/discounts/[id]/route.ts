import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removeEvent, update } from "@/crud/discount";
import { CreateDiscountDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { HttpError } from "@/lib/utils";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const discountId = params.id as string;
  const discount = (await req.json()) as CreateDiscountDTO;
  const updatedUser = await update(discountId, discount, prisma);
  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const discountId = params.id as string;
  const deleted = await removeEvent(discountId, prisma);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const discountId = params.id as string;
  const discount = await read(discountId, prisma);
  return NextResponse.json({ data: discount });
}
