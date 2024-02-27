import "server-only";
import { PrismaClient, SubService } from "@prisma/client";
import {
  createObject as createImageObject,
  create as createImage,
  connectOrCreateObject as connectImage,
} from "./images";
import {
  create as createTag,
  connectOrCreateObject as connectTags,
} from "./tags";
import { CreateSubServiceDTO } from "./DTOs";
export async function create(
  newSubService: CreateSubServiceDTO,
  serviceId: string,
  prismaClient: PrismaClient,
) {
  const subServices = prismaClient.subService;
  let image = await createImageObject(newSubService.image);

  const newRecord = await subServices.create({
    data: {
      title: newSubService.title,
      complexity: newSubService.complexity,
      department: newSubService.department,
      description: newSubService.description,
      estimated_hours_times_fifty_percent:
        newSubService.estimated_hours_times_fifty_percent,
      estimated_hours_times_one_hundred_percent:
        newSubService.estimated_hours_times_one_hundred_percent,
      overheadCost: newSubService.overheadCost,
      pricingModel: newSubService.pricingModel,
      serviceDeliverables: newSubService.serviceDeliverables,
      serviceUsageScore: newSubService.serviceUsageScore,
      skillLevel: newSubService.skillLevel,
      image: { create: image },
      tags: { connectOrCreate: connectTags(newSubService.tags || []) },
      service: { connect: { id: serviceId } },
    },
  });

  return newRecord;
}

export async function update(
  subServiceID: string,
  subService: CreateSubServiceDTO,
  serviceId: string,
  prismaClient: PrismaClient,
) {
  const subServices = prismaClient.subService;
  let image = await createImageObject(subService.image);

  const newRecord = await subServices.update({
    where: { id: subServiceID },
    data: {
      title: subService.title,
      complexity: subService.complexity,
      department: subService.department,
      description: subService.description,
      estimated_hours_times_fifty_percent:
        subService.estimated_hours_times_fifty_percent,
      estimated_hours_times_one_hundred_percent:
        subService.estimated_hours_times_one_hundred_percent,
      overheadCost: subService.overheadCost,
      pricingModel: subService.pricingModel,
      serviceDeliverables: subService.serviceDeliverables,
      serviceUsageScore: subService.serviceUsageScore,
      skillLevel: subService.skillLevel,
      image:
        image && image.id
          ? {
            update: {
              where: {
                id: image.id,
              },
              data: image,
            },
          }
          : image && image?.id == null
            ? { create: image }
            : {},
      tags: { connectOrCreate: connectTags(subService.tags || []) },
      service: { connect: { id: serviceId } },
    },
  });

  return newRecord;
}

export async function createSubservicesObject(
  subServices: CreateSubServiceDTO[],
) {
  const createObject = [];
  for (const subService of subServices) {
    const subImage = await createImageObject(subService.image);
    createObject.push({
      title: subService.title,
      complexity: subService.complexity,
      department: subService.department,
      description: subService.description,
      estimated_hours_times_fifty_percent:
        subService.estimated_hours_times_fifty_percent,
      estimated_hours_times_one_hundred_percent:
        subService.estimated_hours_times_one_hundred_percent,
      overheadCost: subService.overheadCost,
      pricingModel: subService.pricingModel,
      serviceDeliverables: subService.serviceDeliverables,
      serviceUsageScore: subService.serviceUsageScore,
      skillLevel: subService.skillLevel,
      image: subImage ? { create: subImage } : {},
      tags: { connectOrCreate: connectTags(subService.tags || []) },
    });
  }

  return createObject;
}

export async function updateSubServiceObject(  subServices: CreateSubServiceDTO[],) {
  let createOrUpdate: {
    create: any[];
    update: any[];
  } = {
    create: [],
    update: [],
  };



  for (const subService of subServices) {
    const image = await createImageObject(subService.image);

    if (subService.id) {
      createOrUpdate.update.push({
        where: {
          id: subService.id,
        },
        data: {
          title: subService.title,
          complexity: subService.complexity,
          department: subService.department,
          description: subService.description,
          estimated_hours_times_fifty_percent:
            subService.estimated_hours_times_fifty_percent,
          estimated_hours_times_one_hundred_percent:
            subService.estimated_hours_times_one_hundred_percent,
          overheadCost: subService.overheadCost,
          pricingModel: subService.pricingModel,
          serviceDeliverables: subService.serviceDeliverables,
          serviceUsageScore: subService.serviceUsageScore,
          skillLevel: subService.skillLevel,
          image:
            image && image.id
              ? {
                update: {
                  where: {
                    id: image.id,
                  },
                  data: image,
                },
              }
              : image && image?.id == null
                ? { create: image }
                : {},
        },
      });
    } else {
      createOrUpdate.create.push({
        title: subService.title,
        complexity: subService.complexity,
        department: subService.department,
        description: subService.description,
        estimated_hours_times_fifty_percent:
          subService.estimated_hours_times_fifty_percent,
        estimated_hours_times_one_hundred_percent:
          subService.estimated_hours_times_one_hundred_percent,
        overheadCost: subService.overheadCost,
        pricingModel: subService.pricingModel,
        serviceDeliverables: subService.serviceDeliverables,
        serviceUsageScore: subService.serviceUsageScore,
        skillLevel: subService.skillLevel,
        image: image ? { create: image } : {},
      });
    }
  }

  return createOrUpdate;
}

