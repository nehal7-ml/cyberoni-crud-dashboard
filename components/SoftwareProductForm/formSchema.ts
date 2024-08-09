import { workflowServices, workFlowTools } from "@/crud/DTOs";
import { FormSchema } from "../DynamicInput";

const servicesOptions = Object.values(workflowServices).map(service => ({ label: service, value: service }));
const toolsOptions = Object.values(workFlowTools).map(tool => ({ label: tool, value: tool }));

const ServiceSelectSchema: FormSchema = {
    type: "multi-select",
    title: "Services",
    required: true,
    options: servicesOptions,
}

const ToolSelectSchema: FormSchema = {
    type: "multi-select",
    title: "Tools",
    required: true,
    options: toolsOptions,
}

export const SoftwareProductFormSchema: FormSchema = {
    description: "Software properties form",
    title: "Software Product Form",
    type: "object",
    properties: {
        "title": {
            type: "string",
            required: true,
            title: "Title",
        },
        "subTitle": {
            type: "string",
            required: true,
            title: "Subtitle",
        },
        "description": {
            type: "string",
            required: false,
            title: "Description",
        },

        "pricing": {
            type: "select",
            title: "Pricing Model",
            required: true,
            options: [
                { label: "Freemium", value: "Freemium" },
                { label: "Free", value: "Free" },
                { label: "Paid", value: "Paid" },
                { label: "Subscription", value: "Subscription" }
            ]
        },
        "link": {
            type: "string",
            required: false,
            title: "Product Link",
            pattern: "^(https?|ftp):\/\/(?:[a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,}(?::\d{2,5})?(?:\/[^\s]*)?$"
        },
        "githubLink": {
            type: "string",
            required: false,
            title: "GitHub Link",
            pattern: "^(https?|ftp):\/\/(?:[a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,}(?::\d{2,5})?(?:\/[^\s]*)?$"
        },
        "blogLink": {
            type: "string",
            required: false,
            title: "Blog Link",
            pattern: "https?:\/\/.*[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
        },
        "status": {
            type: "select",
            title: "Product Status",
            required: true,
            options: [
                { label: "Released", value: "Released" },
                { label: "Beta", value: "Beta" },
                { label: "Alpha", value: "Alpha" },
                { label: "Coming Soon", value: "ComingSoon" },
                { label: "Planned", value: "Planned" }
            ]
        }
    },
    required: true,
    toString: object => object.title
};


export const SubscriptionModelSchema: FormSchema = {
    title: "Subscription Model",
    description: "Subscription Model",
    type: "array",
    items: {
        title: "Subscription Tier",
        type: "object",
        properties: {
            "id": {
                type: "string",
                required: false,
                title: "ID",
                disabled: true
            },
            "name": {
                type: "string",
                required: true,
                title: "Title",
            },
            "description": {
                type: "string",
                required: true,
                title: "Description",
            },
            "price": {
                type: "number",
                required: true,
                title: "Price",
            },
            'type': {
                type: 'select',
                options: [
                    { label: 'Yearly', value: 'YEARLY' },
                    { label: 'Monthly', value: 'MONTHLY' }
                ],
                required: true,
                title: 'Type'
            },
            features: {
                type: 'array',
                title: 'Features',
                description: 'Features',
                required: false,
                items: {
                    type: 'object',
                    title: 'Feature',
                    description: 'Feature Items',
                    required: true,
                    properties: {
                        title: {
                            type: 'string',
                            required: true,
                            title: 'Title'
                        },
                        subTitle: {
                            type: 'string',
                            required: true,
                            title: 'Description'
                        },
                        tags: {
                            type: 'tags',
                            title: 'Tags',
                            description: 'Tags for features',
                        }
                    }
                },
                toString: (object: any) => object.title
            },
            workflows: {
                type: "array",
                title: "Workflows",
                description: "Workflows",
                required: false,
                items: {
                    type: "object",
                    description: "Workflow items",
                    title: "Workflow",
                    required: false,
                    properties: {
                        title: {
                            type: "string",
                            required: true,
                            title: "Title",


                        },
                        'token': {
                            type: "string",
                            required: true,
                            title: "Token",
                        },
                        'tools': ToolSelectSchema,
                        'services': ServiceSelectSchema
                            
                    }
                },
                toString: (object: any) => object.title
            },
            chatBots: {
                type: 'array',
                title: 'Chat Bots',
                required: false,
                description: 'Chat Bots',
                items: {
                    type: "object",
                    title: "Chat Bot",
                    description: "Chat Bot Items",
                    required: false,
                    properties: {
                        title: {
                            type: "string",
                            required: true,
                            title: "Title"
                        },
                        token: {
                            type: "string",
                            required: true,
                            title: "Token"
                        },
                        'tools': ToolSelectSchema,
                        'services': ServiceSelectSchema
                            
                    }
                },
                toString: (object: any) => object.title

            },
            credits: {
                type: "number",
                required: false,
                title: "Credits",
            },
            profit: {
                type: "number",
                required: true,
                title: "% Profit",
            }
        },
        description: "Subscription Item",
        required: true,

    },
    toString: object => object.name,
    required: true
}