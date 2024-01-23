import { PricingModel } from "@prisma/client";

export const TagSchema = {
    "type": "object",
    "properties": {
        "id": { "type": ["string"] },
        "name": { "type": "string" }
    },
    "required": ["name"]
};


export const ImageSchema = {
    "type": "object",
    "properties": {
        "id": { "type": ["string"] },
        "name": { "type": ["string"] },
        "src": { "type": "string" }
    },
    "required": ["src"]
};

export const SubserviceSchema = {
    "type": "object",
    "properties": {
        "id": { "type": "string" },
        "title": { "type": "string" },
        "pricingModel": { enum: [PricingModel.DEFAULT, PricingModel.AGGRESSIVE] },
        "discounts": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": { "type": "string" },
                    "value": { "type": "string" }
                },
                "required": ["name", "value"]
            }
        },
        "serviceDeliverables": {
            "type": "array",
            "items": { "type": "string" }
        },
        "serviceUsageScore": { "type": "number" },
        "description": { "type": "string" },
        "department": { "type": "string" },
        "estimated_hours_times_fifty_percent": { "type": "number" },
        "estimated_hours_times_one_hundred_percent": { "type": "number" },
        "overheadCost": { "type": "number" },
        "complexity": { "type": "number" },
        "skillLevel": { "type": "string" },
        "image": { "$ref": "#/definitions/CreateImageDTO" },
        "tags": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateTagDTO" }
        }
    },
    "required": ["title", "pricingModel", "discounts", "serviceDeliverables", "serviceUsageScore", "description", "department", "estimated_hours_times_fifty_percent", "estimated_hours_times_one_hundred_percent", "overheadCost", "complexity", "skillLevel"],
    "definitions": {
        "CreateImageDTO": ImageSchema,
        "CreateTagDTO": TagSchema
    }
};

export const BlogSchema = {
    "type": "object",
    "properties": {
        "title": { "type": "string" },
        "subTitle": { "type": "string" },
        "description": { "type": "string" },
        "featured": { "type": "boolean" },
        "date": { "type": "string", "format": "date-time" },
        "publishDate": { "type": "string", "format": "date-time" },
        "content": { "type": "string" },
        "templateId": { "type": "string" },
        "author": {
            "type": "object",
            "properties": {
                "id": { "type": ["string"] },
                "email": { "type": "string", "format": "email" }
            },
            "required": ["email"]
        },
        "images": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/CreateImageDTO"
            }
        },
        "tags": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/CreateTagDTO"
            }
        }
    },
    "required": ["title", "subTitle", "description", "featured", "date", "content", "author", "images", "tags"],
    "definitions": {
        "CreateImageDTO": ImageSchema,
        "CreateTagDTO": TagSchema
    }
};

export const ServiceSchema = {
    "type": "object",
    "properties": {
        "title": { "type": "string" },
        "previewContent": { "type": "string" },
        "ServiceDescription": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/CreateServiceDescription"
            }
        },
        "hourlyRate": { "type": "number" },
        "valueBrought": {
            "type": "array",
            "items": { "type": "string" }
        },
        "skillsUsed": {
            "type": "array",
            "items": { "type": "string" }
        },
        "htmlEmbed": { "type": ["string"] },
        "image": { "$ref": "#/definitions/CreateImageDTO" },
        "SubServices": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateSubServiceDTO" }
        },
        "tags": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateTagDTO" }
        },
        "faqs": {
            "type": "array",
            "items": { "$ref": "#/definitions/CreateFaqDTO" }
        }
    },
    "required": ["title", "previewContent", "ServiceDescription", "hourlyRate", "valueBrought", "skillsUsed"],
    "definitions": {
        "CreateServiceDescription": {
            "type": "object",
            "properties": {
                "id": { "type": ["string"] },
                "title": { "type": "string" },
                "content": { "type": "string" },
                "imageOnLeft": { "type": "boolean" },
                "image": { "$ref": "#/definitions/CreateImageDTO" }
            },
            "required": ["title", "content", "imageOnLeft", "image"],
            "definitions": {
                "CreateImageDTO": {
                    // Include the JSON schema for CreateImageDTO here
                }
            }
        },

        "CreateImageDTO": ImageSchema,
        "CreateTagDTO": TagSchema,
        "CreateSubServiceDTO": SubserviceSchema,
        "CreateFaqDTO": {
            "type": "object",
            "properties": {
                "question": { "type": "string" },
                "answer": { "type": "string" }
            },
            "required": ["question", "answer"]
        }
    }
}; 