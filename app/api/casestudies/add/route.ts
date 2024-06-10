import { create } from "@/crud/casestudy";
import { CreateCaseStudyDTO } from "@/crud/DTOs";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: NextRequest) {
  const caseStudy = (await req.json()) as CreateCaseStudyDTO;
  const newUser = await create(caseStudy, prisma);
  return NextResponse.json({ message: "Add success", data: newUser });
}
