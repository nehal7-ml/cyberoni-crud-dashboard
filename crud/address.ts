import { Address } from "@prisma/client"
export type createAddressDTO = {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}