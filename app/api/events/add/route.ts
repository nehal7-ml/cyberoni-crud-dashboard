import { CreateEventDTO } from "@/crud/DTOs";
import { create } from "@/crud/event";
import { authOptions } from "@/lib/nextAuthAdapter";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const event = (await req.json()) as CreateEventDTO;
    const session = await getServerSession(authOptions)
    if(!session) return NextResponse.json({ message: "Unauthorized" })
    const newEvent = await create(event, session?.user);
    revalidatePath("/dashboard/events/1");

    return NextResponse.json({ message: "Add success", data: newEvent });
  }
}
