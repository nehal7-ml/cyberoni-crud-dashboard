import { Product, PrismaClient, Supplier, ProductStatus } from "@prisma/client";
import { connectOrCreateObject as connectTag, CreateTagDTO } from "./tags";
import { connectOrCreateObject as connectImage, CreateImageDTO } from "./images";
import { CreateSupplierDTO } from "./supplier";

export type CreateProductDTO = {
    sku: string;
    name: string;
    status: ProductStatus;
    ratings?: number | null;
    inventory: number;
    productBreakdown?: string | null;
    shippingReturnPolicy: string;
    description: string;
    price: number;
    profitMargin: number;
    displayPrice: number;
    category: string;
    subcategory?: string;
    tags: CreateTagDTO[];
    images: CreateImageDTO[];
    suppliers?: CreateSupplierDTO[] | Supplier[];
    amazonProductId?: string;
    cjDropShippingId?: string;
}


export type displayProductDTO = {
    id: string;
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
    amazonProductId?: string;
    cjDropShippingId?: string;
}
async function create(product: CreateProductDTO, prismaClient: PrismaClient) {
    const products = prismaClient.product;
    let createdproduct = await products.create({
        data: {
            ...product,
            tags: { connectOrCreate: connectTag(product.tags) },
            images: connectImage(product.images),
            suppliers: {
                create: [
                    ...product.suppliers as CreateSupplierDTO[]

                ]
            }
        }
    });
    return createdproduct
}

async function update(productId: string, product: CreateProductDTO, prismaClient: PrismaClient) {
    const products = prismaClient.product;
    const suplierUpdate = {
        create: [],
        update: []
    } as {
        create: Array<any>, update: Array<{
            where: { id: string },
            data: Supplier

        }>
    }

    for (const supplier of product.suppliers!) {
        if ((supplier as Supplier).id) {
            suplierUpdate.update.push({
                where: { id: (supplier as Supplier).id as string },
                data: supplier as Supplier

            })
        } else {
            suplierUpdate.create.push(supplier)
        }

    }
    let createdproduct = await products.update({
        where: { id: productId },
        data: {
            ...product,
            tags: { connectOrCreate: connectTag(product.tags) },
            images:  connectImage(product.images),
            suppliers: suplierUpdate
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

async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const products = prismaClient.product;

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allProducts = await products.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
        where: {
        },
        include: {
            // reviews: true,

        }
    })

    const totalCount = await products.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records: allProducts, currentPage: page, totalPages, pageSize }

}

export { create, update, remove, read, getAll }