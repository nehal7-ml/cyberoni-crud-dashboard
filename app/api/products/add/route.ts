import { create, CreateProductDTO } from "@/crud/product";
import apiHandler from "@/errorHandler";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

async function post(req: Request) {


    if (req.method === "POST") {
        const product = await req.json() as CreateProductDTO;
        const newProduct = await create(product, prisma);
        return NextResponse.json({ message: "Add success", data: newProduct });
    }


}

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });
