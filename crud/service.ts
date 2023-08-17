import { Service, PrismaClient, Prisma } from "@prisma/client";
import { createTagDTO, create as createTag } from "./tags";
import { createImageDTO, create as createImage } from "./images";
import { createSubServiceDTO, create as createSubService } from "./subService";


export type createServiceDTO = {
    title: string;
    previewContent: string;
    description: string;
    hourlyRate: number;
    valueBrought: string;
    skillsUsed: string;
    htmlEmbed?: string;
    image: createImageDTO;
    subServices?: createSubServiceDTO[];
    tags?: createTagDTO[];
}



async function create(service: createServiceDTO, prismaClient: PrismaClient) {
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
            tags: { create: service.tags },

        }
    });
    if (service.subServices && service.subServices?.length > 0) {
        service.subServices.forEach(async subService => {
            const newSubService = await createSubService(subService, createdservice.id, prismaClient);
        });
    }
    return createdservice

}

async function update(serviceId: string, service: createServiceDTO, prismaClient: PrismaClient) {
    const services = prismaClient.service;

    let currentService = await services.findUnique({where: {id: serviceId}})
    let updatedService = await services.update(
        {
        where: {id: serviceId},
        data: {
            title: service.title,
            previewContent: service.previewContent,
            description: service.description,
            hourlyRate: service.hourlyRate,
            valueBrought: service.valueBrought,
            skillsUsed: service.skillsUsed,
            htmlEmbed: service.htmlEmbed,
            image: { create: service.image },
            tags: { create: service.tags },

        }
    });
    if (service.subServices && service.subServices?.length > 0) {


        service.subServices.forEach(async subService => {
            const newSubService = await createSubService(subService, updatedService.id, prismaClient);
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
    const existingservice = await services.findUnique({ where: { id: serviceId } })
    if (existingservice) return existingservice;

}

async function getServicesByName(serviceName: string, prismaClient: PrismaClient) {

}

async function getServicesByTag(tag: string, prismaClient: PrismaClient) {

}

async function getAll(offset: number, prismaClient: PrismaClient) {
    const services = prismaClient.service;
    let allservices = await services.findMany({
        skip: offset, take: 30,
        where: {
        },
    })

    return allservices
}


export { create, update, remove, read, getAll }