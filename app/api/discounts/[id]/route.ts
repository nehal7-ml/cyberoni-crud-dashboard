import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removeEvent, update } from "@/crud/discount";
import { CreateDiscountDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { HttpError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/nextAuthAdapter";
import { getServerSession } from "next-auth";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const discountId = params.id as string;
  const discount = (await req.json()) as CreateDiscountDTO;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const updatedUser = await update(discountId, discount, session.user);
  revalidatePath(`/dashboard/discounts/view/${discountId}`);
  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const discountId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const deleted = await removeEvent(discountId, session.user);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const discountId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const discount = await read(discountId, session.user);
  return NextResponse.json({ data: discount });
}
