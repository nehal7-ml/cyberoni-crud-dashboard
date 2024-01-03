import 'server-only';
import { PrismaClient } from "@prisma/client";
import { connectOrCreateObject as connectTag } from "./tags";
import { connectOrCreateObject as connectImage } from "./images";
import { CreateGptPromptDTO } from "./DTOs";
import { DisplayPrompt } from "./DTOs";

async function create(prompt: CreateGptPromptDTO, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;
    let createdprompt = await prompts.create({
        data: {
            ...prompt,
            tags: { connectOrCreate: connectTag(prompt.tags) },
            image: prompt.image ? { connect: { id: prompt.image.id! } } : {},
        }
    });
    return createdprompt
}

async function update(promptId: string, prompt: CreateGptPromptDTO, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;
    let UpdatedPrompt = await prompts.update({
        where: { id: promptId },
        data: {
            ...prompt,
            tags: { connectOrCreate: connectTag(prompt.tags) },
            image: prompt.image ? { connect: { id: prompt.image.id! } } : {},
        }
    });
    return UpdatedPrompt


}
async function remove(promptId: string, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;
    const existingprompt = await prompts.findUnique({ where: { id: promptId } })
    if (existingprompt) {
        await prompts.delete({ where: { id: promptId } })
    }
}
async function read(promptId: string, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;
    const existingprompt = await prompts.findUnique({
        where: { id: promptId }, include: {
            reviews: true,
            image: true,
            tags: true,
        }
    })
    if (existingprompt) return existingprompt as DisplayPrompt;

}
async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allPrompts = await prompts.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
        where: {
        },
        include: {
            // reviews: true,

        }
    })

    const totalCount = await prompts.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records: allPrompts, currentPage: page, totalPages, pageSize }

}

export { create, update, remove, read, getAll }