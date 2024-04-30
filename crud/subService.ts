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
  connectOrCreateObject,
} from "./tags";
import { CreateImageDTO, CreateSubServiceDTO, CreateTagDTO } from "./DTOs";
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
      tags: { connectOrCreate: connectTags(newSubService.tags || [], []).connectOrCreate },
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
      tags: { connectOrCreate: connectTags(subService.tags || [], []).connectOrCreate },
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
      tags: { connectOrCreate: connectTags(subService.tags || [], []).connectOrCreate },
    });
  }

  return createObject;
}

export async function updateSubServiceObject(
  newSubServices: CreateSubServiceDTO[],
  oldSubServices: CreateSubServiceDTO[],
) {
  let createOrUpdateOrDelete: {
    create: (Omit<CreateSubServiceDTO, "image" | "tags"> & {
      image?:
      | {
        create?: CreateImageDTO;
      }
      | {},

      tags?: {
        connectOrCreate: {
          where: { name: string };
          create: CreateTagDTO;
        }[];
      };
    })[];
    update: {
      where: {
        id: string;
      };

      data: Omit<CreateSubServiceDTO, "image" | 'tags'> & {
        image: {
          update?: {
            where: { id: string };
            data: CreateImageDTO;
          };
          create?: CreateImageDTO;
        },
        tags?: {
          connectOrCreate: {
            where: { name: string };
            create: CreateTagDTO;
          }[];
        }
      };
    }[];
    delete: { id: string }[];
  } = {
    create: [],
    update: [],
    delete: [],
  };

  for (const old of oldSubServices) {
    const subService = newSubServices.find(subService => subService.id === old.id)
    if (!subService) {
      createOrUpdateOrDelete.delete.push({ id: old.id as string })

    } else {
      const image = await createImageObject(subService.image);

      createOrUpdateOrDelete.update.push({
        where: {
          id: subService.id as string,
        },
        data: {
          title: subService.title,
          complexity: subService.complexity,
          department: subService.department,
          description: subService.description,
          estimated_hours_times_fifty_percent: subService.estimated_hours_times_fifty_percent,
          estimated_hours_times_one_hundred_percent: subService.estimated_hours_times_one_hundred_percent,
          overheadCost: subService.overheadCost,
          pricingModel: subService.pricingModel,
          serviceDeliverables: subService.serviceDeliverables,
          serviceUsageScore: subService.serviceUsageScore,
          skillLevel: subService.skillLevel,
          tags: subService.tags
            ? connectOrCreateObject(subService.tags, old.tags || [])
            : undefined,
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


    }
  }

  for (const subService of newSubServices) {

    if (!subService.id) {
      const image = await createImageObject(subService.image);

      createOrUpdateOrDelete.create.push(
        {
          title: subService.title,
          complexity: subService.complexity,
          department: subService.department,
          description: subService.description,
          estimated_hours_times_fifty_percent: subService.estimated_hours_times_fifty_percent,
          estimated_hours_times_one_hundred_percent: subService.estimated_hours_times_one_hundred_percent,
          overheadCost: subService.overheadCost,
          pricingModel: subService.pricingModel,
          serviceDeliverables: subService.serviceDeliverables,
          serviceUsageScore: subService.serviceUsageScore,
          skillLevel: subService.skillLevel,
          tags: subService.tags
            ? { connectOrCreate: connectOrCreateObject(subService.tags, []).connectOrCreate }
            : undefined,
          image: subService.image ? { create: image } : {}


        }

      )
    }


  }

  return createOrUpdateOrDelete;
}
