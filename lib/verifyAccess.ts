import { Role } from "@prisma/client";

/**
 *  check if user has access to the requested resource
 *
 */
export default function verifyAccess(
    user: {
        id: string,
        role: Role,
        orgId: string
    },
    resource: |
    {
        data: {
            id: string;
            organization: {
                id: string
            }
        },
    }
) {
    try {

        return user.orgId === resource.data.organization.id
    } catch (error) {
        console.error(error);

        return false;
    }
}
