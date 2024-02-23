import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { read, remove as removeService, update } from "@/crud/service";
import { CreateServiceDTO } from "@/crud/DTOs";
import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
  PUT: put,
  DELETE: remove,
});
async function put(req: NextRequest, { params }: { params: { id: string } }) {
  const serviceId = params.id as string;
  const service = (await req.json()) as CreateServiceDTO;
  const updatedUser = await update(serviceId, service, prisma);
  return NextResponse.json({ message: "update success", data: updatedUser });
}
async function remove(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const serviceId = params.id as string;
  const deleted = await removeService(serviceId, prisma);
  return NextResponse.json({ message: "delete success" });
}

async function get(req: NextRequest, { params }: { params: { id: string } }) {
  const serviceId = params.id as string;
  const service = await read(serviceId, prisma);
  return NextResponse.json({ data: service });
}
