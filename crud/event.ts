import "server-only";
import { Event, EventStatus, Role } from "@prisma/client";
import { CreateEventDTO, CreateImageDTO } from "./DTOs";
import { connectOrCreateObject as connectTag } from "./tags";
import { CreateTagDTO } from "./DTOs";
import { HttpError } from "@/lib/utils";
import { connectOrCreateObject as connectImages } from "./images";
import { userQuery } from "./permissions";
import { prisma } from "@/lib/prisma"
import { User } from "next-auth";


async function create(event: CreateEventDTO, user: User) {
  const events = prisma.event;
  let createdevent = await events.create({
    data: {
      name: event.name,
      description: event.description,
      isVirtual: event.isVirtual,
      location: event.location,
      status: event.status,
      eventLink: event.eventLink,
      date: new Date(event.date),
      createdBy: {
        connect: { id: user.id }
      },
      Organization: {
        connect: { id: user.orgId },
      },
      image: await connectImages(event.image, []),
      tags: { connectOrCreate: connectTag(event.tags, []).connectOrCreate },
    },
  });
  return createdevent;
}

async function update(
  eventId: string,
  event: CreateEventDTO,
  user: User,
) {
  const events = prisma.event;
  const oldEvent = await events.findUnique({ where: { id: eventId }, include: { image: true, tags: true } })

  if (!oldEvent) throw HttpError(404, 'Event Not found')
  const updatedEvent = await events.update({
    where: { id: eventId, AND: userQuery(user) },
    data: {
      name: event.name,
      description: event.description,
      isVirtual: event.isVirtual,
      location: event.location,
      status: event.status,
      eventLink: event.eventLink,
      date: new Date(event.date),
      image: await connectImages(event.image, oldEvent.image),
      tags: connectTag(event.tags, oldEvent.tags),
    },
  });
  return updatedEvent;
}
async function remove(eventId: string, user: User) {
  const events = prisma.event;
  const existingEvent = await events.findUnique({ where: { id: eventId, AND: userQuery(user) } });
  if (existingEvent) {
    await events.delete({ where: { id: eventId } });
  }
}
async function read(eventId: string, user: User) {
  const events = prisma.event;
  const existingEvent = await events.findUnique({
    where: { id: eventId, AND: userQuery(user) },
    include: { image: true, tags: true },
  });
  if (existingEvent) return existingEvent;
}

async function getAll(
  page: number,
  pageSize: number,
  user: User,
  options?: {
    order: 'asc' | 'desc';
    orderby: 'updatedAt' | 'name';
  }
) {
  const events = prisma.event;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let query = { AND: userQuery(user) }

  let allEvents = await events.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: query,
    include: {
      // reviews: true,
    },
    orderBy: options?.orderby ? {
      [options.orderby]: options.order
    } : {
      createdAt: 'desc',

    },

  });

  const totalCount = await events.count({ where: query });
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allEvents, currentPage: page, totalPages, pageSize };
}

export { create, update, remove, read, getAll };
