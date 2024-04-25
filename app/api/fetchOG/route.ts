import apiHandler from "@/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import ogs from "fetch-opengraph";
export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
});

async function get(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") as string;
  const  result  = await ogs.fetch(url);
  return NextResponse.json({ data:result }, { status: 200 });
}
