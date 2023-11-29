import { User, PrismaClient, Role } from "@prisma/client";
import { connectOrCreateObject, CreateImageDTO } from "./images";
import { CreateAddressDTO } from "./address";
import { getAllRecordsDTO } from "./commonDTO";

import bcrypt from 'bcrypt'
import { sendPasswordEmail } from "@/lib/sendgrid";


export type CredentialAuthDTO = {
    email: string;
    password: string;
}
export type CreateUserDTO = {
    id?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    email: string;
    image?: CreateImageDTO;
    address: CreateAddressDTO;
    role: Role;
}

export type DisplayUserDTO = {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    emailVerified: Date;
    role: Role
}
async function create(user: CreateUserDTO, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { email: user.email } })
    if (existingUser) throw { status: 400, message: `User ${user.email} already exists` };
    else {
        const hashedPassword = await bcrypt.hash(user.password, 10)

        let createdUser = await users.create({
            data: {
                email: user.email,
                password: hashedPassword,
                firstName: user.firstName,
                lastName: user.lastName,
                image: { create: user.image },
                address: { create: user.address },
                role: user.role,
            }
        });

        await sendPasswordEmail({ email: user.email, password: user.password })

        return createdUser
    }

}

async function update(userId: string, user: CreateUserDTO, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { id: userId } })

    if (!existingUser) throw { status: 400, message: `User ${user.email} doesn't exists` };
    else {
        let hashedPassword = user.password.length >= 8 ? await bcrypt.hash(user.password, 10) : existingUser.password;

        let updatedUser = await users.update({
            where: { id: userId }, data: {
                email: user.email,
                password: hashedPassword,
                firstName: user.firstName,
                lastName: user.lastName,
                image: {
                    update: {
                        where: {
                            id: user.image?.id as string
                        },
                        data: {
                            ...user.image
                        }
                    }
                },
                address: {
                    update: {
                        where: {
                            id: user.address?.id as string
                        },
                        data: {
                            ...user.address
                        }

                    }
                },
                role: user.role
            }
        });
        await sendPasswordEmail({ email: user.email, password: user.password })

        return updatedUser
    }

}
async function remove(userId: string, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { id: userId } })
    if (existingUser) throw { status: 400, message: `User ${userId} doesn't exists` };
    else {
        await users.delete({ where: { id: userId } });
        return true;
    }
}
async function read(userId: string, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { id: userId }, include: { address: true } })
    if (existingUser) return existingUser
    else throw { status: 400, message: `User ${userId} doesn't exists` };
}

async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const users = prismaClient.user;

    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allUsers = await users.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
        where: {
        },

    })

    const totalCount = await users.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records: allUsers, currentPage: page, totalPages, pageSize } as getAllRecordsDTO

}


export async function getUserByEmail(email: string, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUsers = await users.findUnique({ where: { email: email } })
    if (existingUsers) return existingUsers
    else throw { status: 400, message: `GuruAgent ${email} doesn't exists` };
}

export async function authorizeWithPassword({ email, password }: CredentialAuthDTO, prisma: PrismaClient) {
    const users = prisma.user
    const user = await users.findUnique({ where: { email: email.toLowerCase() } })
    if (!user) throw { message: `Invalid credentials account doesn't exist`, status: 400 };

    else {
        const authorized = await bcrypt.compare(password, user.password as string)
        if (!authorized) throw { message: `Invalid credentials account didn't match`, status: 401 };
        return user
    }

}


export { create, update, remove, read, getAll }