import "server-only";
import { PrismaClient } from "@prisma/client";
import { connectOrCreateObject as connectTags } from "./tags";
import { connectOrCreateObject as connectImages } from "./images";
import { CreateBlogDTO } from "./DTOs";
import { HttpError, seoUrl } from "@/lib/utils";
import { indexPage } from "@/lib/googleIndexing";

async function create(blog: CreateBlogDTO, prismaClient: PrismaClient) {
  const blogs = prismaClient.blog;
  let createdBlog = await blogs.create({
    data: {
      ...blog,
      images: await connectImages(blog.images, []),
      tags: { connectOrCreate: connectTags(blog.tags, []).connectOrCreate },
      author: { connect: { email: blog.author.email } },
    },
    include: {
      images: true, tags: true,
      author: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        }
      }
    }
  });
  await updateIndex(createdBlog.id, createdBlog.title, "URL_UPDATED")

  return createdBlog;
}

async function update(
  blogId: string,
  blog: CreateBlogDTO,
  prismaClient: PrismaClient,
) {
  const blogs = prismaClient.blog;
  const oldBlog = await blogs.findUnique({
    where: { id: blogId },
    include: { images: true, tags: true },
  });

  if (!oldBlog) throw HttpError(404, 'blog not found');
  const updatedBlog = await blogs.update({
    where: { id: blogId },
    data: {
      ...blog,
      images: await connectImages(blog.images, oldBlog!.images),
      tags: connectTags(blog.tags, oldBlog?.tags),
      author: { connect: { email: blog.author.email } },
    }, include: {
      images: true, tags: true,
      author: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        }
      }
    }
  });
  await updateIndex(updatedBlog.id, updatedBlog.title, "URL_UPDATED")
  return updatedBlog;
}

async function remove(blogId: string, prismaClient: PrismaClient) {
  const blogs = prismaClient.blog;
  const existingBlog = await blogs.findUnique({ where: { id: blogId } });
  if (existingBlog) {
    await blogs.delete({ where: { id: blogId } });
    await updateIndex(existingBlog.id, existingBlog.title, "URL_DELETED")
  }
}
async function read(blogId: string, prismaClient: PrismaClient) {
  const blogs = prismaClient.blog;
  const existingBlog = await blogs.findUnique({
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
      publishDate: true,
      author: {
        select: {
          id: true,
          email: true,
        },
      },
      tags: true,
      images: true,
    },
  });
  if (existingBlog) return existingBlog;
}

async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
) {
  const blogs = prismaClient.blog;
  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let allBlogs = await blogs.findMany({
    skip: page === 0 ? 0 : (page - 1) * pageSize,
    take: page === 0 ? 9999 : pageSize,
    where: {},
    select: {
      userId: false,
      content: true,
      date: true,
      description: true,
      featured: true,
      id: true,
      title: true,
      subTitle: true,
      publishDate: true,
      author: {
        select: {
          id: true,
          email: true,
        },
      },
      tags: true,
      images: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalCount = await blogs.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allBlogs, currentPage: page, totalPages, pageSize };
}


export async function updateIndex(blogId: string, BlogTitle: string, type: "URL_UPDATED" | "URL_DELETED") {
  if (process.env.NODE_ENV !== 'production') return;
  try {
    const baseUrl = process.env.HOST
    const req = await indexPage({
      url: `${baseUrl}/blogs/post/${seoUrl(BlogTitle, blogId)}`,
      type: type
    })

  } catch (error) {
    console.log(error);
  }
}

export { create, update, remove, read, getAll };
