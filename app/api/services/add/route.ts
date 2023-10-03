import { create, createServiceDTO } from "@/crud/service";
import apiHandler from "@/errorHandler";
import { prisma } from "@/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";


export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });


async function post(req: Request) {


    if (req.method === "POST") {
        const service = await req.json() as createServiceDTO;
        const newService = await create(service, prisma);
        return NextResponse.json({ message: "Add success", data: newService });
    }


}