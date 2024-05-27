import { PricingModel } from "@prisma/client";
import { FormSchema } from "../DynamicInput";


const FaqsFormSchema: FormSchema = {
    type: "array",
    title: "FAQs",
    description: "FAQs Items",
    items: {
        type: "object",
        description: "FAQ",
        title: "FAQ",
        required: true,
        properties: {
            question: {
                required: true,
                type: "string",
                title: "Question",
            },
            answer: {
                type: "string",
                title: "Answer",
                required: true,
            },
        },
    },
    toString: (object: any) => object.question,
    required: false
}

const SubServiceFormSchema: FormSchema = {
    type: "array",
    title: "Subservices",
    description: "Subservices offered",
    required: false,
    items: {
      type: "object",
      title: "Subservice",
      description: "A subservice",
      required: false,
      properties: {
        title: {
          type: "string",
          title: "Subservice Title",
          required: true,
        },
        pricingModel: {
          type: "select",
          title: "Pricing Model",
          required: true,
          options: [
            { label: "Default", value: PricingModel.DEFAULT },
            { label: "Aggressive", value: PricingModel.AGGRESSIVE },
            // Add more options based on your PricingModel enum
          ],
        },
        serviceDeliverables: {
          type: "array",
          title: "Service Deliverables",
          description: "List of deliverables",
          required: true,
          items: {
            type: "string",
            title: "Deliverable",
            required: true,
          },
          toString: (object: any) => object,
        },
        serviceUsageScore: {
          type: "number",
          title: "Service Usage Score",
          required: true,
        },
        description: {
          type: "string",
          title: "Description",
          required: true,
        },
        department: {
          type: "string",
          title: "Department",
          required: true,
        },
        estimated_hours_times_fifty_percent: {
          type: "number",
          title: "Estimated Hours (50%)",
          required: true,
        },
        estimated_hours_times_one_hundred_percent: {
          type: "number",
          title: "Estimated Hours (100%)",
          required: true,
        },
        overheadCost: {
          type: "number",
          title: "Overhead Cost",
          required: true,
        },
        complexity: {
          type: "number",
          title: "Complexity",
          required: true,
        },
        skillLevel: {
          type: "string",
          title: "Skill Level",
          required: true,
        },
        image: {
          type: "image",
          title: "Image",
          required: false,
        },
        tags: {
          type: "tags",
          description: " Tags for the service",
          max : 10
          
        },
      },
      toString: (object: any) => object.title,
    },
    toString: (object: any) => object.title,
  };
  

const ServiceFormSchema: FormSchema = {
    type: "object",
    title: "Service Form",
    description: "Form to create or update a service",
    required: true,
    properties: {
      title: {
        type: "string",
        title: "Title",
        required: true,
      },
      featured: {
        type: "boolean",
        title: "Featured",
        required: false,
      },
      hourlyRate: {
        type: "number",
        title: "Hourly Rate",
        required: true,
      },
      ServiceDescription: {
        type: "array",
        title: "Service Description",
        description: "Description of the service",
        required: false,
        items: {
          type: "object",
          title: "Section",
          description: "A section of the service description",
          required: false,
          properties: {
            title: {
              type: "string",
              title: "Section Title",
              required: true,
            },
            content: {
              type: "string",
              title: "Section Content",
              required: true,
            },
            imageOnLeft: {
              type: "boolean",
              title: "Image on Left",
              required: false,
            },
            image: {
              type: "image",
              title: "Section Image",
              required: true,
            },
          },
          toString: (object: any) => object.title,
        },
        toString: (object: any) => object.title,
      },
      previewContent: {
        type: "string",
        title: "Preview Content",
        required: true,
      },
      valueBrought: {
        type: "array",
        title: "Value Brought",
        description: "Value brought by the service",
        required: false,
        items: {
          type: "string",
          title: "Value Item",
          required: false,
        },
        toString: (object: any) => object,
      },
      skillsUsed: {
        type: "array",
        title: "Skills Used",
        description: "Skills used in the service",
        required: false,
        items: {
          type: "string",
          title: "Skill",
          required: false,
        },
        toString: (object: any) => object,
      },
      SubServices: SubServiceFormSchema,
      faqs: FaqsFormSchema,
      images: {
        type: "image",
        max: 1,
        title: "Images",
        required: false
      },
      tags: {
        type: "tags",
        description: "Tags or keywords",
        max: 10,        
      },
    },
    toString: (object: any) => object.title,
  };
export { ServiceFormSchema };