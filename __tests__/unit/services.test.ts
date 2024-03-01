/**
 * @jest-environment node
 */
import {
  CreateSubServiceDTO,
} from "@/crud/DTOs";
import { prisma } from "@/lib/prisma";
import { describe, expect, it, afterAll } from "@jest/globals";
import { updateSubServiceObject } from "@/crud/subService";


describe("Subservice-unit-test", () => {
  let oldSubservices: CreateSubServiceDTO[] = [
    {
      id: "test-1",
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
      id: "test-2",
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
  ];

  let newSubServices: CreateSubServiceDTO[] = [
    {
      id: "test-1",
      complexity: 10,
      department: "test deparment",
      description: "updated-description",
      estimated_hours_times_fifty_percent: 100,
      estimated_hours_times_one_hundred_percent: 200,
      overheadCost: 1000,
      pricingModel: "DEFAULT",
      title: "UPdatedTitle",
      serviceDeliverables: [],
      serviceUsageScore: 10,
      skillLevel: "100",
    },
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
  ];

  it("should correct gnerate object to update delete and create subServices", async () => {
    const update = await updateSubServiceObject(newSubServices, oldSubservices);
    expect(update.create.length).toBe(1);
    expect(update.delete.length).toBe(1);
    expect(update.update.length).toBe(1);
  });
});
