import { FormSchema } from "../DynamicInput";

export const userPersona: FormSchema = {
  type: "array",
  title: "User Personas",
  description: "User Personas Items",
  items: {
    type: "object",
    description: "User Persona",
    title: "User Persona",
    required: true,
    properties: {
      name: {
        required: true,
        type: "string",
        title: "Name",
      },
      age: {
        type: "number",
        title: "Age",
        required: true,
      },
      bio: {
        type: "string",
        title: "Bio",
        required: true,
      },
      image: {
        type: "image", // Updated to handle CreateImageDTO
        title: "Image",
        required: false, // Made optional based on DTO
        max: 1,
      },
      gender: {
        type: "string",
        title: "Gender",
        required: false,
      },
      goals: {
        type: "array",
        title: "Goals",
        description: "Describe your goals",
        items: {
          type: "string",
          title: "Goal",
          required: true,
        },
        required: true,
      },
      painPoints: {
        type: "array",
        title: "Pain Points",
        description: "Describe your pain points",
        items: {
          type: "string",
          title: "Pain Point",
          required: true,
        },
        required: false,
      },
    },
  },
  toString: (object: any) => {
    return object.name;
  },
  required: true,
};

const caseStudyFormSchema: FormSchema = {
  type: "object",
  title: "Case Study Form",
  description: "Schema for the case study form",
  required: true,
  properties: {
    title: { type: "string", title: "Title", required: true },
    preview: { type: "string", title: "Preview", required: true },
    images: {
      type: "image",
      title: "Images",
      required: true,
      max: 1,

    },
    problemStatement: {
      type: "object",
      title: "Problem Statement",
      description: "Problem Statement for the case study",
      required: true,
      properties: {
        title: { type: "string", title: "Title", required: true },
        statement: { type: "text", title: "Statement", required: true },
      },
    },
    primaryResearch: {
      type: "object",
      title: "Primary Research",
      description: "Primary Research for the case study",
      required: false,
      properties: {
        title: { type: "string", title: "Title", required: true },
        research: { type: "text", title: "Research", required: true },
      },
    },
    userProblems: {
      type: "object",
      title: "User Problems",
      description: "User Problems",
      required: true,
      properties: {'title': {
        'type': 'string',
        'title': 'Title',
        'required': true
      }, 
      'problems': {
        'type': 'text',
        'title': 'Problems',
        'required': true
      }
    
    
    },
      toString: (object) => object.join(", "),
    },
    possibleSolutions: {
      type: "object",
      title: "Possible Solutions",
      description: "Possible Solutions",
      required: true,
      properties: {
        title: { type: "string", title: "Title", required: true },
        solution: { type: "text", title: "Solution", required: true },
      },
    },
    goals: {
      type: "object",
      title: "Goals",
      description: "Goals",
      required: true,
      properties: {
        title: { type: "string", title: "Title", required: true },
        goals: { type: "text", title: "Goals", required: true },
      },
    },
   
    uniqueFeatures: {
      type: "object",
      title: "Unique Features",
      description: "Unique Features",
      required: true,
      properties: {
        title: { type: "string", title: "Title", required: true },
        features: {
          type: "array",
          description: "Features",
          title: "Features",
          required: true,
          items: { type: "string", title: "Feature", required: true },
        },
      },
    },
    results: {
      type: "object",
      title: "Results",
      description: "Results",
      required: false,
      properties: {
        title: { type: "string", title: "Title", required: true },
        description: { type: "text", title: "Description", required: true },
        image: {
          type: "image",
          title: "Image",
          required: true,

        },
      },
    },
    userResearch: {
      type: "object",
      title: "User Research",
      description: "User Research",
      required: true,
      properties: {
        title: { type: "string", title: "Title", required: true },
        research: { type: "text", title: "Research", required: true },
      },
    },
    keyLearning: {
      type: "object",
      title: "Key Learning",
      required: true,
      description: "Key Learning",
      properties: {
        title: { type: "string", title: "Title", required: true },
        learning: { type: "text", title: "Learning", required: true },
        image: {
          type: "image",
          title: "Image",
          max: 1,
          required: true,

        },
      },
    },
    competitorAnalysis: {
      type: "object",
      title: "Competitor Analysis",
      description: "Competitor Analysis",
      required: false,
      properties: {
        title: { type: "string", title: "Title", required: true },
        analysis: { type: "text", title: "Analysis", required: true },
      },
    },
    userPersonas: userPersona,

  },
  toString: (object) => object.title,
};

export { caseStudyFormSchema };
