
import { CreateSoftwareProductDTO } from "@/crud/DTOs";
import { create } from "@/crud/softwareProduct";
import apiHandler from "@/errorHandler";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function post(req: Request) {
  if (req.method === "POST") {
    const product = (await req.json()) as CreateSoftwareProductDTO;
    const newProduct = await create(product, prisma);
    return NextResponse.json({ message: "Add success", data: newProduct });
  }
}

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });
