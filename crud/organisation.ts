import { prisma } from "@/lib/prisma";
import { CreateOrgDTO, UpdateOrgDTO } from "./DTOs";

async function createOrganization(org: CreateOrgDTO) {
  const orgs = prisma.organization;

  const newORg = await orgs.create({
    data: {
      name: org.name,
      owners: {
        connect: {
          id: org.ownerId,
        },
      },
    },
  });

  return newORg;
}

async function updateOrg(org: UpdateOrgDTO) {
  const orgs = prisma.organization;
  const updated = await orgs.update({
    where: {
      id: org.id,
    },
    data: {
      name: org.name,
      owners: {
        connect: {
          id: org.ownerId,
        },
      },
    },
  });
  return updated;
}

async function removeOrg(id: string) {
  const orgs = prisma.organization;
  const deleted = await orgs.delete({
    where: {
      id,
    },
  });

  return deleted;
}

async function addOwnerToOrg(email: string, orgId: string, userId: string) {
  const orgs = prisma.organization;

  const updated = await orgs.update({
    where: {
      id: orgId,
    },
    data: {
      owners: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return updated;
}

async function removeOwnerToOrg(email: string, orgId: string, userId: string) {
  const orgs = prisma.organization;

  const updated = await orgs.update({
    where: {
      id: orgId,
    },
    data: {
      owners: {
        disconnect: {
          id: userId,
        },
      },
    },
  });

  return updated;
}

async function addUserToOrg(email: string, orgId: string, userId: string) {
  const orgs = prisma.organization;

  const updated = await orgs.update({
    where: {
      id: orgId,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return updated;
}

async function removeUserToOrg(email: string, orgId: string, userId: string) {
  const orgs = prisma.organization;

  const updated = await orgs.update({
    where: {
      id: orgId,
    },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
  });

  return updated;
}
export {
  addUserToOrg,
  removeUserToOrg,
  addOwnerToOrg,
  removeOwnerToOrg,
  createOrganization,
  updateOrg,
  removeOrg,
};
