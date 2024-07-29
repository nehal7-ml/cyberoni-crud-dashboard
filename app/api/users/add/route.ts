import { create, CreateUserDTO } from "@/crud/user";
import apiHandler from "@/errorHandler";
import { authOptions } from "@/lib/nextAuthAdapter";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
  if (req.method === "POST") {

    const user = (await req.json()) as CreateUserDTO;
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" })

    if (user.role === "ADMIN") {
      if (session?.user.role !== "SUPERUSER" && session?.user.role !== "ADMIN") return NextResponse.json({ message: "Unauthorized Can't add admin" });

    }

    if (session?.user.role !== "SUPERUSER" && user.role == "SUPERUSER") return NextResponse.json({ message: "Unauthorized Can't add super user" });

    const newUser = await create(user, session?.user);
    return NextResponse.json(
      { message: "Add success", data: newUser },
      { status: 200 },
    );
  }
}
