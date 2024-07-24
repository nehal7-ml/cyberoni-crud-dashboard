import "server-only";
import { PrismaClient, Role } from "@prisma/client";
import { CreateDiscountDTO } from "./DTOs";
import { prisma } from "@/lib/prisma";
import { User } from "next-auth";
import { userQuery } from "./permissions";
export async function create(
  discount: CreateDiscountDTO,
  user: User
) {
  const discounts = prisma.discount;
  const newDiscount = await discounts.create({
    data: {
      name: discount.name,
      value: discount.value,
      expires: discount.expires,
      createdBy: { connect: { id: user.id } },
      Organization: {
        connect: {
          id: user.orgId
        }
      }
    },
  });

  return newDiscount;
}

export async function read(id: string, user: User) {
  const discounts = prisma.discount;
  const newDiscount = await discounts.findUnique({
    where: {
      id,
      AND: userQuery(user)
    },
  });

  return newDiscount;
}

export async function remove(id: string, user: User) {
  const discounts = prisma.discount;
  const newDiscount = await discounts.delete({
    where: {
      id,
      AND: userQuery(user),
    },
  });

  return newDiscount;
}

export async function update(
  id: string,
  discount: CreateDiscountDTO,
  user: User
) {
  const discounts = prisma.discount;
  const newDiscount = await discounts.update({
    where: {
      id,
      AND: userQuery(user),
    },
    data: discount,
  });

  return newDiscount;
}

export async function getAll(
  page: number,
  pageSize: number,
  user: User,
  options?: {
    order: "asc" | "desc";
    orderby: "updatedAt" | "name";
  },
) {
  const discounts = prisma.discount;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");
  let query = { AND: userQuery(user) }
  let allDiscounts = await discounts.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: query,
    orderBy: options?.orderby
      ? {
        [options.orderby]: options.order,
      }
      : {
        createdAt: "desc",
      },
  });

  const totalCount = await discounts.count({ where: query });
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allDiscounts, currentPage: page, totalPages, pageSize };
}
