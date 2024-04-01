import { FormSchema } from "../DynamicInput";

export const stepProperties: FormSchema = {
    description: "Steps for GPT",
    title: "Steps",
    type: "array",
    items: {
        title: "Step-Item",
        description: "indivudual step",
        type: "object",
        properties: {
            description: {
                type: "string",
                required: true,
                title: "description",
            },
            title: {
                type: "string",
                required: true,
                title: "title",
            },
            'priority': {
                type: 'select',
                options: [{ label: 'High', value: 'HIGH' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'Low', value: 'LOW' }],
                title: 'priority',
                required: true
            },
            "context": {
                type: 'string',
                required: true,
                title: "context",
            },
            "goal": {
                type: 'string',
                required: true,
                title: "goal",
            },
            "callTo": {
                type: 'string',
                required: true,
                title: "callTo",
            },
            'command': {
                type: 'string',
                required: true,
                title: 'command',
            }

        },
        required: true
    },
    toString(object: any) {
        return object.title;
    },
    required: false
}


export const sysCommandProperties: FormSchema = {
    description: "System commands for GPT",
    title: "sysCommands",
    type: "map",
    items: {
        title: "Sys-Command-Item",
        description: "indivudual system command",
        type: "object",
        properties: {
            priority: {
                type: "select",
                options: [{ label: 'High', value: 'HIGH' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'Low', value: 'LOW' }],
                required: true,
                title: 'priority'
            },
            context: {
                type: 'string',
                required: true,
                title: "context",
            },
            example: {
                type: 'string',
                required: false,
                title: "example",
            }
        },
        required: true

    },
    toString(object: any) {

        return `${object.context}`
    },
    required: false
}


export const variablesNeededProperties: FormSchema = {
    description: "Variables need for gpt",
    title: "variables",
    type: "array",
    items: {
        title: "variable-Item",
        description: "individual variables",
        type: "object",
        properties: {
            title: {
                type: 'string',
                required: true,
                title: "title",
            },
            description: {
                type: 'string',
                required: false,
                title: "description",
            }
        },
        required: true

    },
    toString(object: any) {

        return `${object.title}`
    },
    required: false
}


export const conversationStartersProperties: FormSchema = {
    description: "Conversation Starters for gpt",
    title: "conversationStarters",
    type: "array",
    items: {
        title: "conversationStarters-Item",
        description: "conversation Starters",
        type: "object",
        properties: {
            title: {
                type: 'string',
                required: true,
                title: "title",
            },
            description: {
                type: 'string',
                required: false,
                title: "description",
            }
        },
        required: true

    },
    toString(object: any) {

        return `${object.title}`
    },
    required: false
}