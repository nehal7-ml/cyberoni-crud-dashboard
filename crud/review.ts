import { Review, PrismaClient, ReviewType } from "@prisma/client";
import { CreateImageDTO } from "./DTOs";
import { connectOrCreateObject, CreateTagDTO } from "./tags";


export type createReviewDTO = {
    name: string;
    image: CreateImageDTO;
    title: string;
    content: string;
    link: string;
    rating: number;
    verifiedCustomer: boolean;
    reviewType: ReviewType;
    productId?: string;
    serviceId?: string;
    userId: string;
    tags?: CreateTagDTO[];
}

async function create(review: createReviewDTO, prismaClient: PrismaClient) {
    const reviews = prismaClient.review;
    const connect = review.productId ? { connect: { id: review.productId } } : review.serviceId ? { connect: { id: review.serviceId } } : {};
    let createdreview = await reviews.create({
        data: {
            name: review.name,
            image: { create: review.image },
            tags: { connectOrCreate: connectOrCreateObject(review.tags || []) },
            title: review.title,
            content: review.content,
            link: review.link,
            rating: review.rating,
            verifiedCustomer: review.verifiedCustomer,
            reviewType: review.reviewType,
            user: { connect: { id: review.userId } },
            product: connect,
            service: connect
        }
    });
    return createdreview
}

async function update(reviewId: string, review: createReviewDTO, prismaClient: PrismaClient) {

}
async function remove(reviewId: string, prismaClient: PrismaClient) {
    const reviews = prismaClient.review;
    const existingreview = await reviews.findUnique({ where: { id: reviewId } })
    if (existingreview) {
        await reviews.delete({ where: { id: reviewId } })
    }
}
async function read(reviewId: string, prismaClient: PrismaClient) {
    const reviews = prismaClient.review;
    const existingreview = await reviews.findUnique({ where: { id: reviewId } })
    if (existingreview) return existingreview;

}


async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const reviews = prismaClient.review;

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allProducts = await reviews.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
        where: {
        },
        include: {
            // reviews: true,

        }
    })

    const totalCount = await reviews.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records: allProducts, currentPage: page, totalPages, pageSize }

}

async function getByProductId(productId: string, page: number, pageSize: number, prismaClient: PrismaClient) {
    const reviews = prismaClient.review;
    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')
    const existingreview = await reviews.findMany({
        where: { productId: productId },
        skip: (page - 1) * pageSize,
        take: pageSize,
    })
    if (existingreview) return existingreview;
}

async function getByServiceId(serviceId: string, page: number, pageSize: number, prismaClient: PrismaClient) {
    const reviews = prismaClient.review;
    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')
    const existingreview = await reviews.findMany({
        where: { serviceId: serviceId },
        skip: (page - 1) * pageSize,
        take: pageSize,
    })
    if (existingreview) return existingreview;
}

export { create, update, remove, read, getByProductId, getByServiceId, getAll }