import "server-only";
import { PrismaClient, Referral, Role } from "@prisma/client";
import { CreateReferralDTO } from "./DTOs";
import { prisma } from "@/lib/prisma";
import { User } from "next-auth";
import { userQuery } from "./permissions";
import { HttpError } from "@/lib/utils";
export async function create(
  referral: CreateReferralDTO,
  user: User
) {
  const referrals = prisma.referral;
  const newReferral = await referrals.create({
    data: {
      campaignId: referral.campaignId,
      link: referral.link,
      description: referral.description,
      prefix: referral.prefix,
      fallback: referral.fallback,
      expires: referral.expires,
      redirect: referral.redirect,
      priority: referral.priority,
      type: referral.type,
      utmProps: referral.utmProps,
      createdBy: referral.userId
        ? { connect: { id: user.id } }
        : undefined,
        Organization: {
          connect: { id: user.orgId },
        },
      click: 0,
    },
  });

  return newReferral;
}

export async function read(id: string, user: User) {
  const referrals = prisma.referral;
  const newReferral = await referrals.findUnique({
    where: {
      id,
      AND: userQuery(user),
    },
  });

  if (!newReferral) throw HttpError(404, "Referral not found")

  return newReferral;
}

export async function remove(id: string, user: User) {
  const referrals = prisma.referral;
  const newReferral = await referrals.delete({
    where: {
      id,
      AND: userQuery(user),
    },
  });

  return newReferral;
}

export async function update(
  id: string,
  referral: CreateReferralDTO,
  user: User,
) {
  const referrals = prisma.referral;
  const newReferral = await referrals.update({
    where: {
      id,
      AND: userQuery(user),
    },
    data: {
      campaignId: referral.campaignId,
      link: referral.link,
      description: referral.description,
      prefix: referral.prefix,
      fallback: referral.fallback,
      expires: referral.expires,
      redirect: referral.redirect,
      priority: referral.priority,
      type: referral.type,
      utmProps: referral.utmProps,
      click: referral.click,
    },
  });

  return newReferral;
}

export async function getAll(
  page: number,
  pageSize: number,
  user: User,
  options?: {
    order: "asc" | "desc";
    orderby: "updatedAt" | "prefix" | "expires" | "click";
  },
) {
  const refferals = prisma.referral;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let allrefferals = await refferals.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      AND: userQuery(user),
    },
    orderBy: options?.orderby
      ? {
        [options.orderby]: options.order,
      }
      : {
        createdAt: "desc",
      },
  });

  const totalCount = await refferals.count({ where: user?.role === 'SUPERUSER' ? {} : { createdBy: { id: user.id } } });
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allrefferals, currentPage: page, totalPages, pageSize };
}
