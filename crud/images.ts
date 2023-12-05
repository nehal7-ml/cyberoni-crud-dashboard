import { PrismaClient } from "@prisma/client";
import { connect } from "http2";

export type CreateImageDTO = {
    id?: string | undefined;
    name?: string | undefined | null;
    src: string;
}

export const ImageSchema = {
    "type": "object",
    "properties": {
        "id": { "type": ["string"] },
        "name": { "type": ["string"] },
        "src": { "type": "string" }
    },
    "required": ["src"]
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

    let imageConnect: { create: CreateImageDTO[]; connect: { id: string }[] } = { create: [], connect: [] }
    newImages.forEach(image => {
        if (image.id) {

            imageConnect.connect.push({ id: image.id })
        } else {
            imageConnect.create.push(image)
        }
    })
    return imageConnect

}