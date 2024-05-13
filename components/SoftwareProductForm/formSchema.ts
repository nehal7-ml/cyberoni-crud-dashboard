import { FormSchema } from "../DynamicInput";
import { SoftwareProductStatus, SoftwarePricing } from "@prisma/client";
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
            pattern: "^https:\/\/github\.com\/([a-zA-Z0-9_\\-]+)\/([a-zA-Z0-9_\\-]+)(\/(tree|blob)\/([a-zA-Z0-9_\\-]+)(\/.+?)?)?"
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
                { label: "Coming Soon", value: "CommingSoon" },
                { label: "Planned", value: "Planned" }
            ]
        }
    },
    required: true,
    toString: object => object.title
};