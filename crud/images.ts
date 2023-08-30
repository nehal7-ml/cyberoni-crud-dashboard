import { PrismaClient } from "@prisma/client";

export type createImageDTO = {
    id?: string;
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

    let imageConnect: { create?: createImageDTO; where?: { id: string } }[] = []
    newImages.forEach(image => {
        const connect = image.id ? { where: { id: image.id } } : { create: image }
        imageConnect.push(connect)
    })
    return imageConnect

}