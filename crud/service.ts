import { Service, PrismaClient, Prisma, Image, Tag, SubService } from "@prisma/client";
import { CreateTagDTO, create as createTag, connectOrCreateObject as connectTags } from "./tags";
import { CreateImageDTO, create as createImage, connectOrCreateObject } from "./images";
import { CreateSubServiceDTO, create as createSubService, update as updateSubService } from "./subService";


export type CreateServiceDTO = {
    title: string;
    previewContent: string;
    description: string;
    hourlyRate: number;
    valueBrought: string;
    skillsUsed: string;
    htmlEmbed?: string;
    image: CreateImageDTO;
    subServices?: CreateSubServiceDTO[];
    tags?: CreateTagDTO[];
}


export type DisplayServiceDTO = Service & {
    image?: Image,
    tags?: Tag[],
    subServices?: SubService[]
}


async function create(service: CreateServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;

    let createdservice = await services.create({
        data: {
            title: service.title,
            previewContent: service.previewContent,
            description: service.description,
            hourlyRate: service.hourlyRate,
            valueBrought: service.valueBrought,
            skillsUsed: service.skillsUsed,
            htmlEmbed: service.htmlEmbed,
            image: { create: service.image },
            tags: { connectOrCreate: connectTags(service.tags || []) },

        }
    });
    if (service.subServices && service.subServices?.length > 0) {
        service.subServices.forEach(async subService => {
            const newSubService = await createSubService(subService, createdservice.id, prismaClient);
        });
    }
    return createdservice

}

async function update(serviceId: string, service: CreateServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;

    let currentService = await services.findUnique({ where: { id: serviceId } })
    let updatedService = await services.update(
        {
            where: { id: serviceId },
            data: {
                title: service.title,
                previewContent: service.previewContent,
                description: service.description,
                hourlyRate: service.hourlyRate,
                valueBrought: service.valueBrought,
                skillsUsed: service.skillsUsed,
                htmlEmbed: service.htmlEmbed,
                image: { update: service.image },
                tags: { connectOrCreate: connectTags(service.tags || []) },

            }
        });


    if (service.subServices && service.subServices?.length > 0) {


        service.subServices.forEach(async subService => {
            if (subService.id) {
                const newSubService = await updateSubService(subService.id, subService, updatedService.id, prismaClient);
            }
            else {
                const newSubService = await createSubService(subService, updatedService.id, prismaClient);
            }
        });
    }
    return updatedService

}
async function remove(serviceId: string, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    const existingservice = await services.findUnique({ where: { id: serviceId } })
    if (existingservice) {
        await services.delete({ where: { id: serviceId } })
    }
}
async function read(serviceId: string, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    const existingservice = await services.findUnique({
        where: { id: serviceId },
        include: {
            subServices: true,
            image:true,
            tags:true,
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

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allServices = await services.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
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