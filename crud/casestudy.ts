import { Image, PrismaClient } from "@prisma/client";
import { CreateImageDTO } from "./images";
export type CreateCaseStudy = {
    title: string;
    preview: string;
    problemStatement: string;
    userProblems: string; //comma seaprated
    possibleSolutions: string;  //comma seaprated
    goals: string; //comma seaprated
    image1: CreateImageDTO;
    image2: CreateImageDTO;
    uniqueFeatures: string;
    userResearch: string;
    keyLearning: string;

    userPersonas: UserPersona[],
    competetiveAnalysis: {

    }
}

export type UserPersona = {
    bio: string;
    name: string;
    gender: string;
    age: number;
    goals: string[];
    painPoints: string[];
    image: {
        src: string;
        name: string;
    };
}
export async function create(caseStudy: CreateCaseStudy, prisma: PrismaClient) {


}