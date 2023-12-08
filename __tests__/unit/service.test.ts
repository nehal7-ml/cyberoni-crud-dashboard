/**
 * @jest-environment node
 */
import { CreateServiceDTO, create, read, remove, update } from "@/crud/service";
import { prisma } from "@/prisma/prismaClient";
import { describe, expect, it, afterAll } from "@jest/globals";
import { Service, ServiceDescription, SubService } from "@prisma/client";


describe("test crud function for services", () => {

    const testService: CreateServiceDTO = {
        featured:false,
        hourlyRate: 100,
        previewContent: "test preview content",
        skillsUsed: ["Web","Design"],
        title: "Service Title",
        ServiceDescription: [{
            content: "test content",
            title: "test Section",
            imageOnLeft: true,
            image: {
                src: "https://picsum.photos/200",
                name: "test image",
            }
        }],

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
                discounts: [],
                estimated_hours_times_fifty_percent: 100,
                estimated_hours_times_one_hundred_percent: 200,
                overheadCost: 1000,
                pricingModel: 'DEFAULT',
                title: "Subservice-1",
                serviceDeliverables: [],
                serviceUsageScore: 10,
                skillLevel: "100",

            }
        ],
        tags: [{ name: 'test tag' }]

    }

    let createdService: Service & {
        SubServices: SubService[],
        ServiceDescription: ServiceDescription[],

    };

    it("adds a service to the database", async () => {
        createdService = await create(testService, prisma);
        expect(createdService.title).toBe(testService.title);
        expect(createdService.SubServices[0].title).toBe(testService.SubServices![0].title);
        expect(createdService.ServiceDescription[0].title).toBe(testService.ServiceDescription![0].title);


    }, 10000)
    it("udpates a service to the database", async () => {
        const updatedService = await update(createdService.id, {
            ...testService,
            title: "updated",
            
        }, prisma);
        expect(updatedService.title).toBe('updated');


    }, 10000)

    it("reads a service from the database", async () => {
        const readService = await read(createdService.id, prisma);
        expect(readService?.title).toBe('updated');
    })

    // it("deletes a service from the database", async () => {
    //     const 

    // })


    afterAll(async () => {
        await remove(createdService.id, prisma);

    })
})

