import { Address } from "@prisma/client"
export type CreateAddressDTO = {
    id?:string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}