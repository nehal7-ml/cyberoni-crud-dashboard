import "server-only";
import { Role } from "@prisma/client";
import { connectOrCreateObject as connectTags } from "./tags";
import { connectOrCreateObject as connectImages } from "./images";
import { CreateBlogDTO, CreateCategory } from "./DTOs";
import { HttpError, seoUrl } from "@/lib/utils";
import { indexPage } from "@/lib/googleIndexing";
import { userQuery } from "./permissions";
import { prisma } from "@/lib/prisma"
import { User } from "next-auth";

async function create(blog: CreateBlogDTO, user: User) {
  const blogs = prisma.blog;
  let createdBlog = await blogs.create({
    data: {
      ...blog,
      ctaProps: blog.ctaProps? blog.ctaProps  : undefined,
      date: new Date(),
      category: blog.category ? {
        connect: {
          id: blog.category.id,
        }
      } : undefined,
      images: await connectImages(blog.images, []),
      tags: { connectOrCreate: connectTags(blog.tags, []).connectOrCreate },
      author: { connect: { id: user.id } },
      Organization: {
        connect: { id: user.orgId },
      }
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
  user: User,
) {
  const blogs = prisma.blog;
  const oldBlog = await blogs.findUnique({
    where: { id: blogId, AND: userQuery(user), },
    include: { images: true, tags: true },
  });

  if (!oldBlog) throw HttpError(404, 'blog not found');
  const updatedBlog = await blogs.update({
    where: { id: blogId },
    data: {
      ...blog,
      ctaProps: blog.ctaProps? blog.ctaProps  : undefined,
      category: blog.category ? {
        connect: {
          id: blog.category.id,
        }
      } : undefined,
      Organization: { connect: { id: user.orgId } },
      images: await connectImages(blog.images, oldBlog!.images),
      tags: connectTags(blog.tags, oldBlog?.tags),
      author: { connect: { id: user.id } },
    }, include: {
      images: true, tags: true,
      Organization: true,
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

async function remove(blogId: string, user: User) {
  const blogs = prisma.blog;
  const existingBlog = await blogs.findUnique({ where: { id: blogId, AND: userQuery(user) } });
  if (existingBlog) {
    await blogs.delete({ where: { id: blogId } });
    await updateIndex(existingBlog.id, existingBlog.title, "URL_DELETED")
  }
}
async function read(blogId: string, user: User) {
  const blogs = prisma.blog;
  const existingBlog = await blogs.findUnique({
    where: { id: blogId, AND: userQuery(user) },
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
      ctaProps: true,
      category: {
        include: {
          parent: true,
        }
      },
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

async function getAllBlogs(
  page: number,
  pageSize: number,
  user: User,
  options?: {
    order: 'asc' | 'desc';
    orderby: 'createdAt' | 'updatedAt' | 'title';
    userId?: string;
  }
) {
  const blogs = prisma.blog;
  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let query = { AND: userQuery(user, ) }
  let allBlogs = await blogs.findMany({
    skip: page === 0 ? 0 : (page - 1) * pageSize,
    take: page === 0 ? 9999 : pageSize,
    where: query,
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
      ctaProps: true,
      author: {
        select: {
          id: true,
          email: true,
        },
      },
      tags: true,
      images: true,
    },
    orderBy: options?.orderby ? {
      [options.orderby]: options.order
    } : {
      date: "desc",
    },
  });

  const totalCount = await blogs.count({ where: query });
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

export { create, update, remove, read, getAllBlogs };
