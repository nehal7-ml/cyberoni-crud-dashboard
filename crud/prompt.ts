import "server-only";
import { PrismaClient } from "@prisma/client";
import { connectOrCreateObject as connectTag } from "./tags";
import { connectOrCreateObject as connectImage } from "./images";
import { CreateCategory, CreateGptPromptDTO, CreateTagDTO } from "./DTOs";
import { DisplayPrompt } from "./DTOs";
import { HttpError } from "@/lib/utils";

async function create(prompt: CreateGptPromptDTO, prismaClient: PrismaClient) {
  const prompts = prismaClient.gptPrompt;
  let createdprompt = await prompts.create({
    data: {
      description: prompt.description,
      best_of: prompt.best_of,
      botUrl: prompt.botUrl,
      conversationStarters: prompt.conversationStarters,
      costPerToken: prompt.costPerToken,
      frequency_penalty: prompt.frequency_penalty,
      model: prompt.model,
      presence_penalty: prompt.presence_penalty,
      max_tokens: prompt.max_tokens,
      prompt: prompt.prompt,
      profitMargin: prompt.profitMargin,
      seed: prompt.seed,
      startPhrase: prompt.startPhrase,
      sysCommands: prompt.sysCommands,
      steps: prompt.steps,
      stop : prompt.stop,
      stream  : prompt.stream,
      toolChoice: prompt.toolChoice,
      temperature: prompt.temperature,
      timesIntegrated: 0,
      timesUsed: 0,
      title: prompt.title,
      top_p: prompt.top_p,
      tools: {},
      variables: prompt.variables,
      category: prompt.category? {
        connectOrCreate: {
          where: { name: prompt.category.name! },
          create: {
            name: prompt.category.name!,
            parent: prompt.category.parent
              ? {
                  connect: {
                    id: prompt.category.parent.id,
                  },
                }
              : undefined,
          },
        },
      }: undefined,
      tags: { connectOrCreate: connectTag(prompt.tags, []).connectOrCreate },
      image: prompt.image ? { connect: { id: prompt.image.id! } } : {},
    },
  });
  return createdprompt;
}

async function update(
  promptId: string,
  prompt: CreateGptPromptDTO,
  prismaClient: PrismaClient,
) {
  const prompts = prismaClient.gptPrompt;
  let oldPrompt = await prompts.findUnique({ where: { id: promptId }, include: { image: true, tags: true } });
  if (!oldPrompt) throw HttpError(404, "Prompt not found");
  let UpdatedPrompt = await prompts.update({
    where: { id: promptId },
    data: {
      description: prompt.description,
      best_of: prompt.best_of,
      botUrl: prompt.botUrl,
      conversationStarters: prompt.conversationStarters,
      costPerToken: prompt.costPerToken,
      frequency_penalty: prompt.frequency_penalty,
      model: prompt.model,
      presence_penalty: prompt.presence_penalty,
      max_tokens: prompt.max_tokens,
      prompt: prompt.prompt,
      profitMargin: prompt.profitMargin,
      seed: prompt.seed,
      startPhrase: prompt.startPhrase,
      sysCommands: prompt.sysCommands,
      steps: prompt.steps,
      stop : prompt.stop,
      stream  : prompt.stream,
      toolChoice: prompt.toolChoice,
      temperature: prompt.temperature,
      timesIntegrated: 0,
      timesUsed: 0,
      title: prompt.title,
      top_p: prompt.top_p,
      tools: {},
      variables: prompt.variables,
      category: prompt.category
        ? {
            connectOrCreate: {
              where: { name: prompt.category.name! },
              create: {
                name: prompt.category.name!,
                parent: prompt.category.parent
                  ? {
                      connect: {
                        id: prompt.category.parent.id,
                      },
                    }
                  : undefined,
              },
            },
          }
        : undefined,
      tags: connectTag(prompt.tags, oldPrompt.tags),
      image: prompt.image ? { connect: { id: prompt.image.id! } } : {},
    },
  });
  return UpdatedPrompt;
}
async function remove(promptId: string, prismaClient: PrismaClient) {
  const prompts = prismaClient.gptPrompt;
  const existingprompt = await prompts.findUnique({ where: { id: promptId } });
  if (existingprompt) {
    await prompts.delete({ where: { id: promptId } });
  }
}
async function read(promptId: string, prismaClient: PrismaClient) {
  const prompts = prismaClient.gptPrompt;
  const existingPrompt = await prompts.findUnique({
    where: { id: promptId },
    include: {
      reviews: true,
      image: true,
      tags: true,
      tools: true,
      category:{
        include: {
          parent: true
        }
      },
    },
  });
  if (existingPrompt) return existingPrompt 
}
async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
  options?: {
    order: 'asc' | 'desc';
    orderby: 'updatedAt' | 'title';
  }
) {
  const prompts = prismaClient.gptPrompt;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let allPrompts = await prompts.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {},
    include: {
      // reviews: true,
    },
    orderBy: options? {
      [options.orderby]: options.order,
    }: {
      updatedAt: 'desc'
    }
  });

  const totalCount = await prompts.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allPrompts, currentPage: page, totalPages, pageSize };
}
export async function addCategories(newCategory: CreateCategory, prismaClient: PrismaClient,) {
  const categories = prismaClient.gptCategory;
  const record = await categories.create({
    data: {
      name: newCategory.name,
      children: {
        create: newCategory.children
      },
    }
  })

  return record
}
export async function getCategories(prismaClient: PrismaClient,) {
  const categories = prismaClient.gptCategory;
  const records = await categories.findMany({
    where: {
      parent: {
        is: null
      },
    },
    include: {
      children: true,
    }
  })

  return records

}

export { create, update, remove, read, getAll };
