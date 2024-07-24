import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removeEvent, update } from "@/crud/referral";
import { CreateReferralDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { HttpError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuthAdapter";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const referralId = params.id as string;
  const referral = (await req.json()) as CreateReferralDTO;
  await fetch(referral.link).catch(() => { throw HttpError(406, "Link in unreachable"); });
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const updatedUser = await update(referralId, referral, session.user);
  revalidatePath(`/dashboard/referrals/view/${referralId}`);
  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const referralId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const deleted = await removeEvent(referralId, session.user);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const referralId = params.id as string;
  const session = await getServerSession(authOptions)
  if(!session) return NextResponse.json({ message: "Unauthorized" })
  const referral = await read(referralId, session.user);
  return NextResponse.json({ data: referral });
}
