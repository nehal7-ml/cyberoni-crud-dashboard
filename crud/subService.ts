import { PrismaClient, SubService } from "@prisma/client"
import { createImageDTO } from "./images";
import { connectOrCreateObject, createTagDTO } from "./tags";
export type createSubServiceDTO = {
    id?:string;
    title: string;
    pricingModel: string;
    discounts: string;
    serviceDeliverables: string;
    serviceUsageScore: number;
    description: string;
    department: string;
    estimated_hours_times_fifty_percent: number;
    estimated_hours_times_one_hundred_percent: number,
    overheadCost: number,
    complexity: number,
    skillLevel: string,
    image?: createImageDTO,
    tags?: createTagDTO[],
}

export async function create(newSubService: createSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {
    const subServices = prismaClient.subService;
    const newRecord = await subServices.create({
        data: {
            title: newSubService.title,
            complexity: newSubService.complexity,
            department: newSubService.department,
            description: newSubService.description,
            discounts: newSubService.discounts,
            estimated_hours_times_fifty_percent: newSubService.estimated_hours_times_fifty_percent,
            estimated_hours_times_one_hundred_percent: newSubService.estimated_hours_times_one_hundred_percent,
            overheadCost: newSubService.overheadCost,
            pricingModel: newSubService.pricingModel,
            serviceDeliverables: newSubService.serviceDeliverables,
            serviceUsageScore: newSubService.serviceUsageScore,
            skillLevel: newSubService.skillLevel,
            image: { create: newSubService.image },
            tags: { create: newSubService.tags },
            service: { connect: { id: serviceId } }
        }
    })

    return newRecord;

}

export async function update(subServiceID: string, subService: createSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {

    const subServices = prismaClient.subService;
    const newRecord = await subServices.update({
        where: { id: subServiceID },
        data: {
            title: subService.title,
            complexity: subService.complexity,
            department: subService.department,
            description: subService.description,
            discounts: subService.discounts,
            estimated_hours_times_fifty_percent: subService.estimated_hours_times_fifty_percent,
            estimated_hours_times_one_hundred_percent: subService.estimated_hours_times_one_hundred_percent,
            overheadCost: subService.overheadCost,
            pricingModel: subService.pricingModel,
            serviceDeliverables: subService.serviceDeliverables,
            serviceUsageScore: subService.serviceUsageScore,
            skillLevel: subService.skillLevel,
            image: { update: subService.image },
            tags: { connectOrCreate: connectOrCreateObject(subService.tags || []) },
            service: { connect: { id: serviceId } }
        }
    })

    return newRecord;
}


