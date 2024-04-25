import { useState } from "react";
import DynamicInput from "../DynamicInput";

function CategoryForm({
    action,
    method,
    defaultValue,
}: {
    method: "POST" | "PUT";
    action: string;
    defaultValue?: {
        id?: string;
        name: string;
        children: { id?: string, name: string }[];
    }
}) {
    const [category, setCategory] = useState(defaultValue || {
        name: "",
        children: [],
    });

    async function handleSubmit() {
        const res = await fetch(action, {
            method: method,
            body: JSON.stringify(category),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async function handleChange(data: { name: string, children: string[] }) {

        setCategory({
            name: data.name,
            children: data.children.map((item) => ({ name: item })),
        })

    }

    return (
        <div className="flex flex-col justify-end items-center gap-3 ">
            <DynamicInput
                defaultValue={category}
                onChange={handleChange}
                schema={{
                    type: "object",
                    properties: {
                        name: { type: "string", required: true, title: "Category" },
                        children: {
                            type: "array",
                            description: "Subcategories of this category",
                            items: { title: "Subcategory", type: "string", required: true },
                            required: true,
                            title: "Subcategory",
                            toString: (object: string) => {
                                return object;
                            },
                        },
                    },
                    required: true,
                    description: "Subcategories of this category",
                    title: "Subcategories",
                }}
            />
            <button
                type="button"
                onClick={handleSubmit}
                className="flex w-fit items-end justify-center gap-3 rounded bg-blue-500 p-2 text-white"
            >
                Update Categories
            </button>
        </div>
    );
}

export default CategoryForm;
