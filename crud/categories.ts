import { PrismaClient } from "@prisma/client";
import { CategoryType } from "@/types/global";
import { CreateCategory } from "./DTOs";
import { HttpError } from "@/lib/utils";

// Get categories based on the type
async function getCategories(type: CategoryType, prisma: PrismaClient) {
  switch (type) {
    case "product":
      return await prisma.productCategory.findMany({
        where: {
          parent: {
            is: null,
          },
        },
        include: { children: true },
      });
    case "prompt":
      return await prisma.gptCategory.findMany({
        where: {
          parent: {
            is: null,
          },
        },
        include: { children: true },
      });
    case "blog":
      return await prisma.blogCategory.findMany({
        where: {
          parent: {
            is: null,
          },
        },
        include: { children: true },
      });
    

    case "software": {
      return await prisma.softwareProductCategory.findMany({
        where: {
          parent: {
            is: null,
          },
        },
        include: { children: true },
      })
    }
    default:
      throw new Error(`Unknown category type: ${type}`);
  }
}

// Update a specific category by id
async function updateCategory(
  id: string,
  category: CreateCategory,
  type: CategoryType,
  prisma: PrismaClient,
) {
  switch (type) {
    case "product": {
      let existing = await prisma.productCategory.findUnique({
        where: { id },
        include: { children: true },
      });
      if (!existing) throw HttpError(404, "Category not found");
      return await prisma.productCategory.update({
        where: { id },
        data: {
          name: category.name,
          children: createOrUpdateOrDeleteChildren(
            category.children,
            existing.children,
          ),
        },
        include: {
          children: true,
        },
      });
    }
    case "prompt": {
      let existing = await prisma.gptCategory.findUnique({
        where: { id },
        include: { children: true },
      });
      if (!existing) throw HttpError(404, "Category not found");
      return await prisma.gptCategory.update({
        where: { id },
        data: {
          name: category.name,
          children: createOrUpdateOrDeleteChildren(
            category.children,
            existing.children,
          ),
        },
        include: {
          children: true,
        },
      });
    }
    case "blog": {
      let existing = await prisma.blogCategory.findUnique({
        where: { id },
        include: { children: true },
      });
      if (!existing) throw HttpError(404, "Category not found");
      return await prisma.blogCategory.update({
        where: { id },
        data: {
          name: category.name,
          children: createOrUpdateOrDeleteChildren(
            category.children,
            existing.children,
          ),
        },
        include: {
          children: true,
        },
      });
    }
    case "software": {
      let existing = await prisma.softwareProductCategory.findUnique({
        where: { id },
        include: { children: true },
      });
      if (!existing) throw HttpError(404, "Category not found");
      return await prisma.softwareProductCategory.update({
        where: { id },
        data: {
          name: category.name,
          children: createOrUpdateOrDeleteChildren(
            category.children,
            existing.children,
          ),
        },
        include: {
          children: true,
        },
      });
    }

    default:
      throw new Error(`Unknown category type: ${type}`);
  }
}

// Add a new category
async function addCategory(
  type: CategoryType,
  category: CreateCategory,
  prisma: PrismaClient,
) {
  const categories =
    prisma[
      type === "blog"
        ? "blogCategory"
        : type === "prompt"
          ? "gptCategory"
          : "productCategory"
    ];
  switch (type) {
    case "product": {
      let existingCategory = await prisma.productCategory.findFirst({
        where: {
          parent: {
            name: category.name,
            parent: null,
          },
        },
      });

      if (existingCategory) HttpError(400, "Category already exists");

      return await prisma.productCategory.create({
        data: {
          name: category.name,
          children: {
            create: category.children.map((child) => {
              return {
                name: child.name,
              };
            }),
          },
        },
        include: {
          children: true,
        },
      });
    }
    case "prompt": {
      let existingCategory = await prisma.gptCategory.findFirst({
        where: {
          parent: {
            name: category.name,
            parent: null,
          },
        },
      });

      if (existingCategory) HttpError(400, "Category already exists");
      return await prisma.gptCategory.create({
        data: {
          name: category.name,
          children: {
            create: category.children.map((child) => {
              return {
                name: child.name,
              };
            }),
          },
        },
        include: {
          children: true,
        },
      });
    }
    case "blog": {
      let existingCategory = await prisma.blogCategory.findFirst({
        where: {
          parent: {
            name: category.name,
            parent: null,
          },
        },
      });

      if (existingCategory) HttpError(400, "Category already exists");
      return await prisma.blogCategory.create({
        data: {
          name: category.name,
          children: {
            create: category.children.map((child) => {
              return {
                name: child.name,
              };
            }),
          },
        },
        include: {
          children: true,
        },
      });
    }
    case "software": {
      let existingCategory = await prisma.softwareProductCategory.findFirst({
        where: {
          parent: {
            name: category.name,
            parent: null,
          },
        },
      });
      if (existingCategory) HttpError(400, "Category already exists");
      return await prisma.softwareProductCategory.create({
        data: {
          name: category.name,
          children: {
            create: category.children.map((child) => {
              return {
                name: child.name,
              };
            }),
          },
        },
        include: {
          children: true,
        },
      });
    }
    default:
      throw new Error(`Unknown category type: ${type}`);
  }
}

// Remove a category by id
async function removeCategory(
  id: string,
  type: CategoryType,
  prisma: PrismaClient,
) {
  switch (type) {
    case "product": {
      await prisma.product.updateMany({
        where: {
          OR: [{ category: { parent: { id } } }, { productCategoryId: id }],
        },
        data: { productCategoryId: null },
      });
      let existingCategory = await prisma.productCategory.findUnique({
        where: { id },
        include: { children: true },
      });
      await prisma.productCategory.deleteMany({
        where: {
          id: { in: existingCategory?.children?.map((child) => child.id) },
        },
      });

      return await prisma.productCategory.delete({ where: { id } });
    }
    case "prompt":
      {
        await prisma.gptPrompt.updateMany({
          where: {
            OR: [{ category: { parent: { id } } }, { category: { id } }],
          },
          data: { gptCategoryId: null },
        });
        let existingCategory = await prisma.gptCategory.findUnique({
          where: { id },
          include: { children: true },
        });
        await prisma.gptCategory.deleteMany({
          where: {
            id: { in: existingCategory?.children?.map((child) => child.id) },
          },
        });
      }

      return await prisma.gptCategory.delete({ where: { id } });

    case "blog": {
      await prisma.blog.updateMany({
        where: {
          OR: [{ category: { parent: { id } } }, { category: { id } }],
        },
        data: { blogCategoryId: null },
      });
      let existingCategory = await prisma.blogCategory.findUnique({
        where: { id },
        include: { children: true },
      });
      await prisma.blogCategory.deleteMany({
        where: {
          id: { in: existingCategory?.children?.map((child) => child.id) },
        },
      });

      return await prisma.blogCategory.delete({ where: { id } });
    }

    case "software": {
      let existingCategory = await prisma.softwareProductCategory.findUnique({
        where: { id },
        include: { children: true },
      });
      await prisma.softwareProductCategory.deleteMany({
        where: {
          id: { in: existingCategory?.children?.map((child) => child.id) },
        },
      });

      return await prisma.softwareProductCategory.delete({ where: { id } });
    }
    default:
      throw new Error(`Unknown category type: ${type}`);
  }
}

async function readCategory(
  id: string,
  type: CategoryType,
  prisma: PrismaClient,
) {
  switch (type) {
    case "product":
      return await prisma.productCategory.findUnique({
        where: { id },
        include: {
          children: true,
        },
      });
    case "prompt":
      return await prisma.gptCategory.findUnique({
        where: { id },
        include: {
          children: true,
        },
      });
    case "blog":
      return await prisma.blogCategory.findUnique({
        where: { id },
        include: {
          children: true,
        },
      });

    case "software":
      return await prisma.softwareProductCategory.findUnique({
        where: { id },
        include: {
          children: true,
        },
      })
  }
}

function createOrUpdateOrDeleteChildren(
  newChildren: { name: string; id?: string }[],
  existingChildren: { name: string; id?: string }[],
) {
  // Create a map of existing children by id for quick lookup
  const existingMap = new Map(
    existingChildren.map((child) => [child.id, child]),
  );

  // Determine updates by checking for matching ids and different names
  const toUpdate = newChildren
    .filter(
      (newChild) =>
        newChild.id &&
        existingMap.has(newChild.id) &&
        existingMap.get(newChild.id)?.name !== newChild.name,
    )
    .map((child) => ({
      where: {
        id: child.id,
      },
      data: {
        name: child.name,
      },
    }));

  // Determine deletions by checking for ids not present in the new children list
  const toDelete = existingChildren
    .filter(
      (existingChild) =>
        !newChildren.some((newChild) => newChild.id === existingChild.id),
    )
    .map((child) => ({
      id: child.id,
    }));

  // Determine creations by filtering out children without ids or whose ids are not in the existing map
  const toCreate = newChildren
    .filter((newChild) => !newChild.id || !existingMap.has(newChild.id))
    .map((child) => ({
      name: child.name,
    }));

  return {
    create: toCreate,
    update: toUpdate.length > 0 ? toUpdate : undefined,
    delete: toDelete.length > 0 ? toDelete : undefined,
  };
}

export {
  getCategories,
  updateCategory,
  addCategory,
  readCategory,
  removeCategory,
};
