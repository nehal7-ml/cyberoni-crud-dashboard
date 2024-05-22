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
          description: "User image",
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