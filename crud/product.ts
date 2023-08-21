import { Product, PrismaClient } from "@prisma/client";
import { connectOrCreateObject as connectTag, createTagDTO } from "./tags";
import { connectOrCreateObject as connectImage, createImageDTO } from "./images";
import { createSupplierDTO } from "./supplier";

export type createProductDTO = {
    sku: string;
    name: string;
    status: string;
    ratings: number | null;
    inventory: number;
    productBreakdown: string | null;
    shippingReturnPolicy: string;
    description: string;
    price: number;
    profitMargin: number;
    displayPrice: number;
    category: string;
    subcategory: string | null;
    tags: createTagDTO[];
    images: createImageDTO[];
    suppliers?: createSupplierDTO[];
}


export type displayProductDTO = {
    sku: string;
    name: string;
    status: string;
    ratings: number | null;
    inventory: number;
    productBreakdown: string | null;
    shippingReturnPolicy: string;
    description: string;
    price: number;
    profitMargin: number;
    displayPrice: number;
    category: string;
    subcategory: string | null;
}
async function create(product: createProductDTO, prismaClient: PrismaClient) {
    const products = prismaClient.product;
    let createdproduct = await products.create({
        data: {
            ...product,
            tags: { connectOrCreate: connectTag(product.tags) },
            images: { create: product.images },
            suppliers: { create: product.suppliers }
        }
    });
    return createdproduct
}

async function update(productId: string, product: createProductDTO, prismaClient: PrismaClient) {
    const products = prismaClient.product;
    let createdproduct = await products.update({
        where: { id: productId },
        data: {
            ...product,
            tags: { connectOrCreate: connectTag(product.tags) },
            images: { create: product.images },
            suppliers: { create: product.suppliers }
        }
    });
    return createdproduct
}
async function remove(productId: string, prismaClient: PrismaClient) {
    const products = prismaClient.product;
    const existingproduct = await products.findUnique({ where: { id: productId } })
    if (existingproduct) {
        await products.delete({ where: { id: productId } })
    }
}
async function read(productId: string, prismaClient: PrismaClient) {
    const products = prismaClient.product;
    const existingproduct = await products.findUnique({
        where: { id: productId }, include: {
            reviews: true,
            images: true,
            tags: true,
            suppliers: true
        }
    })
    if (existingproduct) return existingproduct;

}

async function getAll(offset: number, prismaClient: PrismaClient) {
    const products = prismaClient.product;
    let allProducts = await products.findMany({
        skip: offset, take: 30,
        where: {
        },
        include: {
            //reviews: true,
            //images: true,
            //tags: true,
            //suppliers: true
        }
    })

    return allProducts
}


export { create, update, remove, read, getAll }