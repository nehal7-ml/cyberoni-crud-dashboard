import { Blog, PrismaClient, User } from "@prisma/client";
import { connectOrCreateObject as connectTags, createTagDTO } from "./tags";
import { connectOrCreateObject as connectImages, createImageDTO } from "./images";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export type createBlogDTO = {
    title: string;
    subTitle: string;
    description: string;
    featured: boolean;
    date: Date;
    content: string;
    template: string;
    author: { id: string },
    images: createImageDTO[],
    tags: createTagDTO[]
}

export type displayBlogDTO = Blog

async function create(blog: createBlogDTO, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;
    let createdblog = await blogs.create({
        data: {
            ...blog,
            images: { create: blog.images },
            tags: { connectOrCreate: connectTags(blog.tags) },
            author: { connect: { id: blog.author.id } }
        }
    });
    return createdblog


}

async function update(blogId: string, blog: createBlogDTO, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;
    const updatedBlog = await blogs.update({
        where: { id: blogId },
        data: {
            ...blog,
            images: { connectOrCreate: connectImages(blog.images) },
            tags: { connectOrCreate: connectTags(blog.tags)},
            author: { connect: { id: blog.author.id } }
        }
    })
    return updatedBlog

}


async function remove(blogId: string, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;
    const existingblog = await blogs.findUnique({ where: { id: blogId } })
    if (existingblog) {
        await blogs.delete({ where: { id: blogId } })
    }
}
async function read(blogId: string, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;
    const existingblog = await blogs.findUnique({
        where: { id: blogId },
        select: {
            userId: false,
            content: true,
            date: true,
            description: true,
            featured: true,
            id: true,
            title: true,
            subTitle: true,
            template: true,
            author: {
                select: {
                    id: true,
                    email: true
                }
            },
            tags: true,
            images: true
        }
    })
    if (existingblog) return existingblog;

}

async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allBlogs = await blogs.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
        where: {
        },
        include: {
            // reviews: true,
            tags: true

        }
    })

    const totalCount = await blogs.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records: allBlogs, currentPage: page, totalPages, pageSize }

}



export { create, update, remove, read, getAll }