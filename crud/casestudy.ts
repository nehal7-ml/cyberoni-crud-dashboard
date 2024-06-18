import "server-only";
import { Image, PrismaClient } from "@prisma/client";
import { CreateImageDTO } from "./DTOs";
import { connectOrCreateObject, createImageJson } from "./images";
import { CreateCaseStudyDTO } from "./DTOs";
export type CaseStudyType = "ECOMMERCE" | "LANDING" | "SOFTWARE" | "GRAPHICS";

export async function create(caseStudy: CreateCaseStudyDTO, prisma: PrismaClient) {
  const cases = prisma.caseStudy;
  let images = await connectOrCreateObject(caseStudy.images, []);
  let competetiveAnalysis = await connectOrCreateObject(
    caseStudy.competitiveAnalysis,
    [],
  );
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
      competitiveAnalysis: createImageJson(competetiveAnalysis),
      type: caseStudy.serviceId ? { connect: { id: caseStudy.serviceId } } : {},
      subServices: caseStudy.subServices
        ? { connect: caseStudy.subServices }
        : {},
    },
  });

  return newCase;
}

export async function read(caseStudyId: string, prisma: PrismaClient) {
  const cases = prisma.caseStudy;
  const caseStudy = await cases.findUnique({
    where: { id: caseStudyId },
    include: { subServices: { select: { id: true } } },
  });
  return {
    ...caseStudy,
    competitiveAnalysis: caseStudy?.competitiveAnalysis as CreateImageDTO[],
    architecture: caseStudy?.architecture as CreateImageDTO[],
    images: caseStudy?.images as CreateImageDTO[],
    hifiDesign: caseStudy?.hifiDesign as CreateImageDTO[],
    userFlow: caseStudy?.userFlow as CreateImageDTO[],
    wireFrames: caseStudy?.wireFrames as CreateImageDTO[],
  } as CreateCaseStudyDTO;
}

export async function update(
  caseStudyId: string,
  caseStudy: CreateCaseStudyDTO,
  prisma: PrismaClient,
) {
  const cases = prisma.caseStudy;
  const oldCase = await cases.findUnique({ where: { id: caseStudyId } });
  let images = await connectOrCreateObject(
    caseStudy.images,
    oldCase?.images as unknown as Image[],
  );
  let competitiveAnalysis = await connectOrCreateObject(
    caseStudy.competitiveAnalysis,
    oldCase?.images as unknown as Image[],
  );
  let wireFrames = await connectOrCreateObject(
    caseStudy.wireFrames!,
    oldCase?.wireFrames as unknown as Image[],
  );
  let hifiDesign = await connectOrCreateObject(
    caseStudy.hifiDesign!,
    oldCase?.hifiDesign as unknown as Image[],
  );
  let userFlow = await connectOrCreateObject(
    caseStudy.userFlow!,
    oldCase?.userFlow as unknown as Image[],
  );
  let architecture = await connectOrCreateObject(
    caseStudy.architecture!,
    oldCase?.architecture as unknown as Image[],
  );

  const updatedCaseStudy = await cases.update({
    where: { id: caseStudyId },
    data: {
      title: caseStudy.title,
      goals: caseStudy.goals,
      preview: caseStudy.preview,
      userResearch: caseStudy.userResearch,
      keyLearning: caseStudy.keyLearning,
      possibleSolutions: caseStudy.possibleSolutions,
      competitiveAnalysis: createImageJson(competitiveAnalysis),
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
      subServices: caseStudy.subServices ? { set: caseStudy.subServices } : {},
    },
  });
  return updatedCaseStudy;
}

export async function remove(caseStudyId: string, prisma: PrismaClient) {
  const cases = prisma.caseStudy;
  const updatedCaseStudy = await cases.delete({ where: { id: caseStudyId } });
  return updatedCaseStudy;
}

export async function getAll(
  page: number,
  pageSize: number,
  prismaClient: PrismaClient,
  options?: {
    order: 'asc' | 'desc';
    orderby: 'updatedAt' | 'title';
  }
) {
  const caseStudys = prismaClient.caseStudy;
  if (pageSize !== 10 && pageSize != 30 && pageSize !== 50)
    throw new Error("page size must be 10, 30 or 50");

  let allrecords = await caseStudys.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {},
    include: {
      subServices: true,
      type: true,
    },
    orderBy: options?.orderby ? { [options.orderby]: options.order } : { createdAt: "desc" },
  });

  const totalCount = await caseStudys.count();
  const totalPages = Math.ceil(totalCount / pageSize);

  return { records: allrecords, currentPage: page, totalPages, pageSize };
}

export async function getGroup(group: string, prismaClient: PrismaClient) {
  const caseStudys = prismaClient.caseStudy;

  let allrecords = await caseStudys.findMany({
    take: 16,
    where: {
      type: {
        id: group,
      },
    },
  });

  return allrecords;
}
