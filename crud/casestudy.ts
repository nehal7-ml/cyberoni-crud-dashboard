import 'server-only';
import { Image, PrismaClient } from "@prisma/client";
import { CreateImageDTO } from "./DTOs";
import { connectOrCreateObject } from "./images";
export type CaseStudyType = 'ECOMMERCE' | 'LANDING' | 'SOFTWARE' | 'GRAPHICS';
export type CreateCaseStudy = {
    id?: string;
    title: string;
    serviceId?: string;
    preview: string;
    problemStatement: string;
    userProblems: string[]; //comma seaprated
    possibleSolutions: string[];  //comma seaprated
    goals: string[]; //comma seaprated
    images: CreateImageDTO[];
    uniqueFeatures: string;
    userResearch: string;
    keyLearning: string;
    userPersonas: UserPersona[],
    competetiveAnalysis: CreateImageDTO[],
    wireFrames?: CreateImageDTO[];
    hifiDesign?: CreateImageDTO[];
    userFlow?: CreateImageDTO[];
    architecture?: CreateImageDTO[];
}

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
    const images = await connectOrCreateObject(caseStudy.images, []);
    const competetiveAnalysis = await connectOrCreateObject(caseStudy.competetiveAnalysis, []);
    const wireFrames = await connectOrCreateObject(caseStudy.wireFrames!, []);
    const hifiDesign = await connectOrCreateObject(caseStudy.hifiDesign!, []);
    const userFlow = await connectOrCreateObject(caseStudy.userFlow!, []);
    const architecture = await connectOrCreateObject(caseStudy.architecture!, []);
    const newCase = await cases.create({
        data: {
            title: caseStudy.title,
            goals: caseStudy.goals,
            preview: caseStudy.preview,
            userResearch: caseStudy.userResearch,
            keyLearning: caseStudy.keyLearning,
            possibleSolutions: caseStudy.possibleSolutions,
            competetiveAnalysis: competetiveAnalysis,
            problemStatement: caseStudy.problemStatement,
            uniqueFeatures: caseStudy.uniqueFeatures,
            userPersonas: caseStudy.userPersonas,
            userProblems: caseStudy.userProblems,
            architecture: architecture,
            hifiDesign: hifiDesign,
            images: images,
            userFlow: userFlow,
            wireFrames: wireFrames,
            type: caseStudy.serviceId ? { connect: { id: caseStudy.serviceId } } : {},
        }
    })

}

export async function read(caseStudyId: string, prisma: PrismaClient) {
    const cases = prisma.caseStudy;
    const caseStudy = await cases.findUnique({ where: { id: caseStudyId } })
    return caseStudy as CreateCaseStudy


}

export async function update(caseStudyId: string, caseStudy: CreateCaseStudy, prisma: PrismaClient) {
    const cases = prisma.caseStudy;
    const oldCase = await cases.findUnique({ where: { id: caseStudyId }});
    const images = await connectOrCreateObject(caseStudy.images, oldCase?.images as Image[]);
    const competetiveAnalysis = await connectOrCreateObject(caseStudy.competetiveAnalysis, oldCase?.images as Image[]);
    const wireFrames = await connectOrCreateObject(caseStudy.wireFrames!, oldCase?.wireFrames as Image[]);
    const hifiDesign = await connectOrCreateObject(caseStudy.hifiDesign!, oldCase?.hifiDesign as Image[]);
    const userFlow = await connectOrCreateObject(caseStudy.userFlow!, oldCase?.userFlow as Image[]);
    const architecture = await connectOrCreateObject(caseStudy.architecture!, oldCase?.architecture as Image[]);
    const updatedCaseStudy = await cases.update({
        where: { id: caseStudyId }, data: {
            title: caseStudy.title,
            goals: caseStudy.goals,
            preview: caseStudy.preview,
            userResearch: caseStudy.userResearch,
            keyLearning: caseStudy.keyLearning,
            possibleSolutions: caseStudy.possibleSolutions,
            competetiveAnalysis: competetiveAnalysis,
            problemStatement: caseStudy.problemStatement,
            uniqueFeatures: caseStudy.uniqueFeatures,
            userPersonas: caseStudy.userPersonas,
            userProblems: caseStudy.userProblems,
            architecture: architecture,
            hifiDesign: hifiDesign,
            images: images,
            userFlow: userFlow,
            wireFrames: wireFrames,
            type: caseStudy.serviceId ? { connect: { id: caseStudy.serviceId } } : {},

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
