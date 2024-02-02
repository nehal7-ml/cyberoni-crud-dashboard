import 'server-only';
import { Image, PrismaClient } from "@prisma/client";
import { CreateImageDTO } from "./DTOs";
import { connectOrCreateObject, createImageJson } from "./images";
import { CreateCaseStudy } from "./DTOs";
export type CaseStudyType = 'ECOMMERCE' | 'LANDING' | 'SOFTWARE' | 'GRAPHICS';
export type UserPersona = {
    bio: string;
    name: string;
    gender: string;
    age: number;
    goals: string[];
    painPoints: string[];
    image?: CreateImageDTO;
}
export async function create(caseStudy: CreateCaseStudy, prisma: PrismaClient) {
    const cases = prisma.caseStudy;
    let images = await connectOrCreateObject(caseStudy.images, []);
    let competetiveAnalysis = await connectOrCreateObject(caseStudy.competetiveAnalysis, []);
    let wireFrames = await connectOrCreateObject(caseStudy.wireFrames!, []);
    let hifiDesign = await connectOrCreateObject(caseStudy.hifiDesign!, []);
    let userFlow = await connectOrCreateObject(caseStudy.userFlow!, []);
    let architecture = await connectOrCreateObject(caseStudy.architecture!, []);



    const newCase = await cases.create({
        data: {
            title: caseStudy.title,
            goals: caseStudy.goals,
            preview: caseStudy.preview,
            userResearch: caseStudy.userResearch,
            keyLearning: caseStudy.keyLearning,
            possibleSolutions: caseStudy.possibleSolutions,
            problemStatement: caseStudy.problemStatement,
            uniqueFeatures: caseStudy.uniqueFeatures,
            userPersonas: caseStudy.userPersonas,
            userProblems: caseStudy.userProblems,
            architecture: createImageJson(architecture),
            hifiDesign: createImageJson(hifiDesign),
            images: createImageJson(images),
            userFlow: createImageJson(userFlow),
            wireFrames: createImageJson(wireFrames),
            competetiveAnalysis: createImageJson(competetiveAnalysis),
            type: caseStudy.serviceId ? { connect: { id: caseStudy.serviceId } } : {},
            subServices: caseStudy.subServices ? { connect: caseStudy.subServices } : {}
        }
    })

}

export async function read(caseStudyId: string, prisma: PrismaClient) {
    const cases = prisma.caseStudy;
    const caseStudy = await cases.findUnique({
        where: { id: caseStudyId },
        include: { subServices: { select: { id: true } } }
    })
    return caseStudy as unknown as CreateCaseStudy


}

export async function update(caseStudyId: string, caseStudy: CreateCaseStudy, prisma: PrismaClient) {
    const cases = prisma.caseStudy;
    const oldCase = await cases.findUnique({ where: { id: caseStudyId } });
    let images = await connectOrCreateObject(caseStudy.images, oldCase?.images as Image[]);
    let competetiveAnalysis = await connectOrCreateObject(caseStudy.competetiveAnalysis, oldCase?.images as Image[]);
    let wireFrames = await connectOrCreateObject(caseStudy.wireFrames!, oldCase?.wireFrames as Image[]);
    let hifiDesign = await connectOrCreateObject(caseStudy.hifiDesign!, oldCase?.hifiDesign as Image[]);
    let userFlow = await connectOrCreateObject(caseStudy.userFlow!, oldCase?.userFlow as Image[]);
    let architecture = await connectOrCreateObject(caseStudy.architecture!, oldCase?.architecture as Image[]);


    const updatedCaseStudy = await cases.update({
        where: { id: caseStudyId }, data: {
            title: caseStudy.title,
            goals: caseStudy.goals,
            preview: caseStudy.preview,
            userResearch: caseStudy.userResearch,
            keyLearning: caseStudy.keyLearning,
            possibleSolutions: caseStudy.possibleSolutions,
            competetiveAnalysis: createImageJson(competetiveAnalysis),
            problemStatement: caseStudy.problemStatement,
            uniqueFeatures: caseStudy.uniqueFeatures,
            userPersonas: caseStudy.userPersonas,
            userProblems: caseStudy.userProblems,
            architecture: createImageJson(architecture),
            hifiDesign: createImageJson(hifiDesign),
            images: createImageJson(images),
            userFlow: createImageJson(userFlow),
            wireFrames: createImageJson(wireFrames),
            type: caseStudy.serviceId ? { connect: { id: caseStudy.serviceId } } : {},
            subServices: caseStudy.subServices ? { connect: caseStudy.subServices } : {}
        }
    })
    return updatedCaseStudy

}

export async function remove(caseStudyId: string, prisma: PrismaClient) {
    const cases = prisma.caseStudy;
    const updatedCaseStudy = await cases.delete({ where: { id: caseStudyId } })
    return updatedCaseStudy

}

export async function getAll(page: number, pageSize: number, prismaClient: PrismaClient) {
    const caseStudys = prismaClient.caseStudy;
    if (pageSize !== 10 && pageSize != 30 && pageSize !== 50) throw new Error('page size must be 10, 30 or 50')

    let allrecords = await caseStudys.findMany({
        skip: (page - 1) * pageSize, take: pageSize,
        where: {
        },
        include: {
            subServices: true,
            type: true

        }

    })

    const totalCount = await caseStudys.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return { records: allrecords, currentPage: page, totalPages, pageSize }

}


export async function getGroup(group: string, prismaClient: PrismaClient) {
    const caseStudys = prismaClient.caseStudy;

    let allrecords = await caseStudys.findMany({
        take: 16,
        where: {
            type: {
                id: group
            }
        },

    })



    return allrecords
}
