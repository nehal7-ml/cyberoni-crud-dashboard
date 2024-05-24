import { FormSchema } from "../DynamicInput";


const FaqsFormSchema: FormSchema= {
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


export { FaqsFormSchema }