import { Service, PrismaClient, Prisma, Image, Tag, SubService, ServiceDescription, FAQ } from "@prisma/client";
import { CreateTagDTO, create as createTag, connectOrCreateObject as connectTags, TagSchema } from "./tags";
import { CreateImageDTO, create as createImage, connectOrCreateObject as connectImage, ImageSchema } from "./images";
import { CreateSubServiceDTO, SubserviceSchema, create as createSubService, update as updateSubService } from "./subService";
import { prisma } from "@/prisma/prismaClient";


export type CreateServiceDTO = {
    title: string;
    previewContent: string;
    featured: boolean;
    ServiceDescription: CreateServiceDescription[];
    hourlyRate: number;
    valueBrought: string[];
    skillsUsed: string[];
    htmlEmbed?: string;
    image?: CreateImageDTO;
    SubServices?: CreateSubServiceDTO[];
    tags?: CreateTagDTO[];
    faqs?: CreateFaqDTO[]
}

export type CreateServiceDescription = {
    id?: string;
    title: string;
    content: string;
    imageOnLeft: boolean;
    image: CreateImageDTO

}
export type CreateFaqDTO = {
    question: string;
    answer: string;
}

export type DisplayServiceDTO = Service & {
    image?: Image,
    tags?: Tag[],
    SubServices?: SubService[],
    ServiceDescription?: (ServiceDescription & { image: Image })[]

}

export const ServiceSchema = {
    "type": "object",
    "properties": {
        "title": { "type": "string" },
        "previewContent": { "type": "string" },
        "ServiceDescription": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/CreateServiceDescription"
            }
        },
        "hourlyRate": { "type": "number" },
        "valueBrought": {
            "type": "array",
            "items": { "type": "string" }
        },
        "skillsUsed": {
            "type": "array",
            "items": { "type": "string" }
        },
        "htmlEmbed": { "type": ["string"] },
        "image": { "$ref": "#/definitions/CreateImageDTO" },
        "SubServices": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateSubServiceDTO" }
        },
        "tags": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateTagDTO" }
        },
        "faqs": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateFaqDTO" }
        }
    },
    "required": ["title", "previewContent", "ServiceDescription", "hourlyRate", "valueBrought", "skillsUsed"],
    "definitions": {
        "CreateServiceDescription": {
            "type": "object",
            "properties": {
                "id": { "type": ["string"] },
                "title": { "type": "string" },
                "content": { "type": "string" },
                "imageOnLeft": { "type": "boolean" },
                "image": { "$ref": "#/definitions/CreateImageDTO" }
            },
            "required": ["title", "content", "imageOnLeft", "image"],
            "definitions": {
                "CreateImageDTO": {
                    // Include the JSON schema for CreateImageDTO here
                }
            }
        }
        ,
        "CreateImageDTO": ImageSchema,
        "CreateTagDTO": TagSchema,
        "CreateSubServiceDTO": SubserviceSchema,
        "CreateFaqDTO": {
            "type": "object",
            "properties": {
                "question": { "type": "string" },
                "answer": { "type": "string" }
            },
            "required": ["question", "answer"]
        }

    }
}

async function create(service: CreateServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;

    let createdservice = await services.create({
        data: {
            title: service.title,
            featured: service.featured,
            previewContent: service.previewContent,
            hourlyRate: service.hourlyRate,
            valueBrought: service.valueBrought,
            skillsUsed: service.skillsUsed,
            htmlEmbed: service.htmlEmbed,
            image: service.image ? (service.image.id ? { connect: { id: service.image.id } } : { create: service.image }) : {},
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
                image: service.image ? { update: service.image } : {},
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

export { create, update, remove, read, getAll }