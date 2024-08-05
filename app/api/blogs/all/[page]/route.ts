import { getAllBlogs, read, remove, update } from "@/crud/blog";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

const get = async (
  req: NextApiRequest,
  { params }: { params: { page: string, orgId: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" })
  const blogs = await getAllBlogs(
    parseInt(params.page),
    10,
    {
      id: session?.user?.id as string,
      role: session.user.role,
      orgId: params.orgId
    },

    {
      orderby: "createdAt",
      order: "desc",
      userId: session?.user?.id,
    },
  ); // skipping 10 record for every new page
  return NextResponse.json({ message: "found", data: blogs });
};

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get });
