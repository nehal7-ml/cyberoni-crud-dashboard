import { PrismaClient, SoftwareProduct } from "@prisma/client";
import { CreateImageDTO, CreateSoftwareProductDTO } from "./DTOs";
import { connectOrCreateObject as connectTags } from "./tags";
import { connectOrCreateObject as connectImages } from "./images";
import { HttpError } from "@/lib/utils";
import {
  createSubscriptionProduct,
  updateSubscriptionProduct,
} from "@/lib/stripe";
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

  let id = undefined;
  let pricingIds = [] as string[];
  if (product.pricing === "Subscription") {
    const subscription = await createSubscriptionProduct({
      name: product.title,
      pricingPlans: product.subscriptionModel.map((model) => ({
        nickname: model.name,
        amount: model.price * 100,
        currency: "usd",
        interval: model.type === "MONTHLY" ? "month" : "year",
      })),
    });

    id = subscription.product.id;
    pricingIds = subscription.pricingPlans.map((plan) => plan.id);
  }
  let createdProduct = await prismaClient.softwareProduct.create({
    data: {
      id: id,
      title,
      subTitle,
      description,
      pricing,
      link,
      githubLink,
      status,
      internal: false,
      blog: product.blog ? { connect: { id: product.blog.id } } : undefined,
      images: await connectImages(product.images, []),
      tags: {
        connectOrCreate: connectTags(product.tags || [], []).connectOrCreate,
      },
      subscriptionModel:
        product.pricing === "Subscription" && product.subscriptionModel
          ? {
            create: product.subscriptionModel.map((model, index) => ({
              id: pricingIds[index],
              name: model.name,
              price: model.price,
              features: model.features,
              status: "ACTIVE",
              type: model.type,
              credits: model.credits,
              profit: model.profit,
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
  prisma: PrismaClient,
): Promise<SoftwareProduct> {
  const oldProduct = await prisma.softwareProduct.findUnique({
    where: { id: productId },
    include: {
      tags: true,
      images: true,
      category: true,
      subscriptionModel: true,
    },
  });
  if (!oldProduct) throw HttpError(404, "Product not found");

  if (productData.pricing !== oldProduct.pricing)
    throw HttpError(
      400,
      "Pricing cannot be updated, Create a new Product instead",
    );

  if (productData.pricing === "Subscription") {
    const product = await updateSubscriptionSoftwareProduct(
      productData,
      oldProduct as unknown as CreateSoftwareProductDTO,
      prisma,
    );

    return product;
  } else {
    const updatedProduct = await prisma.softwareProduct.update({
      where: { id: oldProduct.id },
      data: {
        title: productData.title,
        subTitle: productData.subTitle,
        description: productData.description,
        githubLink: productData.githubLink,
        link: productData.link,
        status: productData.status,
        internal: false,
        blog: productData.blog
          ? { connect: { id: productData.blog.id } }
          : undefined,
        images: await connectImages(productData.images, oldProduct.images),
        category: productData.category
          ? {
            connect: {
              id: productData.category.id,
            },
          }
          : undefined,

        tags: connectTags(productData.tags, oldProduct!.tags),
        subscriptionModel: undefined,
      },
    });
    return updatedProduct;
  }
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

async function updateSubscriptionSoftwareProduct(
  productData: CreateSoftwareProductDTO,
  oldProduct: CreateSoftwareProductDTO,
  prisma: PrismaClient,
) {
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

  let createIds = [],
    updateIds = [],
    disconnectIds = [];
  const createModels = productData.subscriptionModel
    ? productData.subscriptionModel.filter((model) => !model.id)
    : [];

  const updateModels = productData.subscriptionModel
    ? productData.subscriptionModel.filter((model) => model.id)
    : [];

    const disconnectModels = oldProduct.subscriptionModel && productData.subscriptionModel
    ? oldProduct.subscriptionModel.filter(
        (model) =>
          !productData.subscriptionModel?.find(
            (newModel) => newModel.id === model.id
          )
      )
    : [];
  const {
    product,
    pricingPlans,
    pricesToCreate,
    pricesToUpdate,
    pricesToDisconnect,
  } = await updateSubscriptionProduct({
    id: oldProduct.id!,
    description: productData.description,
    name: productData.title,
    pricingPlans: productData.subscriptionModel!.map((model) => ({
      nickname: model.name,
      amount: model.price * 100,
      currency: "usd",
      interval: "month",
    })),
  });

  const updatedProduct = await prisma.softwareProduct.update({
    where: { id: oldProduct.id },
    data: {
      title,
      subTitle,
      description,
      pricing,
      link,
      githubLink,
      status,
      internal: false,
      subscriptionModel:
        productData.pricing === "Subscription" && productData.subscriptionModel
          ? {
            create: createModels.map((model, index) => ({
              id: pricesToCreate[index],
              name: model.name,
              price: model.price,
              type: model.type,
              features: model.features,
              status: "ACTIVE",
              credits: model.credits,
              profit: model.profit,
            })),
            update: updateModels.map((model) => ({
              where: { id: model.id! },
              data: {
                name: model.name,
                price: model.price,
                type: model.type,
                features: model.features,
                status: "ACTIVE",
                credits: model.credits,
                profit: model.profit,
              },
            })),

            delete: disconnectModels.map((model) => ({ id: model.id! })),
          }
          : undefined,
      blog: productData.blog
        ? { connect: { id: productData.blog.id } }
        : { disconnect: true },
      images: await connectImages(
        productData.images,
        oldProduct!.images as CreateImageDTO[],
      ),
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
export { create, read, update, remove, getAll };
