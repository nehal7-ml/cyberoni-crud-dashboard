import { Address } from "@prisma/client"
export type createAddressDTO = {
    id?:string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}