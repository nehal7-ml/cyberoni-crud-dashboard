import { create } from "@/crud/casestudy";
import { CreateCaseStudyDTO } from "@/crud/DTOs";
import apiHandler from "@/errorHandler";
import { authOptions } from "@/lib/nextAuthAdapter";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: NextRequest) {
  const caseStudy = (await req.json()) as CreateCaseStudyDTO;
  const session = await getServerSession(authOptions) ;
  caseStudy.userId = session?.user?.id ?? undefined;
  const newUser = await create(caseStudy, prisma);
  return NextResponse.json({ message: "Add success", data: newUser });
}
