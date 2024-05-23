import { PrismaClient, SoftwareProduct } from "@prisma/client";
import { CreateSoftwareProductDTO } from "./DTOs";
import { connectOrCreateObject as connectTags } from "./tags";
import { connectOrCreateObject as connectImages } from "./images";
import { HttpError } from "@/lib/utils";
async function create(
  product: CreateSoftwareProductDTO,
  prismaClient: PrismaClient,
): Promise<SoftwareProduct> {
  const {
    title,
    subTitle,
    description,
    images,
    pricing,
    link,
    githubLink,
    status,
    category,
  } = product;

  let createdProduct = await prismaClient.softwareProduct.create({
    data: {
      title,
      subTitle,
      description,
      pricing,
      link,
      githubLink,
      status,
      blog: product.blog ? { connect: { id: product.blog.id } } : undefined,
      images: await connectImages(product.images, []),
      tags: {
        connectOrCreate: connectTags(product.tags || [], []).connectOrCreate,
      },
      subscriptionModel:
        product.pricing === "Subscription" && product.subscriptionModels
          ? {
            create: product.subscriptionModels.map((model) => ({
              name: model.name,
              price: model.price,
              features: model.features,
              status: model.status,
              type: model.type,
            })),
          }
          : undefined,
      category: category
        ? {
          connect: {
            id: category.id,
          },
        }
        : undefined,
    },
  });

  return createdProduct;
}

async function read(productId: string, prismaClient: PrismaClient) {
  const product = await prismaClient.softwareProduct.findUnique({
    where: { id: productId },
    include: {
      images: true,
      tags: true,
      category: true,
      blog: true,
      subscriptionModel: true,
    },
  });

  return product;
}

async function update(
  productId: string,
  productData: CreateSoftwareProductDTO,
  prismaClient: PrismaClient,
): Promise<SoftwareProduct> {
  const oldProduct = await prismaClient.softwareProduct.findUnique({
    where: { id: productId },
    include: {
      tags: true,
      images: true,
      category: true,
      subscriptionModel: true
    },
  });
  if (!oldProduct) throw HttpError(404, "Product not found");

  const {
    title,
    subTitle,
    description,
    images,
    pricing,
    link,
    githubLink,
    status,
    category,
  } = productData;

  const createModels =
    productData.pricing === "Subscription" && productData.subscriptionModels
      ? productData.subscriptionModels.filter((model) => !model.id)
      : [];
  const updateModels =
    productData.pricing === "Subscription" && productData.subscriptionModels
      ? productData.subscriptionModels.filter((model) => model.id)
      : [];

  const disconnectModels =
    productData.pricing === "Subscription" && productData.subscriptionModels
      ? productData.subscriptionModels.filter((model) => (!model.id && oldProduct.subscriptionModel?.find((oldModel) => oldModel.id === model.id)))
      : [];

  const updatedProduct = await prismaClient.softwareProduct.update({
    where: { id: productId },
    data: {
      title,
      subTitle,
      description,
      pricing,
      link,
      githubLink,
      status,
      subscriptionModel:
        productData.pricing === "Subscription" && productData.subscriptionModels
          ? {
            create: createModels.map((model) => ({
              name: model.name,
              price: model.price,
              type: model.type,
              features: model.features,
              status: model.status,
            })),
            update: updateModels.map((model) => ({
              where: { id: model.id! },
              data: {
                name: model.name,
                price: model.price,
                type: model.type,
                features: model.features,
                status: model.status,
              },
            })),

            disconnect: disconnectModels.map((model) => ({ id: model.id! })),
          }
          : undefined,
      blog: productData.blog
        ? { connect: { id: productData.blog.id } }
        : { disconnect: true },
      images: await connectImages(productData.images, oldProduct!.images),
      tags: connectTags(productData.tags, oldProduct!.tags),
      category: productData.category
        ? {
          connect: {
            id: productData.category.id,
          },
        }
        : undefined,
    },
  });

  return updatedProduct;
}

async function remove(
  productId: string,
  prismaClient: PrismaClient,
): Promise<void> {
  await prismaClient.softwareProduct.delete({
    where: { id: productId },
  });
}

async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
  options?: {
    order: "asc" | "desc";
    orderby: "updatedAt" | "pricing";
  },
): Promise<{
  records: SoftwareProduct[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
}> {
  let allProducts = await prismaClient.softwareProduct.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      category: true,
    },
    orderBy: options?.orderby
      ? {
        [options.orderby]: options.order,
      }
      : {
        createdAt: "desc",
      },
  });

  const totalCount = await prismaClient.softwareProduct.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allProducts, currentPage: page, totalPages, pageSize };
}

export { create, read, update, remove, getAll };
