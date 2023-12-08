/**
 * @jest-environment node
 */
import { CreateReferralDTO, create, read, remove, update } from "@/crud/referral";
import { prisma } from "@/prisma/prismaClient";
import { describe, expect, it, afterAll } from "@jest/globals";
import { Referral } from "@prisma/client";


describe("test crud function for referrals", () => {

    const testreferral: CreateReferralDTO = {
        campaignId: "tetsca",
        click:0,
        description:'Test linbk',
        expires: new Date(),
        fallback: '/',
        link:'',
        prefix: 'testprefix',
        priority: 'LOW',
        redirect:'/referral/testprefix',
        type:'REDIRECT'

    }

    let createdreferral: Referral

    it("adds a referral to the database", async () => {
        createdreferral = await create(testreferral, prisma);
        expect(createdreferral.prefix).toBe(testreferral.prefix);



    }, 10000)
    it("udpates a referral to the database", async () => {
        const updatedreferral = await update(createdreferral.id, {
            ...testreferral,
                prefix: 'UpdatedPrefix'            
        }, prisma);
        expect(updatedreferral.prefix).toBe('UpdatedPrefix');


    }, 10000)

    it("reads a referral from the database", async () => {
        const readreferral = await read(createdreferral.id, prisma);
        expect(readreferral?.prefix).toBe('UpdatedPrefix');
    })

    // it("deletes a referral from the database", async () => {
    //     const 

    // })


    afterAll(async () => {
        await remove(createdreferral.id, prisma);

    })
})

