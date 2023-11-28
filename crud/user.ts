import { User, PrismaClient, Role } from "@prisma/client";
import { connectOrCreateObject, CreateImageDTO } from "./images";
import { CreateAddressDTO } from "./address";
import { getAllRecordsDTO } from "./commonDTO";


export type CreateUserDTO = {
    id?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    image?: CreateImageDTO;
    address: CreateAddressDTO;
    role: Role;
}

export type displayUserDTO = {
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
        let createdUser = await users.create({
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: { create: user.image },
                address: { create: user.address },
                role: user.role,
            }
        });
        return createdUser
    }

}

async function update(userId: string, user: CreateUserDTO, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { id: userId } })

    if (!existingUser) throw { status: 400, message: `User ${user.email} doesn't exists` };
    else {
        let updatedUser = await users.update({
            where: { id: userId }, data: {
                email: user.email,
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


export { create, update, remove, read, getAll }