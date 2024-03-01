/**
 * @jest-environment node
 */
import { create, read, remove, update } from "@/crud/service";
import {
  CreateImageDTO,
  CreateServiceDTO,
  CreateSubServiceDTO,
} from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";
import { describe, expect, it, afterAll } from "@jest/globals";
import { Service, ServiceDescription, SubService } from "@prisma/client";
import { updateSubServiceObject } from "@/crud/subService";


describe("test crud function for services", () => {
  const testService: CreateServiceDTO = {
    featured: false,
    hourlyRate: 100,
    previewContent: "test preview content",
    skillsUsed: ["Web", "Design"],
    title: "Service Title",
    ServiceDescription: [
      {
        content: "test content",
        title: "test Section",
        imageOnLeft: true,
        image: {
          src: "https://picsum.photos/200",
          name: "test image 2",
        },
      },
    ],

    valueBrought: ["test value"],
    image: {
      src: "https://picsum.photos/200",
      name: "test image",
    },
    SubServices: [
      {
        complexity: 10,
        department: "test deparment",
        description: "subservice description",
        estimated_hours_times_fifty_percent: 100,
        estimated_hours_times_one_hundred_percent: 200,
        overheadCost: 1000,
        pricingModel: "DEFAULT",
        title: "Subservice-1",
        serviceDeliverables: [],
        serviceUsageScore: 10,
        skillLevel: "100",
      },
    ],
    tags: [{ name: "test tag" }],
  };

  let createdService: Service & {
    SubServices: SubService[];
    ServiceDescription: ServiceDescription[];
    image: CreateImageDTO | null;
  };

  it("adds a service to the database", async () => {
    createdService = await create(testService, prisma);
    expect(createdService.title).toBe(testService.title);
    expect(createdService.SubServices[0].title).toBe(
      testService.SubServices![0].title,
    );
    expect(createdService.ServiceDescription[0].title).toBe(
      testService.ServiceDescription![0].title,
    );
  }, 10000);

  it("udpates a service to the database", async () => {
    const updatedService = await update(
      createdService.id,
      {
        ...testService,
        title: "updated",
        image: {
          src: "https://picsum.photos/200",
          name: "updated-image",
        },
        SubServices: [],
      },
      prisma,
    );
    expect(updatedService.title).toBe("updated");
    expect(updatedService.image?.name).toBe("updated-image");
    expect(updatedService.SubServices.length).toBe(0);
    createdService = updatedService;
  }, 10000);

  it("udpates a service using various adds subServices to the database", async () => {
    const updatedService = await update(
      createdService.id,
      {
        ...testService,
        SubServices: [
          {
            complexity: 10,
            department: "test deparment",
            description: "subservice description",
            estimated_hours_times_fifty_percent: 100,
            estimated_hours_times_one_hundred_percent: 200,
            overheadCost: 1000,
            pricingModel: "DEFAULT",
            title: "Subservice-1",
            serviceDeliverables: [],
            serviceUsageScore: 10,
            skillLevel: "100",
          },

          {
            complexity: 10,
            department: "test deparment",
            description: "subservice description-1",
            estimated_hours_times_fifty_percent: 100,
            estimated_hours_times_one_hundred_percent: 200,
            overheadCost: 1000,
            pricingModel: "DEFAULT",
            title: "Subservice-1",
            serviceDeliverables: [],
            serviceUsageScore: 10,
            skillLevel: "100",
          },
          {
            complexity: 10,
            department: "test deparment",
            description: "subservice description-2",
            estimated_hours_times_fifty_percent: 100,
            estimated_hours_times_one_hundred_percent: 200,
            overheadCost: 1000,
            pricingModel: "DEFAULT",
            title: "Subservice-1",
            serviceDeliverables: [],
            serviceUsageScore: 10,
            skillLevel: "100",
          },
        ],
      },
      prisma,
    );
    expect(updatedService.SubServices.length).toBe(3);
    expect(updatedService.SubServices[0].title).toBe("Subservice-1");
    createdService = updatedService;
  }, 10000);

  it("udpates a service using various subServices to the database", async () => {
    const updatedService = await update(
      createdService.id,
      {
        ...testService,
        SubServices: [
          {
           ... createdService.SubServices[0] as CreateSubServiceDTO,
            description: "subservice-description-updated",

          },
          {
            complexity: 10,
            department: "test deparment",
            description: "subservice-description-updated",
            estimated_hours_times_fifty_percent: 100,
            estimated_hours_times_one_hundred_percent: 200,
            overheadCost: 1000,
            pricingModel: "DEFAULT",
            title: "Subservice-1",
            serviceDeliverables: [],
            serviceUsageScore: 10,
            skillLevel: "100",
          },

          {
            complexity: 10,
            department: "test deparment",
            description: "subservice-description-updated",
            estimated_hours_times_fifty_percent: 100,
            estimated_hours_times_one_hundred_percent: 200,
            overheadCost: 1000,
            pricingModel: "DEFAULT",
            title: "Subservice-2",
            serviceDeliverables: [],
            serviceUsageScore: 10,
            skillLevel: "100",
          },
        ],
      },
      prisma,
    );
    expect(updatedService.SubServices.length).toBe(3);
    expect(updatedService.SubServices[0].description).toBe(
      "subservice-description-updated",
    );
  }, 10000);

  it("reads a service from the database", async () => {
    const readService = await read(createdService.id, prisma);
    expect(readService?.title).toBe(testService.title);
  });

  // it("deletes a service from the database", async () => {
  //     const

  // })

  afterAll(async () => {
    if (createdService.id) await remove(createdService.id, prisma);
  }, 10000);
});
