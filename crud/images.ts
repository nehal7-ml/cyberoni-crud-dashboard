import "server-only";
import { deleteFile, uploadFile } from "@/lib/cloudinary";
import { Image, PrismaClient } from "@prisma/client";
import { CreateImageDTO } from "./DTOs";

export async function create(
  newImage: CreateImageDTO,
  prismaClient: PrismaClient,
) {
  const images = prismaClient.image;
  const newRecord = await images.create({ data: newImage });
  return newRecord;
}

export async function createMany(
  newImages: CreateImageDTO[],
  prismaClient: PrismaClient,
) {
  const images = prismaClient.image;
  const newRecords = await images.createMany({
    data: newImages,
    skipDuplicates: true,
  });
}

export async function createObject(image: CreateImageDTO | undefined) {
  if (image && image.src.startsWith("data:")) {
    const uploaded = await uploadFile(image.src, "raw");
    image.src = uploaded.secure_url;
  }
  return image;
}

export async function connectOrCreateObject(
  newImages: CreateImageDTO[],
  oldImages: Image[],
) {
  let imageConnect: {
    create: CreateImageDTO[];
    update?: { where: { id: string }; data: CreateImageDTO }[];
    delete?: { id: string }[];
  } = { create: [] };

  if (oldImages.length > 0)
    (imageConnect.update = []), (imageConnect.delete = []);
  const { filesToUpload, filesToDelete } = getUploadAndDeleteLists(
    oldImages,
    newImages,
  );

  for (let image of filesToUpload) {
    if (image && image.src.startsWith("data:")) {
      const uploaded = await uploadFile(image.src, "image");
      image.src = uploaded.secure_url;
    }
  }

  for (let image of filesToDelete) {
    const deleted = await deleteFile(image.src);
  }

  imageConnect.create = filesToUpload;
  if (filesToDelete)
    imageConnect.delete = filesToDelete as { id: string }[];
  newImages.forEach((image) => {
    if (image.id) {
      imageConnect.update?.push({ where: { id: image.id }, data: image });
    }
  });
  return imageConnect;
}

function getUploadAndDeleteLists(
  oldFiles: CreateImageDTO[],
  newFiles: CreateImageDTO[],
) {
  // Create a Set of unique IDs for both old and new files
  const oldFileIds = new Set(oldFiles.map((file) => file.id));
  const newFileIds = new Set(newFiles.map((file) => file.id));

  // Initialize arrays for upload and delete
  const filesToUpload = newFiles.filter((file) => !oldFileIds.has(file.id));
  const filesToDelete = oldFiles.filter((file) => !newFileIds.has(file.id));

  return {
    filesToUpload,
    filesToDelete: filesToDelete,
  };
}

export function createImageJson(images: {
  create: CreateImageDTO[];
  update?:
    | {
        where: {
          id: string;
        };
        data: CreateImageDTO;
      }[]
    | undefined;
  delete?:
    | {
        id: string;
      }[]
    | undefined;
}): CreateImageDTO[] {
  const updateImages: CreateImageDTO[] = images.update
    ? images.update?.map((update) => update.data)
    : [];
  const caseImage: CreateImageDTO[] = [...updateImages, ...images.create];

  return caseImage;
}
