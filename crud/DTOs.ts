import {
  Blog,
  EventStatus,
  GptPrompt,
  Image,
  PricingModel,
  ProductStatus,
  ReferralPriority,
  ReferralType,
  Review,
  Service,
  ServiceCart,
  ServiceCartItem,
  ServiceDescription,
  SoftwarePricing,
  SoftwareProductStatus,
  SubService,
  SubscriptionPeriod,
  SubscriptionStatus,
  Supplier,
  Tag,
  User,
} from "@prisma/client";

export type CreateBlogDTO = {
  title: string;
  subTitle: string;
  description: string;
  featured: boolean;
  date: Date;
  publishDate: Date;
  content: string;
  templateId?: string;
  author: { id?: string; email: string };
  images: CreateImageDTO[];
  tags: CreateTagDTO[];
  category?: BlogCategory

};

export type BlogCategory = {
  id?: string
  name: string;
  children?: BlogCategory[],
  parentId?: string | null
  parent?: {
    id: string;
  } | null;
}
export type CreateCategory = {
  id?: string;
  name: string;
  children: { name: string, id?: string }[]
}
export type DisplayBlogDTO = Blog & { author: User, tags: Tag[], images: Image[] };
export type CreateImageDTO = {
  id?: string | undefined;
  name?: string | undefined | null;
  src: string;
};
export type CreateServiceDTO = {
  title: string;
  previewContent: string;
  featured: boolean;
  ServiceDescription: CreateServiceDescription[]
  hourlyRate: number;
  valueBrought: string[];
  skillsUsed: string[];
  htmlEmbed?: string;
  image?: CreateImageDTO;
  SubServices?: CreateSubServiceDTO[]
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
  id?: string;
  question: string;
  answer: string;
};

export type DisplayServiceDTO = Service & {
  image?: Image | null;
  tags?: Tag[];
  SubServices?: SubService[];
  ServiceDescription?: (ServiceDescription & { image: Image | null })[];
};
export type CreateSubServiceDTO = {
  id?: string;
  title: string;
  pricingModel: PricingModel;
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
  value: number;
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
  category?: GptCategory;
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
  image: CreateImageDTO[];
  botUrl?: string;
  conversationStarters: GptConvoStarters[] | [],
  seed: number,
  startPhrase: string
  sysCommands: GptSysCommands | {}
  steps: GptSteps[] | [],
  stream: boolean
  toolChoice: string,
  tools: {}
  variables: {
    title: string,
    description: string
  }[]

};
export type GptCategory = {
  id?: string
  name: string;
  children?: GptCategory[],
  parent?: {
    id: string;
  } | null;
  parentId?: string | null
}
export type GptSteps = {
  index: number,
  command: string,
  callTo: "@LLM" | number
  priority: 'HIGH' | 'MEDIUM' | 'LOW',
  context: string
  goal: string,
}

export type GptConvoStarters = {
  title: string;
  description: string
}

export type GptSysCommands = {
  [x: string]: {
    priority: 'HIGH' | 'MEDIUM' | 'LOW',
    context: string,
    example: string
  }
}
export type DisplayPrompt = GptPrompt & {
  stop: string[];
  reviews?: Review[];
  image?: Image;
  tags: Tag[];
  tools: {}
};

export type CreateOrderDTO = {
  productId: string;
  userEmail: string;
  address: CreateAddressDTO | string;
};
export type ProductCartItemDTO = {
  quantity: number;
  productId: string;
  sessionId: string;
  userId: string;
};

export type DisplayServiceCartDTO = ServiceCart & {
  items: DisplayServiceCartItemDTO[];
};
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
  service?: (Service & {}) | null;
  addons: SubService[];
};
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
  utmProps:
  | {
    utm_medium: string;
    utm_campaign: string;
    utm_source: string;
    utm_segment: string;
    utm_product_category: string;
    utm_communication_theme: string;
    utm_ad_type: string;
    utm_funnel_location: string;
    utm_earned_or_paid: "earned" | "paid";
  }
  | {};
};
export type CreateCaseStudyDTO = {
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
  competitiveAnalysis: CreateImageDTO[];
  wireFrames?: CreateImageDTO[];
  hifiDesign?: CreateImageDTO[];
  userFlow?: CreateImageDTO[];
  architecture?: CreateImageDTO[];
};

export type UserPersona = {
  bio: string;
  name: string;
  gender: string;
  age: number;
  goals: string[];
  painPoints: string[];
  image?: CreateImageDTO;
};
export type CreateDiscountDTO = {
  id?: string;
  name: string;
  value: number;
  expires?: Date | null;
};


export type CreateProductDTO = {
  sku: string;
  name: string;
  status: ProductStatus;
  ratings?: number | null;
  inventory: number;
  productBreakdown?: string | null;
  shippingReturnPolicy: string;
  description: string;
  price: number;
  profitMargin: number;
  displayPrice: number;
  category?: ProductCategory;
  subcategory?: string;
  tags: CreateTagDTO[];
  images: CreateImageDTO[];
  suppliers?: CreateSupplierDTO[] | Supplier[];
  amazonProductId?: string;
  aliExpressId?: string;
};

export type DisplayProductDTO = {
  id: string;
  sku: string;
  name: string;
  status: string;
  ratings: number | null;
  inventory: number;
  productBreakdown: string | null;
  shippingReturnPolicy: string;
  description: string;
  price: number;
  profitMargin: number;
  displayPrice: number;
  category?: ProductCategory;
  subcategory: string | null;
  amazonProductId?: string;
  cjDropShippingId?: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  children?: ProductCategory[];
  parent?: ProductCategory | null;
  parentId?: string | null;

}
export type CreateSupplierDTO = {
  baseShippingPrice: number;
  height: number;
  width: number;
  length: number;
  weight: number;
  supplierName: string;
  supplierStatus?: string;
  shippingWeight?: number;
  listPrice?: number;
  salePrice?: number;
  availability?: string;
  supplierWrittenComments?: string;
  supplierUrl: string;
  supplierEmail?: string;
  supplierWhatsApp?: string;
};

export type CreateEventDTO = {
  name: string;
  date: Date;
  location: string;
  description: string;
  image: CreateImageDTO[];
  tags: CreateTagDTO[];
  eventLink: string;
  status: EventStatus;
  isVirtual: boolean;
};


export type CreateSoftwareProductDTO = {
  id?: string;
  title: string;
  subTitle: string;
  description?: string;
  images: CreateImageDTO[];
  tags: CreateTagDTO[];
  pricing: 'Free' | 'Freemium' | 'Paid';
  link?: string;
  githubLink?: string;
  blog?: { id: string, title: string };
  status: SoftwareProductStatus;
  category?: SoftwareProductCategory
  subscriptionModel?: SubscriptionModel[]

} | {
  id?: string;
  title: string;
  subTitle: string;
  description?: string;
  images: CreateImageDTO[];
  tags: CreateTagDTO[];
  pricing: 'Subscription';
  link?: string;
  githubLink?: string;
  blog?: { id: string, title: string };
  status: SoftwareProductStatus;
  category?: SoftwareProductCategory
  subscriptionModel: SubscriptionModel[]



};

export type SubscriptionModel = {
  id?: string | null;
  name: string;
  price: number;
  features: {
    title: string;
    subTitle: string;

  },
  status: SubscriptionStatus
  type: SubscriptionPeriod
  credits: number | 0
  profit: number | 0
}

export type SoftwareProductCategory = {
  id: string;
  name: string;
  children?: SoftwareProductCategory[];
  parent?: SoftwareProductCategory | null;
  parentId?: string | null;
}

export type DisplaySoftwareProductDTO = {
  id: string;
  title: string;
  subTitle: string;
  description?: string;
  images: CreateImageDTO[];
  tags: CreateTagDTO[];
  pricing: SoftwarePricing;
  link?: string;
  githubLink?: string;
  status: SoftwareProductStatus;
  category?: SoftwareProductCategory
  blog?: { id: string }
}