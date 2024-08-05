import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { getAll } from "@/crud/softwareProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

const get = async (
  req: NextApiRequest,
  { params }: { params: { page: string } },
) => {
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const products = await getAll(parseInt(params.page), 10, session.user); // skipping 10 record for every new page
  console.log(products);
  return NextResponse.json({ message: "found", data: products });
};

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get });
