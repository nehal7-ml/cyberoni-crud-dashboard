import { create } from "@/crud/discount";
import { CreateDiscountDTO } from "@/crud/DTOs";
import apiHandler from "@/errorHandler";
import { HttpError } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: Request) {
  if (req.method === "POST") {
    const discount = (await req.json()) as CreateDiscountDTO;
    try {
      const newDiscount = await create(discount, prisma);
      return NextResponse.json({ message: "Add success", data: newDiscount });
    } catch (error) {
      console.log(error);
      const err = error as PrismaClientKnownRequestError;
      if (err.code === "P2002")
        return NextResponse.json(
          { message: "Duplicate Discount name" },
          { status: 400 },
        );
      else return NextResponse.json({ message: err.message }, { status: 400 });
    }
  }
}
