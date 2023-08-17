import { Blog, PrismaClient, User } from "@prisma/client";


export type createBlogDTO = {
    title: string;
    subTitle: string;
    description: string;
    featured: boolean;
    date: Date;
    content: string;
    template: string;
    author: User
}

async function create(blog: createBlogDTO, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;
    let createdblog = await blogs.create({ data: { ...blog, author: { connect: { id: blog.author.id } } } });
    return createdblog


}

async function update(blogId: string, blog: createBlogDTO, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;
    const updatedBlog = await blogs.update({
        where: { id: blogId },
        data: {
            ...blog,
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
    const existingblog = await blogs.findUnique({ where: { id: blogId } })
    if (existingblog) return existingblog;

}

async function getAll(offset: number, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;
    let allblogs = await blogs.findMany({
        skip: offset, take: 30,
        where: {
        },
    })

    return allblogs
}


export { create, update, remove, read, getAll }