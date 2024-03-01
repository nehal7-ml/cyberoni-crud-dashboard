import { create } from "@/crud/images";
import apiHandler from "@/errorHandler";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { Image } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const { POST, DELETE, GET, PATCH, PUT } = apiHandler({ POST: post });

async function post(req: NextRequest) {
  const { image, request } = (await req.json()) as {
    image: Image;
    request: "UPLOAD" | "DELETE";
  };

  if (request === "UPLOAD") {
    const uploadedImage = await uploadImage(image.src);
    const record = await create(
      {
        src: uploadedImage.secure_url,
        name: image.name,
      },
      prisma,
    );

    return NextResponse.json({ image: record });
  }

  if (request === "DELETE") {
    await deleteImage(image.src.split("/").slice(-1)[0].split(".")[0]);
    await prisma.image.delete({ where: { id: image.id } });

    return NextResponse.json({});
  }
}
