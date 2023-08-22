import { Blog, PrismaClient, User } from "@prisma/client";


export type createBlogDTO = {
    title: string;
    subTitle: string;
    description: string;
    featured: boolean;
    date: Date;
    content: string;
    template: string;
    author: {id:string}
}

export type displayBlogDTO = Blog

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

async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const blogs = prismaClient.blog;

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allBlogs = await blogs.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
        where: {
        },
        include: {
            // reviews: true,
     
        }
    })

    const totalCount = await blogs.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records:allBlogs, currentPage: page, totalPages, pageSize }

}



export { create, update, remove, read, getAll }