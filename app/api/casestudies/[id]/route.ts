import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removeCaseStudy, update } from "@/crud/casestudy";
import { CreateCaseStudyDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const caseStudyId = params.id as string;
  const caseStudy = (await req.json()) as CreateCaseStudyDTO;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" })
  const updatedUser = await update(caseStudyId, caseStudy, session.user);
  revalidatePath(`/dashboard/casestudies/view/${caseStudyId}`);

  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const casestudyID = params.id as string;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" })
  const deleted = await removeCaseStudy(casestudyID, session.user);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const casestudyID = params.id as string;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" })
  const casestudy = await read(casestudyID, session.user);
  return NextResponse.json({ data: casestudy });
}
