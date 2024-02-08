import { Blog, GptPrompt, Image, PricingModel, ReferralPriority, ReferralType, Review, Service, ServiceCart, ServiceCartItem, ServiceDescription, SubService, Tag, User } from "@prisma/client";
import { UserPersona } from "./casestudy";

export type CreateBlogDTO = {
    title: string;
    subTitle: string;
    description: string;
    featured: boolean;
    date: Date;
    publishDate: Date;
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
export type CreateGptPromptDTO = {
    id?: string;
    description: string;
    title: string;
    prompt: string | null;
    model: string | null;
    temperature: number;
    max_tokens: number;
    top_p: number;
    best_of: number;
    frequency_penalty: number;
    presence_penalty: number;
    stop: string[]; // comma separaetd sequences
    timesUsed: number;
    timesIntegrated: number;
    costPerToken: number;
    profitMargin: number;
    tags: CreateTagDTO[];
    image?: CreateImageDTO | null;
    botUrl?: string;

};
export type DisplayPrompt = GptPrompt & {
    stop: string[];
    reviews?: Review[];
    image?: Image;
    tags: Tag[];
};

export type CreateOrderDTO = {

    productId: string;
    userEmail: string;
    address: CreateAddressDTO | string
}
export type ProductCartItemDTO = {
    quantity: number;
    productId: string;
    sessionId: string;
    userId: string;
};

export type DisplayServiceCartDTO = ServiceCart & {
    items: DisplayServiceCartItemDTO[]
}
export type CreateServicePaymentDTO = {
    paymentId: string;
    cartId: string;
};
export type CreateServiceCartItemDTO = {
    userId: string;
    serviceId: string;
    description: string | null;
    addons: {
        id: string;

    }[];


};

export type UpdateServiceCartItemDTO = {
    cartItemId: string;
    userId: string | null;
    description: string | null;
    addons: {
        id: string;

    }[];


};
export type RemoveServiceCartItem = {
    cartItemId: string;
};

export type DisplayServiceCartItemDTO = ServiceCartItem & {
    service?: Service & {
    } | null,
    addons: SubService[]
}
export type CreateReferralDTO = {
    prefix: string | null;
    type: ReferralType;
    campaignId: string;
    expires: Date | null;
    description: string;
    priority: ReferralPriority;
    link: string;
    fallback: string;
    redirect: string;
    click: number;
    utmProps: {
        utm_medium: string;
        utm_campaign: string;
        utm_source: string;
        utm_segment: string;
        utm_product_category: string;
        utm_communication_theme: string
        utm_ad_type: string;
        utm_funnel_location: string;
        utm_earned_or_paid: "earned" | "paid"
    } | {};
};
export type CreateCaseStudy = {
    id?: string;
    title: string;
    serviceId?: string;
    subServices: { id: string }[];
    preview: string;
    problemStatement: string;
    userProblems: string[]; //comma seaprated
    possibleSolutions: string[]; //comma seaprated
    goals: string[]; //comma seaprated
    images: CreateImageDTO[];
    uniqueFeatures: string;
    userResearch: string;
    keyLearning: string;
    userPersonas: UserPersona[];
    competetiveAnalysis: CreateImageDTO[];
    wireFrames?: CreateImageDTO[];
    hifiDesign?: CreateImageDTO[];
    userFlow?: CreateImageDTO[];
    architecture?: CreateImageDTO[];
};

