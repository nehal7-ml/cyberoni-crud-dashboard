import "server-only";
import { Event, EventStatus, PrismaClient, User } from "@prisma/client";
import { CreateEventDTO, CreateImageDTO } from "./DTOs";
import { connectOrCreateObject as connectTag } from "./tags";
import { CreateTagDTO } from "./DTOs";
import { HttpError } from "@/lib/utils";
import { connectOrCreateObject as connectImages } from "./images";



async function create(event: CreateEventDTO, prismaClient: PrismaClient) {
  const events = prismaClient.event;
  let createdevent = await events.create({
    data: {
      name: event.name,
      description: event.description,
      isVirtual: event.isVirtual,
      location: event.location,
      status: event.status,      
      eventLink: event.eventLink,
      date: new Date(event.date),
      image: await connectImages(event.image, []),
      tags: { connectOrCreate: connectTag(event.tags, []).connectOrCreate },
    },
  });
  return createdevent;
}

async function update(
  eventId: string,
  event: CreateEventDTO,
  prismaClient: PrismaClient,
) {
  const events = prismaClient.event;
  const oldEvent = await events.findUnique({where: {id: eventId}, include: {image: true, tags:true}})

  if(!oldEvent) throw HttpError(404 , 'Event Not found')
  const updatedEvent = await events.update({
    where: { id: eventId },
    data: {
      name: event.name,
      description: event.description,
      isVirtual: event.isVirtual,
      location: event.location,
      status: event.status,      
      eventLink: event.eventLink,
      date: new Date(event.date),
      image: await connectImages(event.image, oldEvent.image),
      tags: connectTag(event.tags,oldEvent.tags ),
    },
  });
  return updatedEvent;
}
async function remove(eventId: string, prismaClient: PrismaClient) {
  const events = prismaClient.event;
  const existingevent = await events.findUnique({ where: { id: eventId } });
  if (existingevent) {
    await events.delete({ where: { id: eventId } });
  }
}
async function read(eventId: string, prismaClient: PrismaClient) {
  const events = prismaClient.event;
  const existingevent = await events.findUnique({
    where: { id: eventId },
    include: { image: true, tags: true },
  });
  if (existingevent) return existingevent;
}

async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
  options?: {
    order: 'asc' | 'desc';
    orderby: 'updatedAt' | 'name';
  }
) {
  const events = prismaClient.event;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let allEvents = await events.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {},
    include: {
      // reviews: true,
    },
    orderBy: options?.orderby? {
      [options.orderby]: options.order
    }: {
      createdAt: 'desc',
      
    },

  });

  const totalCount = await events.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allEvents, currentPage: page, totalPages, pageSize };
}

export { create, update, remove, read, getAll };
