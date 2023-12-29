import { PrismaClient, Tag } from "@prisma/client"
export type CreateTagDTO = {
    id?: string;
    name: string;
}

export async function create(newTag: CreateTagDTO, prismaClient: PrismaClient) {
    const tags = prismaClient.tag;
    const newRecord = await tags.create({ data: newTag });
    return newRecord;
}

export async function createMany(newTags: CreateTagDTO[], prismaClient: PrismaClient) {
    const tags = prismaClient.tag;
    const newRecords = tags.createMany({ data: newTags });

}

export function connectOrCreateObject(newTags: CreateTagDTO[]) {

    let tagConnect: { where: { name: string; }; create: CreateTagDTO; }[] = []
    newTags.forEach(tag => {
        if(!tag.id) tagConnect.push({ where: { name: tag.name }, create: tag })

    })
    return tagConnect

}