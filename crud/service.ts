import 'server-only';
import { PrismaClient, Prisma, FAQ } from "@prisma/client";
import { create as createTag, connectOrCreateObject as connectTags } from "./tags";
import { create as createImage, connectOrCreateObject as connectImage, createObject as createImageObject } from "./images";
import { CreateImageDTO, CreateServiceDescription, CreateSubServiceDTO } from "./DTOs";
import { create as createSubService, createSubservicesObject, update as updateSubService, updateSubServiceObject } from "./subService";
import { prisma } from "@/prisma/prismaClient";
import { uploadFile } from "@/lib/cloudinary";
import { CreateServiceDTO } from "./DTOs";


async function create(service: CreateServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    let image = await createImageObject(service.image)
    let createdservice = await services.create({
        data: {
            title: service.title,
            featured: service.featured,
            previewContent: service.previewContent,
            hourlyRate: service.hourlyRate,
            valueBrought: service.valueBrought,
            skillsUsed: service.skillsUsed,
            htmlEmbed: service.htmlEmbed,
            image: image ? { create: image } : {},
            tags: { connectOrCreate: connectTags(service.tags || []) },
            faqs: {
                create: service.faqs ? service.faqs : []
            },
            SubServices: {
                create: await createSubservicesObject(service.SubServices as CreateSubServiceDTO[])
            },
            ServiceDescription: {
                create: await createServiceDescriptionObject(service.ServiceDescription as CreateServiceDescription[])
            }
        },
        include: {
            SubServices: true,
            image: true,
            tags: true,
            ServiceDescription: {
                include: {
                    image: true
                }
            },
        }
    });

    return createdservice

}

async function update(serviceId: string, service: CreateServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    let image = await createImageObject(service.image)

    // let currentService = await services.findUnique({ where: { id: serviceId } })
    let updatedService = await services.update(
        {
            where: { id: serviceId },
            data: {
                title: service.title,
                featured: service.featured,
                previewContent: service.previewContent,
                hourlyRate: service.hourlyRate,
                valueBrought: service.valueBrought,
                skillsUsed: service.skillsUsed,
                htmlEmbed: service.htmlEmbed,
                image: image && image.id ? {
                    update: {
                        where: {
                            id: image.id
                        },
                        data: image,
                    }
                } : image && image?.id == null ? { create: image } : {},
                tags: { connectOrCreate: connectTags(service.tags || []) },
                SubServices: await updateSubServiceObject(service.SubServices as CreateSubServiceDTO[]),
                ServiceDescription: await updateServiceDescriptionObject(service.ServiceDescription)


            },
            include: {
                SubServices: true,
                image: true,
                tags: true,
                ServiceDescription: true,
            }
        });



    return updatedService


}
async function remove(serviceId: string, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    const existingservice = await services.findUnique({ where: { id: serviceId } })
    if (existingservice) {
        await services.delete({ where: { id: serviceId }, include: { SubServices: true, ServiceDescription: true, image: true } })
    }
}
async function read(serviceId: string, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    const existingservice = await services.findUnique({
        where: { id: serviceId },
        include: {
            SubServices: true,
            ServiceDescription: {
                include: {
                    image: true
                }
            },
            image: true,
            tags: true,
        }
    })
    if (existingservice) return existingservice;

}

async function getServicesByName(serviceName: string, prismaClient: PrismaClient) {

}

async function getServicesByTag(tag: string, prismaClient: PrismaClient) {

}

async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const services = prismaClient.service;

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50 && pageSize !== 0) throw new Error('page size must be 10, 30 or 50')

    let allServices = await services.findMany({
        skip: page === 0 ? 0 : (page - 1) * pageSize, take: page === 0 ? 9999 : pageSize,
        where: {
        },
        include: {
            // reviews: true,

        }
    })

    const totalCount = await services.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records: allServices, currentPage: page, totalPages, pageSize }

}


export async function getFeatured(prisma: PrismaClient) {
    const services = prisma.service;
    const records = await services.findMany({ where: { featured: true }, take: 5, orderBy: { hourlyRate: 'desc' } })
    return records

}


async function createServiceDescriptionObject(descriptions: CreateServiceDescription[]) {

    let create = [];

    for (const description of descriptions) {
        const subImage = await createImageObject(description.image)
        create.push({
            ...description,
            image: subImage ? { create: subImage } : {},
        })
    }


    return create

}


async function updateServiceDescriptionObject(descriptions: CreateServiceDescription[]) {

    let createOrUpdate: {
        create: any[],
        update: any[]
    } = {
        create: [],
        update: [],

    };

    for (const description of descriptions) {
        const image = await createImageObject(description.image)

        if (description.id) {
            createOrUpdate.update.push({


                where: {
                    id: description.id
                },
                data: {
                    ...description,
                    image: image && image.id ? {
                        update: {
                            where: {
                                id: image.id
                            },
                            data: image,
                        }
                    } : image && image?.id == null ? { create: image } : {},
                }

            })

        } else {
            createOrUpdate.create.push({
                ...description,
                image: image ? { create: image } : {},


            })
        }

    }


    return createOrUpdate

}
export { create, update, remove, read, getAll }