import "server-only";
import { User, PrismaClient, Role } from "@prisma/client";
import { connectOrCreateObject, createObject } from "./images";
import { CreateImageDTO } from "./DTOs";
import { CreateAddressDTO } from "./DTOs";
import { getAllRecordsDTO } from "./commonDTO";

import bcrypt from "bcrypt";
import { sendPasswordEmail } from "@/lib/sendgrid";
import { generatePassword } from "@/lib/utils";
import { verify } from "jsonwebtoken";

export type CredentialAuthDTO = {
  email: string;
  password: string;
};
export type CreateUserDTO = {
  id?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: CreateImageDTO;
  address: CreateAddressDTO;
  role: Role;
};

export type DisplayUserDTO = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  emailVerified: Date;
  role: Role;
};
async function create(user: CreateUserDTO, prismaClient: PrismaClient) {
  const users = prismaClient.user;
  const existingUser = await users.findUnique({ where: { email: user.email } });
  let image = await createObject(user.image);

  if (existingUser)
    throw { status: 400, message: `User ${user.email} already exists` };
  else {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    let createdUser = await users.create({
      data: {
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        image: image ? { create: image } : {},
        address: { create: user.address },
        role: user.role,
      },
    });

    await sendPasswordEmail({ email: user.email, password: user.password });

    return createdUser;
  }
}

async function update(
  userId: string,
  user: CreateUserDTO,
  prismaClient: PrismaClient,
) {
  const users = prismaClient.user;
  const existingUser = await users.findUnique({ where: { id: userId } });

  if (!existingUser)
    throw { status: 400, message: `User ${user.email} doesn't exists` };
  else {
    let image = await createObject(user.image);
    const match = await bcrypt.compare(user.password, existingUser.password);

    let hashedPassword =
      !match && user.password.length >= 8
        ? await bcrypt.hash(user.password, 10)
        : existingUser.password;

    let updatedUser = await users.update({
      where: { id: userId },
      data: {
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        image: {
          update: {
            where: {
              id: user.image?.id as string,
            },
            data: {
              ...image,
            },
          },
        },
        address: {
          update: {
            where: {
              id: user.address?.id as string,
            },
            data: {
              ...user.address,
            },
          },
        },
        role: user.role,
      },
    });

    if (!match) await sendPasswordEmail({ email: user.email, password: user.password });

    return updatedUser;
  }
}

export async function reset(
  token: string,
  password: string,
  prismaClient: PrismaClient,
) {
  const users = prismaClient.user;
  const { email } = verify(
    token as string,
    process.env.NEXTAUTH_SECRET as string,
  ) as { email: string };

  const hashedPassword = await bcrypt.hash(password, 10);
  const updated = await users.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });
  await sendPasswordEmail({
    email,
    password,
    subject: "New Cyberoni Crud credentials",
  });
  return true;
}
async function remove(userId: string, prismaClient: PrismaClient) {
  const users = prismaClient.user;
  const existingUser = await users.findUnique({ where: { id: userId } });
  if (!existingUser)
    throw { status: 400, message: `User ${userId} doesn't exists` };
  else {
    await users.delete({ where: { id: userId } });
    return true;
  }
}
async function read(userId: string, prismaClient: PrismaClient) {
  const users = prismaClient.user;
  const existingUser = await users.findUnique({
    where: { id: userId },
    include: { address: true },
  });
  if (existingUser) return existingUser;
  else throw { status: 400, message: `User ${userId} doesn't exists` };
}

async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
  options?: {
    order: 'asc' | 'desc';
    orderby: 'updatedAt' | 'email';
  }
) {
  const users = prismaClient.user;

  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let allUsers = await users.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {},
    orderBy: options?.orderby ? {
      [options.orderby]: options.order
    } : {
      createdAt: 'desc'
    }
  });

  const totalCount = await users.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    records: allUsers,
    currentPage: page,
    totalPages,
    pageSize,
  } as getAllRecordsDTO;
}

export async function getUserByEmail(
  email: string,
  prismaClient: PrismaClient,
) {
  const users = prismaClient.user;
  const existingUsers = await users.findUnique({ where: { email: email } });
  if (existingUsers) return existingUsers;
  else throw { status: 400, message: `User ${email} doesn't exists` };
}

export async function authorizeWithPassword(
  { email, password }: CredentialAuthDTO,
  prisma: PrismaClient,
) {
  const users = prisma.user;
  const user = await users.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (!user || user.role === "CUSTOMER" || user.role === "USER")
    throw {
      message: `Invalid credentials account doesn't exist or insufucient permissions`,
      status: 400,
    };
  else {
    const authorized = await bcrypt.compare(password, user.password as string);
    if (!authorized)
      throw {
        message: `Invalid credentials account didn't match`,
        status: 401,
      };
    return user;
  }
}

export { create, update, remove, read, getAll };
