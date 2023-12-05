import { PricingModel, PrismaClient, SubService } from "@prisma/client"
import { CreateImageDTO, ImageSchema } from "./images";
import { connectOrCreateObject, CreateTagDTO, TagSchema } from "./tags";
export type CreateSubServiceDTO = {
    id?: string;
    title: string;
    pricingModel: PricingModel;
    discounts: Discount[];
    serviceDeliverables: string[];
    serviceUsageScore: number;
    description: string;
    department: string;
    estimated_hours_times_fifty_percent: number;
    estimated_hours_times_one_hundred_percent: number,
    overheadCost: number,
    complexity: number,
    skillLevel: string,
    image?: CreateImageDTO,
    tags?: CreateTagDTO[],
}

export type Discount = {
    name: string;
    value: string;
}


export const SubserviceSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
        "title": { "type": "string" },
        "pricingModel": { enum: [PricingModel.DEFAULT, PricingModel.AGGRESSIVE] },
        "discounts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": { "type": "string" },
                    "value": { "type": "string" }
                },
                "required": ["name", "value"]
            }
        },
        "serviceDeliverables": {
            "type": "array",
            "items": { "type": "string" }
        },
        "serviceUsageScore": { "type": "number" },
        "description": { "type": "string" },
        "department": { "type": "string" },
        "estimated_hours_times_fifty_percent": { "type": "number" },
        "estimated_hours_times_one_hundred_percent": { "type": "number" },
        "overheadCost": { "type": "number" },
        "complexity": { "type": "number" },
        "skillLevel": { "type": "string" },
        "image": { "$ref": "#/definitions/CreateImageDTO" },
        "tags": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateTagDTO" }
        }
    },
    "required": ["title", "pricingModel", "discounts", "serviceDeliverables", "serviceUsageScore", "description", "department", "estimated_hours_times_fifty_percent", "estimated_hours_times_one_hundred_percent", "overheadCost", "complexity", "skillLevel"],
    "definitions": {
        "CreateImageDTO": ImageSchema,
        "CreateTagDTO": TagSchema
    }
}


export async function create(newSubService: CreateSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {
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
            tags: { connectOrCreate: connectOrCreateObject(newSubService.tags || []) },
            service: { connect: { id: serviceId } }
        }
    })



    return newRecord;

}

export async function update(subServiceID: string, subService: CreateSubServiceDTO, serviceId: string, prismaClient: PrismaClient) {

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


