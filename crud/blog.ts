import 'server-only';
import { PrismaClient } from "@prisma/client";
import { connectOrCreateObject as connectTags, } from "./tags";
import { connectOrCreateObject as connectImages, } from "./images";
import { CreateBlogDTO } from "./DTOs";



async function create(blog: CreateBlogDTO, prismaClient: PrismaClient) {
  const blogs = prismaClient.blog;
  let createdblog = await blogs.create({
    data: {
      ...blog,
      images: await connectImages(blog.images, []),
      tags: { connectOrCreate: connectTags(blog.tags) },
      author: { connect: { email: blog.author.email } }
    }
  });
  return createdblog


}


async function update(blogId: string, blog: CreateBlogDTO, prismaClient: PrismaClient) {
  const blogs = prismaClient.blog;
  const oldBlog = await blogs.findUnique({ where: { id: blogId }, include: { images: true, tags: true } })
  const updatedBlog = await blogs.update({
    where: { id: blogId },
    data: {
      ...blog,
      images: await connectImages(blog.images, oldBlog!.images),
      tags: { connectOrCreate: connectTags(blog.tags) },
      author: { connect: { email: blog.author.email } }
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
      publishDate:true,
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
      tags: true,
      author: true

    }
  })

  const totalCount = await blogs.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allBlogs, currentPage: page, totalPages, pageSize }

}



export { create, update, remove, read, getAll }