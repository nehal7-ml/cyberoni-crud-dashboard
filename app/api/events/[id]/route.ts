import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import {
  read,
  remove as removeEvent,
  update,
} from "@/crud/event";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { CreateEventDTO } from "@/crud/DTOs";
import { revalidatePath } from "next/cache";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});

async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const eventId = params.id as string;
  const event = (await req.json()) as CreateEventDTO;
  const updatedUser = await update(eventId, event, prisma);
  revalidatePath(`/dashboard/events/view/${eventId}`);

  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const eventId = params.id as string;
  const deleted = await removeEvent(eventId, prisma);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const eventId = params.id as string;
  const event = await read(eventId, prisma);
  return NextResponse.json({ data: event });
}
