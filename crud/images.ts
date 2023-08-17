import { PrismaClient } from "@prisma/client";

export type createImageDTO = {
    name?: string;
    src: string;
}


export async function create(newImage: createImageDTO, prismaClient: PrismaClient) {
    const images = prismaClient.image;
    const newRecord = await images.create({ data: newImage });
    return newRecord;
}


export async function createMany(newImages: createImageDTO[], prismaClient: PrismaClient) {
    const images = prismaClient.image;
    const newRecords = await images.createMany({ data: newImages, skipDuplicates: true, });

}


export function connectOrCreateObject(newImages: createImageDTO[]) {

    let imageConnect: { create: createImageDTO; }[] = []
    newImages.forEach(image => {
        imageConnect.push({ create: image })
    })
    return imageConnect

}