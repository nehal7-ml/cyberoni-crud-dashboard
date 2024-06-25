import { TableType } from "@/types/global";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";
import { DisplayUserDTO } from "@/crud/user";
import {
    Discount,
    DisplayBlogDTO,
    DisplayDiscountDTO,
    DisplayEventDTO,
    DisplayReferralDTO,
    DisplayServiceDTO,
    DisplaySoftwareProductDTO,
} from "@/crud/DTOs";

/**
 *  check if user has access to the requested resource
 *
 */
export default function verifyAccess(
    user: {
        id: string,
        role: Role
    },
    resource: |
    {
        data: {
            id: string;
            author: { id: string }
        },
        type: 'blogs'
    } |
    {
        data: {
            id: string;
            createdBy: { id: string }
        }

        type: TableType;
    }
) {
    try {
        if (resource.type === "blogs") {
            if ((resource.data).author?.id === user.id) return true;
            else return false;
        } else {
            if (resource.data.createdBy?.id === user.id) return true;
            else return false
        }
    } catch (error) {
        console.error(error);

        return false;
    }
}
