import "server-only";
import { PrismaClient, Tag } from "@prisma/client";
import { CreateTagDTO } from "./DTOs";
import { disconnect } from "process";
export async function create(newTag: CreateTagDTO, prismaClient: PrismaClient) {
  const tags = prismaClient.tag;
  const newRecord = await tags.create({ data: newTag });
  return newRecord;
}

export async function createMany(
  newTags: CreateTagDTO[],
  prismaClient: PrismaClient,
) {
  const tags = prismaClient.tag;
  const newRecords = tags.createMany({ data: newTags });
}

export function connectOrCreateObject(newTags: CreateTagDTO[], oldTags: CreateTagDTO[]) {
  let tagConnect: { where: { name: string }; create: CreateTagDTO }[] = [];
  let toDelete: { name: string }[] = determineTagsToDisconnect(newTags, oldTags);
  newTags.forEach((tag) => {
    if (!tag.id) tagConnect.push({ where: { name: tag.name }, create: tag });
  });
  return { connectOrCreate: tagConnect, disconnect: toDelete };
}


function determineTagsToDisconnect(newTags: CreateTagDTO[], oldTags: CreateTagDTO[]) {
  // Create a Set of tag names from the new list
  const newTagNames = new Set(newTags.map(tag => tag.name));

  // Filter the old list to find tags that are not present in the new list
  const tagsToDelete = oldTags.filter(tag => !newTagNames.has(tag.name));

  return tagsToDelete;
}
