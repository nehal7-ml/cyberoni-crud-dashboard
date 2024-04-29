import "server-only";
import { Product, PrismaClient, Supplier, ProductStatus } from "@prisma/client";
import { connectOrCreateObject as connectTag } from "./tags";
import {
  CreateCategory,
  CreateProductDTO,
  CreateSupplierDTO,
  CreateTagDTO,
} from "./DTOs";
import { connectOrCreateObject as connectImage } from "./images";
import { CreateImageDTO } from "./DTOs";
import { HttpError } from "@/lib/utils";

async function create(product: CreateProductDTO, prismaClient: PrismaClient) {
  const products = prismaClient.product;
  let createdproduct = await products.create({
    data: {
      ...product,
      category: product.category
        ? {
            connect: {
              id: product.category.id,
            },
          }
        : undefined,
      tags: { connectOrCreate: connectTag(product.tags, []).connectOrCreate },
      images: await connectImage(product.images, []),
      suppliers: {
        create: [...(product.suppliers as CreateSupplierDTO[])],
      },
    },
  });
  return createdproduct;
}

async function update(
  productId: string,
  product: CreateProductDTO,
  prismaClient: PrismaClient,
) {
  const products = prismaClient.product;
  const oldProduct = await products.findUnique({
    where: { id: productId },
    include: { images: true, tags: true },
  });
  if (!oldProduct) throw HttpError(404, "Product not found");

  const suplierUpdate = {
    create: [],
    update: [],
  } as {
    create: Array<any>;
    update: Array<{
      where: { id: string };
      data: Supplier;
    }>;
  };

  for (const supplier of product.suppliers!) {
    if ((supplier as Supplier).id) {
      suplierUpdate.update.push({
        where: { id: (supplier as Supplier).id as string },
        data: supplier as Supplier,
      });
    } else {
      suplierUpdate.create.push(supplier);
    }
  }
  let createdproduct = await products.update({
    where: { id: productId },
    data: {
      ...product,
      category: product.category
        ? {
            connect: { id: product.category.id },
          }
        : undefined,
      tags: connectTag(product.tags, oldProduct?.tags),
      images: await connectImage(product.images, oldProduct!.images),
      suppliers: suplierUpdate,
    },
  });
  return createdproduct;
}
async function remove(productId: string, prismaClient: PrismaClient) {
  const products = prismaClient.product;
  const existingproduct = await products.findUnique({
    where: { id: productId },
  });
  if (existingproduct) {
    await products.delete({ where: { id: productId } });
  }
}
async function read(productId: string, prismaClient: PrismaClient) {
  const products = prismaClient.product;
  const existingproduct = await products.findUnique({
    where: { id: productId },
    include: {
      reviews: true,
      images: true,
      tags: true,
      suppliers: true,
    },
  });
  if (existingproduct) return existingproduct;
}

async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
  options?: {
    order: "asc" | "desc";
    orderby: "updatedAt" | "title";
  },
) {
  const products = prismaClient.product;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let allProducts = await products.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {},
    include: {
      // reviews: true,
      category: {
        include: {
          parent: true,
        },
      },
    },
    orderBy: options?.orderby
      ? {
          [options.orderby]: options.order,
        }
      : {
          updatedAt: "desc",
        },
  });

  const totalCount = await products.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allProducts, currentPage: page, totalPages, pageSize };
}

export { create, update, remove, read, getAll };
