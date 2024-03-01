/**
 * @jest-environment node
 *
 */
import { create, remove, update } from "@/crud/casestudy";
import {
  describe,
  expect,
  it,
  afterAll,
  beforeAll,
  afterEach,
  jest,
} from "@jest/globals";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { CreateCaseStudy, DisplayServiceDTO } from "@/crud/DTOs";
import { DefaultArgs, JsonValue } from "@prisma/client/runtime/library";
import { MockContext, Context, createMockContext } from "./context";
import { prisma } from "@/lib/prisma";
import { Prisma, $Enums } from "@prisma/client";
let mockCtx: MockContext;
let ctx: Context;

describe("Case Study Functions", () => {
  let service: DisplayServiceDTO | null;
  const caseStudy: CreateCaseStudy = {
    title: "Test Case Study",
    subServices: [],
    preview: "",
    problemStatement: "",
    userProblems: [],
    possibleSolutions: [],
    goals: [],
    images: [],
    uniqueFeatures: "",
    userResearch: "",
    keyLearning: "",
    userPersonas: [],
    competetiveAnalysis: [],
    wireFrames: [],
    architecture: [],
    hifiDesign: [],
    userFlow: [],
  };
  beforeAll(async () => {
    service = await prisma.service.findFirst({
      where: {
        SubServices: {
          some: {},
        },
      },
      take: 1,
      include: { SubServices: true, image: true },
    });

    if (!service) {
      service = await prisma.service.create({
        data: {
          title: "test service- jest",
          hourlyRate: 100,
          previewContent: "test preview",
          skillsUsed: [],
          valueBrought: [],
          SubServices: {
            create: {
              description: "test description",
              complexity: 10,
              department: "test",
              title: "test sub service title",
              estimated_hours_times_fifty_percent: 20,
              estimated_hours_times_one_hundred_percent: 40,
              overheadCost: 1000,
              serviceUsageScore: 10,
              skillLevel: "hishghe",
            },
          },
        },
        include: { SubServices: true, image: true },
      });
    }
  }, 10000);

  describe("create", () => {
    it("should create a case study", async () => {
      // Mock data

      // Call the function
      const createdCaseStudy = await create(caseStudy, prisma);
      caseStudy.id = createdCaseStudy.id;
      // Assertions
      expect(createdCaseStudy.title).toEqual(caseStudy.title);
    });

    it("should connect service to  case study", async () => {
      // Call the function
      const createdCaseStudy = await update(
        caseStudy.id as string,
        {
          ...caseStudy,
          serviceId: service?.id,
        },
        prisma,
      );
      // Assertions
      expect(createdCaseStudy.title).toEqual(caseStudy.title);
    });

    it("should connect SubService to  case study", async () => {
      // Mock data
      // Call the function
      if (service?.SubServices && service?.SubServices[0]) {
        const createdCaseStudy = await update(
          caseStudy.id as string,
          {
            ...caseStudy,
            subServices: [{ id: (service?.SubServices)[0].id }],
          },
          prisma,
        );
        // Assertions
        expect(createdCaseStudy.title).toEqual(caseStudy.title);
      }
    });
    it("should Delete case study ", async () => {
      // Mock data
      // Call the function
      const deleted = await remove(caseStudy.id as string, prisma);
      expect(deleted.title).toEqual(caseStudy.title);
    });
  });

  // Write test cases for other functions (read, update, remove, getAll, getGroup) similarly
});
