"use server";

import {  getAllBlogs } from "@/crud/blog";
import { getAll as getAllServices } from "@/crud/service";
import { IndexingRequest, requestIndexing } from "@/lib/googleIndexing";
import { prisma } from "@/lib/prisma";
import { getBaseUrl, seoUrl } from "@/lib/utils";
import { User } from "next-auth";
export async function indexEverything(user: User) {
  const blogs = await getAllBlogs(0, 10, user);
  const services = await getAllServices(0, 10,user);

  let urls: IndexingRequest[] = blogs.records
    .map(
      (blog, index) =>
        ({
          url: `${getBaseUrl()}/blogs/post/${seoUrl(blog.title, blog.id)}`,
          type: "URL_UPDATED",
        }) as IndexingRequest,
    )
    .concat(
      services.records.map((service, index) => ({
        url: `${getBaseUrl()}/services/${seoUrl(service.title, service.id)}`,
        type: "URL_UPDATED",
      })),
    );

  // console.log(urls);

  if (process.env.NODE_ENV !== "production") {
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 4000);
    });
    return true;
  }

  const res = await requestIndexing(urls.slice(0, 199));

  return res;
}
