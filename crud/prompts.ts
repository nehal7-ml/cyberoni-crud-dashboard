import { GptPrompt, PrismaClient } from "@prisma/client";
import { connectOrCreateObject as connectTag, createTagDTO } from "./tags";
import { connectOrCreateObject as connectImage, createImageDTO } from "./images";
import { createSupplierDTO } from "./supplier";

export type createGptPromptDTO = {
    id: string;
    description: string;
    prompt: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    best_of: number;
    frequency_penalty: number;
    presence_penalty: number;
    stop: string;     // comma separaetd sequences
    timesUsed: number;
    timesIntegrated: number;
    costPerToken: number;
    profitMargin: number;
    tags: createTagDTO[];
    image: createImageDTO;

}
async function create(prompt: createGptPromptDTO, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;
    let createdprompt = await prompts.create({
        data: {
            ...prompt,
            tags: { connectOrCreate: connectTag(prompt.tags) },
            image: { create: prompt.image },
        }
    });
    return createdprompt
}

async function update(promptId: string, prompt: createGptPromptDTO, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;
    let UpdatedPrompt = await prompts.update({
        where: { id: promptId },
        data: {
            ...prompt,
            tags: { connectOrCreate: connectTag(prompt.tags) },
            image: { create: prompt.image },
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
    if (existingprompt) return existingprompt;

}

async function getAll(offset: number, prismaClient: PrismaClient) {
    const prompts = prismaClient.gptPrompt;
    let allGptPrompts = await prompts.findMany({
        skip: offset, take: 30,
        where: {
        },
        include: {
            reviews: true,
            image: true,
            tags: true,
        }
    })

    return allGptPrompts
}


export { create, update, remove, read, getAll }