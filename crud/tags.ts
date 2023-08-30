import { PrismaClient, Tag } from "@prisma/client"
export type createTagDTO = {
    id?: string
    name: string;
}


export async function create(newTag: createTagDTO, prismaClient: PrismaClient) {
    const tags = prismaClient.tag;
    const newRecord = await tags.create({ data: newTag });
    return newRecord;
}

export async function createMany(newTags: createTagDTO[], prismaClient: PrismaClient) {
    const tags = prismaClient.tag;
    const newRecords = tags.createMany({ data: newTags });

}

export function connectOrCreateObject(newTags: createTagDTO[]) {

    let tagConnect: { where: { name: string; }; create: createTagDTO; }[] = []
    newTags.forEach(tag => {
        tagConnect.push({ where: { name: tag.name }, create: tag })

    })
    return tagConnect

}