/**
 * @jest-environment node
 * 
 */
import { PrismaClient } from '@prisma/client';
import * as caseStudyFunctions from '@/crud/casestudy';
import { describe, expect, it, afterAll, beforeAll, afterEach, jest } from "@jest/globals";
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { CreateCaseStudy } from "@/crud/DTOs";
import { JsonValue } from "@prisma/client/runtime/library";
import { MockContext, Context, createMockContext } from './context'

let mockCtx: MockContext
let ctx: Context




describe('Case Study Functions', () => {
    let prismaMock: jest.Mocked<PrismaClient>;

    beforeEach(() => {
        mockCtx = createMockContext()
        prismaMock = mockCtx as unknown as Context
      })
      

    afterEach(() => {
        jest.clearAllMocks();
    });



    describe('create', () => {
        it('should create a case study', async () => {
            // Mock data
            const caseStudy: CreateCaseStudy = {
                title: "Test Case Study",
                subServices: [],
                preview: "",
                problemStatement: "",
                userProblems: [],
                possibleSolutions: [],
                goals: [],
                images: [{
                    id: "test-image-id",
                    src: "https://test.url"
                }],
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
            prismaMock.caseStudy.create.mockResolvedValueOnce({
                ...caseStudy,
                id: "test-id",
                competetiveAnalysis: [] as JsonValue,
                wireFrames: [] as JsonValue,
                architecture: [] as JsonValue,
                hifiDesign: [] as JsonValue,
                userFlow: [] as JsonValue,
                serviceId: "test-service-id"
            });

            // Call the function
            const createdCaseStudy = await caseStudyFunctions.create(caseStudy, prismaMock);

            // Assertions
            expect(createdCaseStudy.id).toEqual("test-id");
            expect(prismaMock.caseStudy.create).toHaveBeenCalledTimes(1);
        });
    });

    // Write test cases for other functions (read, update, remove, getAll, getGroup) similarly
});

