import { PrismaClient } from "@prisma/client";

export type CreateImageDTO = {
    id?: string | undefined;
    name?: string | undefined | null;
    src: string;
}


export async function create(newImage: CreateImageDTO, prismaClient: PrismaClient) {
    const images = prismaClient.image;
    const newRecord = await images.create({ data: newImage });
    return newRecord;
}


export async function createMany(newImages: CreateImageDTO[], prismaClient: PrismaClient) {
    const images = prismaClient.image;
    const newRecords = await images.createMany({ data: newImages, skipDuplicates: true, });

}


export function connectOrCreateObject(newImages: CreateImageDTO[]) {

    let imageConnect: { create: CreateImageDTO; where: { id: string }; }[] = []
    newImages.forEach(image => {
        imageConnect.push({ where: { id: image.id || "" }, create: image })
    })
    return imageConnect

}