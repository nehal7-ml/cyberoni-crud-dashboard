import { Blog, Image, Service, ServiceDescription, SubService, Tag, User } from "@prisma/client";
import { CreateTagDTO } from "./tags";
import { CreateSubServiceDTO } from "./subService";


export type CreateBlogDTO = {
    title: string;
    subTitle: string;
    description: string;
    featured: boolean;
    date: Date;
    content: string;
    templateId?: string;
    author: { id?: string; email: string; };
    images: CreateImageDTO[];
    tags: CreateTagDTO[];
};

export type DisplayBlogDTO = Blog & { author: User; }; export type CreateImageDTO = {
    id?: string | undefined;
    name?: string | undefined | null;
    src: string;
};
export type CreateServiceDTO = {
    title: string;
    previewContent: string;
    featured: boolean;
    ServiceDescription: CreateServiceDescription[];
    hourlyRate: number;
    valueBrought: string[];
    skillsUsed: string[];
    htmlEmbed?: string;
    image?: CreateImageDTO;
    SubServices?: CreateSubServiceDTO[];
    tags?: CreateTagDTO[];
    faqs?: CreateFaqDTO[];
};

export type CreateServiceDescription = {
    id?: string;
    title: string;
    content: string;
    imageOnLeft: boolean;
    image: CreateImageDTO;

};
export type CreateFaqDTO = {
    question: string;
    answer: string;
};

export type DisplayServiceDTO = Service & {
    image?: Image;
    tags?: Tag[];
    SubServices?: SubService[];
    ServiceDescription?: (ServiceDescription & { image: Image; })[];

};

