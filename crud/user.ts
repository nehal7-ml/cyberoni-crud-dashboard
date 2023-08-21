import { User, PrismaClient, Role } from "@prisma/client";
import { connectOrCreateObject, createImageDTO } from "./images";
import { createAddressDTO } from "./address";


export type createUserDTO = {
    firstName?: string;
    lastName?: string | null;
    email: string;
    emailVerified: boolean;
    image?: createImageDTO;
    address?: createAddressDTO;
    role: Role;
}

export type displayUserDTO = {
    id:string;
    firstName?: string;
    lastName?: string | null;
    email: string;
    emailVerified: boolean;
    role: Role
}
async function create(user: createUserDTO, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { email: user.email } })
    if (existingUser) return;
    else {
        let createdUser = await users.create({
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: { create: user.image },
                address: { create: user.address }
            }
        });
        return createdUser
    }

}

async function update(userId: string, user: createUserDTO, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { id: userId } })

    if (existingUser) return;
    else {
        let updatedUser = await users.update({ where: { id: userId }, data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            image: { create: user.image },
            address: { create: user.address }
        } });
        return updatedUser
    }

}
async function remove(userId: string, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { id: userId } })
    if (existingUser) return false;
    else {
        await users.delete({ where: { id: userId } });
        return true;
    }
}
async function read(userId: string, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    const existingUser = await users.findUnique({ where: { id: userId } })
    if (existingUser) return existingUser
    else return
}

async function getAll(offset:number, prismaClient: PrismaClient) {
    const users = prismaClient.user;
    let allUsers = await users.findMany({
        skip: offset, take: 30,
        where: {
        },
        include: {
            // reviews: true,
        }
    })

    return allUsers
    
}


export { create, update, remove, read, getAll }