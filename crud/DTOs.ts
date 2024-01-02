import { Blog, Image, PricingModel, Service, ServiceDescription, SubService, Tag, User } from "@prisma/client";

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
export type CreateSubServiceDTO = {
    id?: string;
    title: string;
    pricingModel: PricingModel;
    discounts: Discount[];
    serviceDeliverables: string[];
    serviceUsageScore: number;
    description: string;
    department: string;
    estimated_hours_times_fifty_percent: number;
    estimated_hours_times_one_hundred_percent: number;
    overheadCost: number;
    complexity: number;
    skillLevel: string;
    image?: CreateImageDTO;
    tags?: CreateTagDTO[];
};

export type Discount = {
    name: string;
    value: string;
};
export type CreateAddressDTO = {
    id?: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};
export type CreateTagDTO = {
    id?: string;
    name: string;
};

