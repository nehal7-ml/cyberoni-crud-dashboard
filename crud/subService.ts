import { PrismaClient, SubService } from "@prisma/client"
import { connectOrCreateObject } from "./tags";
import { createObject } from "./images";
import { CreateSubServiceDTO } from "./DTOs";
export async function create(newSubService: CreateSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {
    const subServices = prismaClient.subService;
    let image = await createObject(newSubService.image)

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
            image: { create: image },
            tags: { connectOrCreate: connectOrCreateObject(newSubService.tags || []) },
            service: { connect: { id: serviceId } }
        }
    })



    return newRecord;

}

export async function update(subServiceID: string, subService: CreateSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {

    const subServices = prismaClient.subService;
    let image = await createObject(subService.image)

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
            image: { update: image },
            tags: { connectOrCreate: connectOrCreateObject(subService.tags || []) },
            service: { connect: { id: serviceId } }
        }
    })

    return newRecord;
}


