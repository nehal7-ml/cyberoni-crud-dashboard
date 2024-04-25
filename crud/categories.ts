import { PrismaClient } from "@prisma/client";
import { CategoryType } from "@/types/global";
import { CreateCategory } from "./DTOs";

// Get categories based on the type
async function getCategories(type: CategoryType, prisma: PrismaClient) {
    switch (type) {
        case "product":
            return await prisma.productCategory.findMany();
        case "prompt":
            return await prisma.gptCategory.findMany();
        case "blog":
            return await prisma.blogCategory.findMany();
        case "service":
            return await prisma.service.findMany();
        default:
            throw new Error(`Unknown category type: ${type}`);
    }
}

// Update a specific category by id
async function updateCategory(id: string, category: CreateCategory, type: CategoryType, prisma: PrismaClient) {
    switch (type) {
        case "product":
            return await prisma.productCategory.update({
                where: { id },
                data: {
                    name: category.name,
                    children: {
                        create: category.children,

                    }
                },
            });
        case "prompt":
            return await prisma.gptCategory.update({
                where: { id },
                data: {
                    name: category.name,
                    children: {
                        create: category.children
                    }
                },
            });
        case "blog":
            return await prisma.blogCategory.update({
                where: { id },
                data: {
                    name: category.name,
                    children: {
                        create: category.children
                    }
                },
            });

        default:
            throw new Error(`Unknown category type: ${type}`);
    }
}

// Add a new category
async function addCategory(type: CategoryType, category: CreateCategory, prisma: PrismaClient) {
    const categories = prisma[type === 'blog' ? 'blogCategory' : type === 'prompt' ? 'gptCategory' : 'productCategory']
    switch (type) {
        case "product":
            return await prisma.productCategory.create({
                data: {
                    name: category.name,
                    children: {
                        create: category.children
                    }
                }

            });
        case "prompt":
            return await prisma.gptCategory.create({
                data: {
                    name: category.name,
                    children: {
                        create: category.children
                    }
                }
            });
        case "blog":
            return await prisma.blogCategory.create({
                data: {
                    name: category.name,
                    children: {
                        create: category.children
                    }
                }
            });

        default:
            throw new Error(`Unknown category type: ${type}`);
    }
}

// Remove a category by id
async function removeCategory(id: string, type: CategoryType, prisma: PrismaClient) {
    switch (type) {
        case "product":
            await prisma.product.updateMany({
                where: { productCategoryId: id },
                data: { productCategoryId: null },
            });
            return await prisma.productCategory.delete({ where: { id } });
        case "prompt":
            await prisma.gptPrompt.updateMany({
                where: { gptCategoryId: id },
                data: { gptCategoryId: null },
            });
            return await prisma.gptCategory.delete({ where: { id } });
        case "blog":

            await prisma.blog.updateMany({
                where: { blogCategoryId: id },
                data: { blogCategoryId: null },
            });
            return await prisma.blogCategory.delete({ where: { id } });
        default:
            throw new Error(`Unknown category type: ${type}`);
    }
}

async function readCategory(id: string, type: CategoryType, prisma: PrismaClient) {
    switch (type) {
        case "product":
            return await prisma.productCategory.findUnique({ where: { id } });
        case "prompt":
            return await prisma.gptCategory.findUnique({ where: { id } });
        case "blog":
            return await prisma.blogCategory.findUnique({ where: { id } });
    }

}

export { getCategories, updateCategory, addCategory,readCategory, removeCategory };
