import "server-only";
import { PrismaClient, Prisma, FAQ } from "@prisma/client";
import {
  create as createTag,
  connectOrCreateObject as connectTags,
} from "./tags";
import {
  create as createImage,
  connectOrCreateObject as connectImage,
  createObject as createImageObject,
} from "./images";
import {
  CreateImageDTO,
  CreateServiceDescription,
  CreateSubServiceDTO,
} from "./DTOs";
import {
  create as createSubService,
  createSubservicesObject,
  update as updateSubService,
  updateSubServiceObject,
} from "./subService";

import { CreateServiceDTO } from "./DTOs";
import { HttpError, seoUrl } from "@/lib/utils";
import { indexPage } from "@/lib/googleIndexing";

async function create(service: CreateServiceDTO, prismaClient: PrismaClient) {
  const services = prismaClient.service;
  let image = await createImageObject(service.image);
  let createdService = await services.create({
    data: {
      title: service.title,
      featured: service.featured,
      previewContent: service.previewContent,
      hourlyRate: service.hourlyRate,
      valueBrought: service.valueBrought,
      skillsUsed: service.skillsUsed,
      htmlEmbed: service.htmlEmbed,
      image: image ? { create: image } : {},
      tags: { connectOrCreate: connectTags(service.tags || [], []).connectOrCreate },
      faqs: {
        create: service.faqs ? service.faqs : [],
      },
      SubServices: {
        create: await createSubservicesObject(
          service.SubServices as CreateSubServiceDTO[],
        ),
      },
      ServiceDescription: {
        create: await createServiceDescriptionObject(
          service.ServiceDescription as CreateServiceDescription[],
        ),
      },
    },
    include: {
      SubServices: true,
      image: true,
      tags: true,
      faqs: {
        select: {
          id: true,
          question: true,
          answer: true
        }
      },

      ServiceDescription: {
        include: {
          image: true,
        },
      },
    },
  });
  await updateIndex(createdService.id, createdService.title, "URL_UPDATED")

  return createdService;
}

async function update(
  serviceId: string,
  service: CreateServiceDTO,
  prismaClient: PrismaClient,
) {
  const services = prismaClient.service;
  const oldService = await services.findUnique({
    where: { id: serviceId }, include: {
      SubServices: true,
      image: true,
      ServiceDescription: {
        include: {
          image: true
        }
      },
      faqs: {
        select: {
          id: true,
          question: true,
          answer: true
        }
      },
      tags: true,

    }
  })

  if (!oldService) throw HttpError(404, 'Service not found')
  let image = await createImageObject(service.image);

  let createFaqs = service.faqs?.filter(faq => !faq.id) || []
  let updateFaqs = service.faqs?.filter(faq => faq.id) || []
  let deleteFaqs = oldService.faqs?.filter(oldFaq => 
    !(service.faqs || []).some(newFaq => newFaq.id === oldFaq.id)
) || [];
  // let currentService = await services.findUnique({ where: { id: serviceId } })
  let updatedService = await services.update({
    where: { id: serviceId },
    data: {
      title: service.title,
      featured: service.featured,
      previewContent: service.previewContent,
      hourlyRate: service.hourlyRate,
      valueBrought: service.valueBrought,
      skillsUsed: service.skillsUsed,
      htmlEmbed: service.htmlEmbed,
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
      tags: connectTags(service.tags || [], oldService.tags),
      faqs: {
        create: createFaqs,
        update: updateFaqs.map(faq => ({ where: { id: faq.id }, data: faq })),
        deleteMany: deleteFaqs.map(faq => ({ id: faq.id })),
      },
      SubServices: await updateSubServiceObject(
        service.SubServices as CreateSubServiceDTO[],
        oldService?.SubServices as CreateSubServiceDTO[]
      ),
      ServiceDescription: await updateServiceDescriptionObject(
        service.ServiceDescription,
        oldService?.ServiceDescription as CreateServiceDescription[]
      ),
    },
    include: {
      SubServices: true,
      image: true,
      tags: true,
      ServiceDescription: true,
      faqs: {
        select: {
          id: true,
          question: true,
          answer: true
        }
      }
    },
  });
  await updateIndex(updatedService.id, updatedService.title, "URL_UPDATED")

  return updatedService;
}
async function remove(serviceId: string, prismaClient: PrismaClient) {
  const services = prismaClient.service;
  const existingService = await services.findUnique({
    where: { id: serviceId },
  });
  if (existingService) {
    await services.delete({
      where: { id: serviceId },
      include: { SubServices: true, ServiceDescription: true, image: true },
    });
    await updateIndex(existingService.id, existingService.title, "URL_DELETED")
  }
}
async function read(serviceId: string, prismaClient: PrismaClient) {
  const services = prismaClient.service;
  const existingService = await services.findUnique({
    where: { id: serviceId },
    include: {
      SubServices: {
        include: {
          image: true,
          tags: true,
        }
      },
      ServiceDescription: {
        include: {
          image: true,
        },
      },
      image: true,
      tags: true,
      faqs: {
        select: {
          id: true,
          question: true,
          answer: true
        }
      }

    },
  });
  if (existingService) return existingService;
}

async function getServicesByName(
  serviceName: string,
  prismaClient: PrismaClient,
) { }

async function getServicesByTag(tag: string, prismaClient: PrismaClient) { }

async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
  options?: {
    order: 'asc' | 'desc';
    orderby: 'updatedAt' | 'title';
  }
) {
  const services = prismaClient.service;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50 && pageSize !== 0)
    throw new Error("page size must be 10, 30 or 50");

  let allServices = await services.findMany({
    skip: page === 0 ? 0 : (page - 1) * pageSize,
    take: page === 0 ? 9999 : pageSize,
    where: {},
    include: {
      // reviews: true,
      SubServices: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: options?.orderby ? {
      [options.orderby]: options.order
    } : {
      createdAt: 'asc'
    }
  });

  const totalCount = await services.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allServices, currentPage: page, totalPages, pageSize };
}

export async function getFeatured(prisma: PrismaClient) {
  const services = prisma.service;
  const records = await services.findMany({
    where: { featured: true },
    take: 5,
    orderBy: { hourlyRate: "desc" },
  });
  return records;
}

async function createServiceDescriptionObject(
  descriptions: CreateServiceDescription[],
) {
  let create = [];

  for (const description of descriptions) {
    const subImage = await createImageObject(description.image);
    create.push({
      title: description.title,
      content: description.content,
      imageOnLeft: description.imageOnLeft,
      image: subImage ? { create: subImage } : {},
    });
  }

  return create;
}

async function updateServiceDescriptionObject(
  descriptions: CreateServiceDescription[],
  oldDescriptions: CreateServiceDescription[]
) {
  let createOrUpdateOrDelete: {
    create: any[];
    update: any[];
    delete: any[];
  } = {
    create: [],
    update: [],
    delete: [],
  };
  for (const oldDescription of oldDescriptions) {
    const toUpdate = descriptions.find(description => description.id === oldDescription.id);

    if (toUpdate) {
      const image = await createImageObject(toUpdate.image);

      createOrUpdateOrDelete.update.push({
        where: {
          id: toUpdate.id,
        },
        data: {
          title: toUpdate.title,
          content: toUpdate.content,
          imageOnLeft: toUpdate.imageOnLeft,
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
      createOrUpdateOrDelete.delete.push({ id: oldDescription.id })

    }




  }


  for (const description of descriptions) {

    if (!description.id) {
      const image = await createImageObject(description.image);

      createOrUpdateOrDelete.create.push({
        title: description.title,
        content: description.content,
        imageOnLeft: description.imageOnLeft,
        image: image ? { create: image } : {},
      });
    }
  }

  return createOrUpdateOrDelete;
}


export async function updateIndex(serviceId: string, serviceTitle: string, type: "URL_UPDATED" | "URL_DELETED") {
  if (process.env.NODE_ENV !== 'production') return;
  try {
    const baseUrl = process.env.HOST
    const req = await indexPage({
      url: `${baseUrl}/services/${seoUrl(serviceTitle, serviceId)}`,
      type: type
    })

  } catch (error) {
    console.log(error);
  }
}

export { create, update, remove, read, getAll };
