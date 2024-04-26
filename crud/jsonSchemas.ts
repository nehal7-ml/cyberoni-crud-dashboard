import { PricingModel } from "@prisma/client";

export const TagSchema = {
  type: "object",
  properties: {
    id: { type: ["string"] },
    name: { type: "string" },
  },
  required: ["name"],
};

export const ImageSchema = {
  type: "object",
  properties: {
    id: { type: ["string"] },
    name: { type: ["string"] },
    src: { type: "string" },
  },
  required: ["src"],
};

export const SubServiceSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    pricingModel: { enum: [PricingModel.DEFAULT, PricingModel.AGGRESSIVE] },
    serviceDeliverables: {
      type: "array",
      items: { type: "string" },
    },
    serviceUsageScore: { type: "number" },
    description: { type: "string" },
    department: { type: "string" },
    estimated_hours_times_fifty_percent: { type: "number" },
    estimated_hours_times_one_hundred_percent: { type: "number" },
    overheadCost: { type: "number" },
    complexity: { type: "number" },
    skillLevel: { type: "string" },
    image: { $ref: "#/definitions/CreateImageDTO" },
    tags: {
      type: "array",
      items: { $ref: "#/definitions/CreateTagDTO" },
    },
  },
  required: [
    "title",
    "pricingModel",
    "discounts",
    "serviceDeliverables",
    "serviceUsageScore",
    "description",
    "department",
    "estimated_hours_times_fifty_percent",
    "estimated_hours_times_one_hundred_percent",
    "overheadCost",
    "complexity",
    "skillLevel",
  ],
  definitions: {
    CreateImageDTO: ImageSchema,
    CreateTagDTO: TagSchema,
  },
};

export const BlogSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    subTitle: { type: "string" },
    description: { type: "string" },
    featured: { type: "boolean" },
    date: { type: "string", format: "date-time" },
    publishDate: { type: "string", format: "date-time" },
    content: { type: "string" },
    templateId: { type: "string" },
    author: {
      type: "object",
      properties: {
        id: { type: ["string"] },
        email: { type: "string", format: "email" },
      },
      required: ["email"],
    },
    images: {
      type: "array",
      items: {
        $ref: "#/definitions/CreateImageDTO",
      },
    },
    tags: {
      type: "array",
      items: {
        $ref: "#/definitions/CreateTagDTO",
      },
    },
  },
  required: [
    "title",
    "subTitle",
    "description",
    "featured",
    "date",
    "content",
    "author",
    "images",
    "tags",
  ],
  definitions: {
    CreateImageDTO: ImageSchema,
    CreateTagDTO: TagSchema,
  },
};

export const ServiceSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    previewContent: { type: "string" },
    ServiceDescription: {
      type: "array",
      items: {
        $ref: "#/definitions/CreateServiceDescription",
      },
    },
    hourlyRate: { type: "number" },
    valueBrought: {
      type: "array",
      items: { type: "string" },
    },
    skillsUsed: {
      type: "array",
      items: { type: "string" },
    },
    htmlEmbed: { type: ["string"] },
    image: { $ref: "#/definitions/CreateImageDTO" },
    SubServices: {
      type: "array",
      items: { $ref: "#/definitions/CreateSubServiceDTO" },
    },
    tags: {
      type: "array",
      items: { $ref: "#/definitions/CreateTagDTO" },
    },
    faqs: {
      type: "array",
      items: { $ref: "#/definitions/CreateFaqDTO" },
    },
  },
  required: [
    "title",
    "previewContent",
    "ServiceDescription",
    "hourlyRate",
    "valueBrought",
    "skillsUsed",
  ],
  definitions: {
    CreateServiceDescription: {
      type: "object",
      properties: {
        id: { type: ["string"] },
        title: { type: "string" },
        content: { type: "string" },
        imageOnLeft: { type: "boolean" },
        image: { $ref: "#/definitions/CreateImageDTO" },
      },
      required: ["title", "content", "imageOnLeft", "image"],
      definitions: {
        CreateImageDTO: {
          // Include the JSON schema for CreateImageDTO here
        },
      },
    },

    CreateImageDTO: ImageSchema,
    CreateTagDTO: TagSchema,
    CreateSubServiceDTO: SubServiceSchema,
    CreateFaqDTO: {
      type: "object",
      properties: {
        question: { type: "string" },
        answer: { type: "string" },
      },
      required: ["question", "answer"],
    },
  },
};

export const sysCommandsSchema = {
  type: "object",
  patternProperties: {
    ".*": {
      type: "object",
      properties: {
        priority: {
          type: "string",
          enum: ["HIGH", "MEDIUM", "LOW"],
        },
        context: {
          type: "string",
        },
        example: {
          type: "string",
        },
      },
      required: ["priority", "context", "example"],
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};

export const GptStepsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      index: {
        type: "number",
      },
      command: {
        type: "string",
      },
      callTo: {
        oneOf: [
          {
            type: "string",
            enum: ["@LLM"],
          },
          {
            type: "number",
          },
        ],
      },
      priority: {
        type: "string",
        enum: ["HIGH", "MEDIUM", "LOW"],
      },
      context: {
        type: "string",
      },
      goal: {
        type: "string",
      },
    },
    required: ["index", "command", "callTo", "priority", "context", "goal"],
    additionalProperties: false,
  },
};

export const GptVariablesSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: {
        type: "string",
      },
      description: {
        type: "string",
      },
    },
    required: ["title", "description"],
    additionalProperties: false,
  },
};

export const GptConversationStartersSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: {
        type: "string",
      },
      description: {
        type: "string",
      },
    },
    required: ["title", "description"],
    additionalProperties: false,
  },
};

export const GptPromptSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    description: {
      type: "string",
    },
    title: {
      type: "string",
    },
    prompt: {
      type: ["string", "null"],
    },
    model: {
      type: ["string", "null"],
    },
    temperature: {
      type: "number",
    },
    max_tokens: {
      type: "number",
    },
    top_p: {
      type: "number",
    },
    best_of: {
      type: "number",
    },
    frequency_penalty: {
      type: "number",
    },
    presence_penalty: {
      type: "number",
    },
    stop: {
      type: "array",
      items: {
        type: "string",
      },
    },
    timesUsed: {
      type: "number",
    },
    timesIntegrated: {
      type: "number",
    },
    costPerToken: {
      type: "number",
    },
    profitMargin: {
      type: "number",
    },
    tags: {
      type: "array",
      items: {
        $ref: "#/definitions/CreateTagDTO",
      },
    },
    image: {
      anyOf: [
        {
          $ref: "#/definitions/CreateImageDTO",
        },
        {
          type: "null",
        },
      ],
    },
    botUrl: {
      type: "string",
    },
    conversationStarters: {
      type: "array",
      items: {
        $ref: "#/definitions/GptConvoStarters",
      },
    },
    seed: {
      type: "number",
    },
    startPhrase: {
      type: "string",
    },
    sysCommands: {
      $ref: "#/definitions/GptSysCommands",
    },
    steps: {
      type: "array",
      items: {
        $ref: "#/definitions/GptSteps",
      },
    },
    stream: {
      type: "boolean",
    },
    toolChoice: {
      type: "string",
    },
    tools: {
      type: "object",
      additionalProperties: true,
    },
    variables: {
      type: "array",
      items: {
        $ref: "#/definitions/GptVariables",
      },
    },
  },
  required: [
    "description",
    "title",
    "temperature",
    "max_tokens",
    "top_p",
    "best_of",
    "frequency_penalty",
    "presence_penalty",
    "timesUsed",
    "timesIntegrated",
    "costPerToken",
    "profitMargin",
    "tags",
    "conversationStarters",
    "seed",
    "startPhrase",
    "sysCommands",
    "steps",
    "stream",
    "toolChoice",
  ],
  definitions: {
    CreateTagDTO:TagSchema,
    CreateImageDTO: ImageSchema,
    GptConvoStarters: GptConversationStartersSchema,
    GptSysCommands: sysCommandsSchema,
    GptSteps: GptStepsSchema,
    GptVariables: GptVariablesSchema
  },
};

export const UserPersonaSchema = {
  "type": "object",
  "properties": {
    "bio": { "type": "string" },
    "name": { "type": "string" },
    "gender": { "type": "string" },
    "age": { "type": "number" },
    "goals": {
      "type": "array",
      "items": { "type": "string" }
    },
    "painPoints": {
      "type": "array",
      "items": { "type": "string" }
    },
    "image": { "$ref": "#/definitions/CreateImageDTO" }
  },
  "required": ["bio", "name", "gender", "age", "goals", "painPoints"],
  "definitions": {
    "CreateImageDTO": ImageSchema,

  }
}
export const CaseStudySchema = {
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string", "minLength": 1 },
    "serviceId": { "type": "string" },
    "subServices": {
      "type": "array",
      "items": { "type": "object", "properties": { "id": { "type": "string" } }, "required": ["id"] }
    },
    "preview": { "type": "string", "minLength": 1 },
    "problemStatement": { "type": "string", "minLength": 1 },
    "userProblems": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 }
    },
    "possibleSolutions": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 }
    },
    "goals": {
      "type": "array",
      "items": { "type": "string", "minLength": 1 }
    },
    "images": {
      "type": "array",
      "items": { "$ref": "#/definitions/CreateImageDTO" }
    },
    "uniqueFeatures": { "type": "string", "minLength": 1 },
    "userResearch": { "type": "string", "minLength": 1 },
    "keyLearning": { "type": "string", "minLength": 1 },
    "userPersonas": {
      "type": "array",
      "items": { "$ref": "#/definitions/UserPersona" }
    },
    "competetiveAnalysis": {
      "type": "array",
      "items": { "$ref": "#/definitions/CreateImageDTO" }
    },
    "wireFrames": {
      "type": "array",
      "items": { "$ref": "#/definitions/CreateImageDTO" }
    },
    "hifiDesign": {
      "type": "array",
      "items": { "$ref": "#/definitions/CreateImageDTO" }
    },
    "userFlow": {
      "type": "array",
      "items": { "$ref": "#/definitions/CreateImageDTO" }
    },
    "architecture": {
      "type": "array",
      "items": { "$ref": "#/definitions/CreateImageDTO" }
    }
  },
  "required": ["title", "preview", "problemStatement", "userProblems", "possibleSolutions", "goals", "uniqueFeatures", "userResearch", "keyLearning"],
  "definitions": {
    "CreateImageDTO": ImageSchema,
    "CreateTagDTO":TagSchema,
    "UserPersona": UserPersonaSchema,
  }
}


