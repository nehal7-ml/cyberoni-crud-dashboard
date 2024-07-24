import { Role } from "@prisma/client";
import "server-only"



async function verifyOrgAccess(orgId: string, currentOrgId: string, role: Role,) {

    // check if user has access to the organization
    if (currentOrgId !== orgId) {

        if (role !== Role.SUPERUSER) return false
        else return true

    }

    return true
}  

export default verifyOrgAccess