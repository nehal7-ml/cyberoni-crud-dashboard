import { getAll, read, remove, update } from "@/crud/casestudy";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

const get = async (
  req: NextApiRequest,
  { params }: { params: { page: string } },
) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" });
  let role = session?.user?.role;
  const caseStudies = await getAll(
    parseInt(params.page),
    10,
    session.user,
  ); // skipping 10 record for every new page
  return NextResponse.json({ message: "found", data: caseStudies });
};

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ GET: get });
