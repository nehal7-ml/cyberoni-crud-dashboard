/**
 * @jest-environment node
 */
import { Image, PrismaClient, SoftwarePricing, SoftwareProduct, SoftwareProductStatus } from "@prisma/client";
import { create, read, update, remove, getAll } from "@/crud/softwareProduct"; // Adjust the path accordingly
import { CreateImageDTO, CreateSoftwareProductDTO } from "@/crud/DTOs";
import { HttpError } from "@/lib/utils";

const prisma = new PrismaClient();

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    softwareProduct: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("SoftwareProduct Service", () => {
  let prismaClient: PrismaClient;

  beforeEach(() => {
    prismaClient = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new software product", async () => {
      const productData = {
        title: "Test Product",
        subTitle: "Test Subtitle",
        description: "Test Description",
        images: [],
        pricing: "Free" as SoftwarePricing, 
        link: "http://example.com",
        githubLink: "http://github.com/example",
        status: "Released" as SoftwareProductStatus,
        tags: [],
        blog: { id: "1", title: 'test titlte' },
        category: { id: "1", name: "Test Category" },
      };

      const createdProduct: SoftwareProduct = {
        id: "1",
        ...productData,
        blogId: productData.blog?.id as  string,
        softwareProductCategoryId: productData.category?.id as string,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClient.softwareProduct.create as jest.Mock).mockResolvedValue(createdProduct);

      const result = await create(productData as CreateSoftwareProductDTO, prismaClient);

      expect(result).toEqual(createdProduct);
      expect(prismaClient.softwareProduct.create).toHaveBeenCalledWith({
        data: expect.objectContaining(productData),
      });
    });
  });

  describe("read", () => {
    it("should read a software product by ID", async () => {
      const productId = "1";

      const product = {
        id: productId,
        title: "Test Product",
        subTitle: "Test Subtitle",
        description: "Test Description",
        pricing: "Free",
        link: "http://example.com",
        githubLink: "http://github.com/example",
        status: "Released",
        softwareProductCategoryId: "1",
        images: [] as  Image[],
        blogId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClient.softwareProduct.findUnique as jest.Mock).mockResolvedValue(product);

      const result = await read(productId, prismaClient);

      expect(result).toEqual(product);
      expect(prismaClient.softwareProduct.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: {
          images: true,
          tags: true,
          category: true,
          blog: true,
          subscriptionModel: true,
        },
      });
    });
  });

  describe("update", () => {
    it("should update an existing software product", async () => {
      const productId = "1";

      const existingProduct: SoftwareProduct = {
        id: productId,
        title: "Old Product",
        subTitle: "Old Subtitle",
        description: "Old Description",
        pricing: "Free",
        link: "http://example.com",
        githubLink: "http://github.com/example",
        status: "Released",
        softwareProductCategoryId: "1",
        blogId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProductData = {
        title: "Updated Product",
        subTitle: "Updated Subtitle",
        description: "Updated Description",
        images: [],
        pricing: "Free" as  SoftwarePricing,
        link: "http://newexample.com",
        githubLink: "http://github.com/newexample",
        status: "Released" as SoftwareProductStatus,
        tags: [],
      };

      const updatedProduct: SoftwareProduct = {
        id: productId,
        ...updatedProductData,
        softwareProductCategoryId: "1",
        blogId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClient.softwareProduct.findUnique as jest.Mock).mockResolvedValue(existingProduct);
      (prismaClient.softwareProduct.update as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await update(productId, updatedProductData as CreateSoftwareProductDTO, prismaClient);

      expect(result).toEqual(updatedProduct);
      expect(prismaClient.softwareProduct.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: {
          tags: true,
          images: true,
          category: true,
          subscriptionModel: true
        },
      });
      expect(prismaClient.softwareProduct.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: expect.objectContaining(updatedProductData),
      });
    });

    it("should throw an error if the product does not exist", async () => {
      const productId = "1";

      (prismaClient.softwareProduct.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(update(productId, {} as CreateSoftwareProductDTO, prismaClient)).rejects.toThrow('Product not found');

      expect(prismaClient.softwareProduct.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
        include: {
          tags: true,
          images: true,
          category: true,
          subscriptionModel: true
        },
      });
    });
  });

  describe("remove", () => {
    it("should delete a software product by ID", async () => {
      const productId = "1";

      (prismaClient.softwareProduct.delete as jest.Mock).mockResolvedValue({});

      await remove(productId, prismaClient);

      expect(prismaClient.softwareProduct.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });

  describe("getAll", () => {
    it("should get all software products with pagination", async () => {
      const page = 1;
      const pageSize = 10;

      const products: SoftwareProduct[] = [
        {
          id: "1",
          title: "Product 1",
          subTitle: "Subtitle 1",
          description: "Description 1",
          pricing: "Free",
          link: "http://example.com",
          githubLink: "http://github.com/example",
          status: "Released",
          softwareProductCategoryId: "1",
          blogId: "1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prismaClient.softwareProduct.findMany as jest.Mock).mockResolvedValue(products);
      (prismaClient.softwareProduct.count as jest.Mock).mockResolvedValue(1);

      const result = await getAll(page, pageSize, prismaClient);

      expect(result.records).toEqual(products);
      expect(result.currentPage).toBe(page);
      expect(result.totalPages).toBe(1);
      expect(result.pageSize).toBe(pageSize);
      expect(prismaClient.softwareProduct.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      expect(prismaClient.softwareProduct.count).toHaveBeenCalled();
    });
  });
});
