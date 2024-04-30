import { NextRequest, NextResponse } from "next/server";
import apiHandler from "@/errorHandler";
import { FileType, deleteFile, uploadFile } from "@/lib/cloudinary";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: NextRequest) {
  const request = (await req.json()) as { fileType: FileType } & (
    | { file: string; requestType: "UPLOAD" }
    | { requestType: "DELETE"; src: string }
  );
  if (request.requestType === "UPLOAD") {
    const response = await uploadFile(request.file as string, request.fileType);
    return NextResponse.json({
      message: "success",
      data: { url: response.secure_url },
    });
  }

  if (request.requestType === "DELETE") {
    const response = await deleteFile(request.src as string);
    return NextResponse.json({
      message: "success",
      data: { url: response.secure_url },
    });
  }
}
