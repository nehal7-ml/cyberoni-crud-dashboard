import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removeCaseStudy, update } from "@/crud/casestudy";
import { CreateCaseStudy } from "@/crud/DTOs";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { revalidatePath } from "next/cache";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const caseStudyId = params.id as string;
  const caseStudy = (await req.json()) as CreateCaseStudy;
  const updatedUser = await update(caseStudyId, caseStudy, prisma);
  revalidatePath(`/dashboard/casestudies/view/${caseStudyId}`);

  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const casestudyID = params.id as string;
  const deleted = await removeCaseStudy(casestudyID, prisma);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const casestudyID = params.id as string;
  const casestudy = await read(casestudyID, prisma);
  return NextResponse.json({ data: casestudy });
}
