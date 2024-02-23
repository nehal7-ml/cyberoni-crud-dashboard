import { create, CreateUserDTO } from "@/crud/user";
import apiHandler from "@/errorHandler";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
  if (req.method === "POST") {
    const user = (await req.json()) as CreateUserDTO;
    const newUser = await create(user, prisma);
    return NextResponse.json(
      { message: "Add success", data: newUser },
      { status: 200 },
    );
  }
}
