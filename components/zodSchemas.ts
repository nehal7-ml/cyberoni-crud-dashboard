import { PricingModel } from "@prisma/client";
import { z } from "zod";

const TagSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

const ImageSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  src: z.string(),
});

const SubServiceSchema = z.object({
  title: z.string(),
  pricingModel: z.nativeEnum(PricingModel),
  serviceDeliverables: z.array(z.string()),
  serviceUsageScore: z.number(),
  description: z.string(),
  department: z.string(),
  estimated_hours_times_fifty_percent: z.number(),
  estimated_hours_times_one_hundred_percent: z.number(),
  overheadCost: z.number(),
  complexity: z.number(),
  skillLevel: z.string(),
  image: ImageSchema.optional().nullable(),
  tags: z.array(TagSchema),
});

const BlogSchema = z.object({
  title: z.string(),
  subTitle: z.string(),
  description: z.string(),
  featured: z.boolean(),
  date: z.coerce.date(),
  publishDate: z.coerce.date(),
  content: z.string(),
  author: z.object({
    email: z.string().email(),
  }),
  images: z.array(ImageSchema),
  tags: z.array(TagSchema),
});

const ServiceSchema = z.object({
  title: z.string(),
  previewContent: z.string(),
  ServiceDescription: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string(),
      content: z.string(),
      imageOnLeft: z.boolean(),
      image: ImageSchema,
    }),
  ),
  hourlyRate: z.number(),
  valueBrought: z.array(z.string()),
  skillsUsed: z.array(z.string()),
  htmlEmbed: z.string().optional(),
  image: ImageSchema.optional().nullable(),
  SubServices: z.array(SubServiceSchema),
  tags: z.array(TagSchema),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ).optional(),
});

const sysCommandsSchema = z.record(
  z.object({
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    context: z.string(),
    example: z.string(),
  }),
);

const GptStepsSchema = z.array(
  z.object({
    index: z.number(),
    command: z.string(),
    callTo: z.union([z.literal("@LLM"), z.number()]),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    context: z.string(),
    goal: z.string(),
  }),
);

const GptVariablesSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
  }),
);

const GptConversationStartersSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
  }),
);

const GptPromptSchema = z.object({
  id: z.string().optional(),
  description: z.string(),
  title: z.string(),
  prompt: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  temperature: z.number(),
  max_tokens: z.number(),
  top_p: z.number(),
  best_of: z.number(),
  frequency_penalty: z.number(),
  presence_penalty: z.number(),
  stop: z.array(z.string()).optional(),
  timesUsed: z.number(),
  timesIntegrated: z.number(),
  costPerToken: z.number(),
  profitMargin: z.number(),
  tags: z.array(TagSchema),
  image: ImageSchema.nullable().optional(),
  botUrl: z.string().optional(),
  conversationStarters: GptConversationStartersSchema,
  seed: z.number(),
  startPhrase: z.string(),
  sysCommands: sysCommandsSchema,
  steps: GptStepsSchema,
  stream: z.boolean(),
  toolChoice: z.string(),
  tools: z.record(z.any()).optional(),
  variables: GptVariablesSchema,
});

const UserPersonaSchema = z.object({
  bio: z.string(),
  name: z.string(),
  gender: z.string(),
  age: z.number(),
  goals: z.array(z.string()),
  painPoints: z.array(z.string()),
  image: ImageSchema.optional(),
});

const CaseStudySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  preview: z.string().min(1),
  problemStatement: z.string().min(1),
  userProblems: z.array(z.string().min(1)),
  possibleSolutions: z.array(z.string().min(1)),
  goals: z.array(z.string().min(1)),
  images: z.array(ImageSchema).optional(),
  uniqueFeatures: z.string(),
  userResearch: z.string(),
  keyLearning: z.string(),
  userPersonas: z.array(UserPersonaSchema).optional(),
  competitiveAnalysis: z.array(ImageSchema).optional(),
  wireFrames: z.array(ImageSchema).optional(),
  hifiDesign: z.array(ImageSchema).optional(),
  userFlow: z.array(ImageSchema).optional(),
  architecture: z.array(ImageSchema).optional(),
});

const SoftwareProductSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  subTitle: z.string(),
  description: z.string().nullable().optional(),
  images: z.array(ImageSchema),
  tags: z.array(TagSchema),
  pricing: z.enum(["Freemium", "Free", "Paid", "Subscription"]),
  link: z.string().nullable().optional(),
  githubLink: z.string().nullable().optional(),
  blogLink: z
    .string()
    .regex(
      /https?:\/\/.*[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "not valid cybershoptech blog link",
    )
    .optional(),
  status: z.enum(["Released", "Beta", "Alpha","ComingSoon", "Planned"]),
});

export {
  TagSchema,
  ImageSchema,
  SubServiceSchema,
  BlogSchema,
  ServiceSchema,
  sysCommandsSchema,
  GptStepsSchema,
  GptVariablesSchema,
  GptConversationStartersSchema,
  GptPromptSchema,
  UserPersonaSchema,
  CaseStudySchema,
  SoftwareProductSchema,
};
