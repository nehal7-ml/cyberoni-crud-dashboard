import { z } from 'zod';

const TagSchema = z.object({
  name: z.string()
});

const ImageSchema = z.object({
  name: z.string().optional(),
  src: z.string()
});

const UserPersonaSchema = z.object({
  bio: z.string(),
  name: z.string(),
  gender: z.string(),
  age: z.number().or(z.string().regex(/^\d+$/)).optional(),
  goals: z.array(z.string()),
  painPoints: z.array(z.string()),
  image: ImageSchema.optional()
});

const CaseStudySchema = z.object({
  title: z.string().min(1),
  preview: z.string().min(1),
  problemStatement: z.string().min(1),
  userProblems: z.array(z.string().min(1)),
  possibleSolutions: z.array(z.string().min(1)),
  goals: z.array(z.string().min(1)),
  images: z.array(ImageSchema).optional(),
  uniqueFeatures: z.string().optional(),
  userResearch: z.string().optional(),
  keyLearning: z.string().optional(),
  userPersonas: z.array(UserPersonaSchema).optional(),
  competitiveAnalysis: z.array(ImageSchema).optional(),
  wireFrames: z.array(ImageSchema).optional(),
  hifiDesign: z.array(ImageSchema).optional(),
  userFlow: z.array(ImageSchema).optional(),
  architecture: z.array(ImageSchema).optional()
});

export { TagSchema, ImageSchema, UserPersonaSchema, CaseStudySchema };
