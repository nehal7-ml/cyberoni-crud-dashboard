import { User } from "next-auth";

export function isUserAdmin(user: User) {
    return user.role === "ADMIN";
}


export function isUserSuperUser(user: User) {
    return user.role === "SUPERUSER";
}

export function hasAccess(user: User, orgId: string) {
    if (isUserSuperUser(user)) {
        return true
    }


    if (!isUserAdmin(user)) {
        return false
    }

    if (user.orgId === orgId) {

        return true
    }

    return false

}

export function orgQuery(user: User) {
    if (isUserSuperUser(user)) {
        return []
    }
    return [
        {
            Organization: {
                id: user.orgId
            }
        }
    ]
}


export function userQuery(user: User) {
    if (isUserSuperUser(user)) {
        return []
    }
    return [{ Organization: { some: { id: user.orgId } } }]

}