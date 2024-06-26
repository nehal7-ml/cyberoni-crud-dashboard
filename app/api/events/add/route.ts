import { CreateEventDTO } from "@/crud/DTOs";
import { create } from "@/crud/event";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const event = (await req.json()) as CreateEventDTO;
    const newEvent = await create(event, prisma);
    revalidatePath("/dashboard/events/1");

    return NextResponse.json({ message: "Add success", data: newEvent });
  }
}
