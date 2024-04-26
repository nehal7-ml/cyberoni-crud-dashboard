import apiHandler from "@/errorHandler";
import { NextRequest, NextResponse, userAgent } from "next/server";
import ogs from "fetch-opengraph";
import urlMetadata from "url-metadata";
export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({
  GET: get,
});

async function get(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") as string;
  const metadata = await urlMetadata(url, {
    requestHeaders: {
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
  });
  const result = await ogs.fetch(url, {
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  });
  return NextResponse.json({  og: result, metadata }, { status: 200 });
}
