import { Product, CartItem, PrismaClient } from "@prisma/client";
import 'server-only';
export type createCartItemDTO = {
    quantity: number;
    productId: string;
    userEmail: string
}

async function create(cartItem: createCartItemDTO, prismaClient: PrismaClient) {
    const cartItems = prismaClient.cartItem;
    let createdcartItem = await cartItems.create({
        data:
        {
            quantity: cartItem.quantity,
            product: { connect: { id: cartItem.productId } },
            user: { connect: { email: cartItem.userEmail } }

        }
    });
    return createdcartItem

}

async function update(cartItemId: string, cartItem: createCartItemDTO, prismaClient: PrismaClient) {
    const cartItems = prismaClient.cartItem;
    const item = await cartItems.update({
        where: { id: cartItemId },
        data: {
            quantity: cartItem.quantity,
        }
    })

    return item

}
async function remove(cartItemId: string, prismaClient: PrismaClient) {
    const cartItems = prismaClient.cartItem;
    const existingcartItem = await cartItems.findUnique({ where: { id: cartItemId } })
    if (existingcartItem) {
        await cartItems.delete({ where: { id: cartItemId } })
    }
}
async function read(cartItemId: string, prismaClient: PrismaClient) {
    const cartItems = prismaClient.cartItem;
    const existingcartItem = await cartItems.findUnique({ where: { id: cartItemId } })
    if (existingcartItem) return existingcartItem;

}



export { create, update, remove, read }