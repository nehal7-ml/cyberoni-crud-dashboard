import 'server-only';
import { PrismaClient, Prisma, FAQ } from "@prisma/client";
import { create as createTag, connectOrCreateObject as connectTags } from "./tags";
import { create as createImage, connectOrCreateObject as connectImage, createObject } from "./images";
import { CreateImageDTO } from "./DTOs";
import { create as createSubService, update as updateSubService } from "./subService";
import { prisma } from "@/prisma/prismaClient";
import { uploadFile } from "@/lib/cloudinary";
import { CreateServiceDTO } from "./DTOs";


async function create(service: CreateServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    let image = await createObject(service.image)
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

    if (service.SubServices && service.SubServices?.length > 0) {

        for (const subService of service.SubServices) {
            const newSubService = await createSubService(subService, createdservice.id, prismaClient);

        }

    }

    if (service.ServiceDescription && service.ServiceDescription?.length > 0) {
        for (let description of service.ServiceDescription) {
            await prisma.serviceDescription.create(
                {
                    data: {
                        ...description,
                        image: description.image.id ? { connect: { id: description.image.id } } : { create: description.image },
                        service: { connect: { id: createdservice.id } }
                    },

                }

            )

        }
    }

    return createdservice

}

async function update(serviceId: string, service: CreateServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    let image = await createObject(service.image)

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
                image: image ? {
                    upsert: {
                        where: {
                            id: image.id
                        },
                        update: image,
                        create: image
                    }
                } : {},
                tags: { connectOrCreate: connectTags(service.tags || []) },


            },
            include: {
                SubServices: true,
                image: true,
                tags: true,
                ServiceDescription: true,
            }
        });
    if (service.SubServices && service.SubServices?.length > 0) {

        for (const subService of service.SubServices) {
            if (subService.id) {
                const newSubService = await updateSubService(subService.id, subService, updatedService.id, prismaClient);
            }
            else {
                const newSubService = await createSubService(subService, updatedService.id, prismaClient);
            }
        }

    }



    if (service.ServiceDescription && service.ServiceDescription?.length > 0) {
        for (let description of service.ServiceDescription) {

            if (description.id) {


            } else {
                await prisma.serviceDescription.create(
                    {
                        data: {
                            ...description,
                            image: { connect: { id: description.image.id } },
                            service: { connect: { id: updatedService.id } }
                        }
                    }

                )

            }



        }
    }


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

export { create, update, remove, read, getAll }