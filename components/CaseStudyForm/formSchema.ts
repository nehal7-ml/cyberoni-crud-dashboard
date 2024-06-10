import { FormSchema } from "../DynamicInput";

export const userPersona:FormSchema ={
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
          type: 'number',
          title: "Age",
          required: false,
        },
        bio: {
          type: "string",
          title: "Bio",
          required: true,
        },
        image: {
          type: "image",
          title: "image",
          required: true,
        },
        gender: {
          type: "string",
          title: "gender",
          required: false,
        },
        goals: {
          type: "array",
          title: "goals",
          description: "Describe your goals",
          items: {
            type: "string",
            title: "goal",
            required: true,
          },
          required: false,
        },
        painPoints: {
          type: "array",
          title: "painPoints",
          description: "Describe your pain points",
          items: {
            type: "string",
            title: "painPoints",
            required: true,
          },
          required: false,
        },
      },

    },
    toString: (object: any) => {
      return object.name;
    },
    required: false,
  }



  const caseStudyFormSchema: FormSchema = {
    type: "object",
    title: "CaseStudyForm",
    description: "Schema for the case study form",
    required: true,
    properties: {
      title: { type: "string", title: "Title", required: true },
      preview: { type: "text", title: "Preview", required: true },
      problemStatement: { type: "text", title: "Problem Statement", required: true },
      userProblems: {
        type: "array",
        title: "User Problems",
        description: "User Problems",
        required: true,
        items: { type: "string", title: "User Problem", required: true },
        toString: (object) => object.join(", "),
      },
      possibleSolutions: {
        type: "array",
        title: "Possible Solutions",
        description: "Possible Solutions",
        required: true,
        items: { type: "string", title: "Possible Solution", required: true },
        toString: (object) => object.join(", "),
      },
      goals: {
        type: "array",
        title: "Goals",
        description: "Goals",
        required: true,
        items: { type: "string", title: "Goal", required: true },
        toString: (object) => object.join(", "),
      },
      images: {
        type: "image",
        title: "Images",
        required: true,
        max: 10,
      },
      uniqueFeatures: { type: "text", title: "Unique Features", required: true },
      userResearch: { type: "text", title: "User Research", required: true },
      keyLearning: { type: "text", title: "Key Learning", required: true },
      userPersonas: userPersona,
      competitiveAnalysis: {
        type: "image",
        title: "Competitive Analysis",
        required: false,
        max: 10,
      },
      wireFrames: {
        type: "image",
        title: "Wireframes",
        required: false,
        max: 10,
      },
      hifiDesign: {
        type: "image",
        title: "High Fidelity Design",
        required: false,
        max: 10,
      },
      userFlow: {
        type: "image",
        title: "User Flow",
        required: false,
        max: 10,
      },
      architecture: {
        type: "image",
        title: "Architecture",
        required: false,
        max: 10,
      },
    },
    toString: (object) => object.title,
  };

  export { caseStudyFormSchema };