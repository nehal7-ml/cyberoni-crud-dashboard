import { useMemo } from "react";
import { FormSchema } from ".";

function useDefaultValues({
    schema,
}: {
    schema: FormSchema;
}) {
    const current = useMemo(() => {
        return defaultValues(schema);
    }, [schema]);

    return current;
}


function defaultValues(schema: FormSchema) {
    let data: any;
    if (schema.type === "map") {
        data = {};
    }

    if (schema.type === "array") {
        data = [];
    }

    if (schema.type === "object") {
        data = {}
        const keys = Object.keys(schema.properties);
        for (const key of keys) {
            data[key] = defaultValues(schema.properties[key])
        }
    } else if (schema.type === "string" || schema.type === "text") {
        data = "";
    } else if (schema.type === "rich-text") {
        data = "";
    } else if (schema.type === "select") {
        data = schema.options[0].value;
    } else if (schema.type === "boolean") {
        data = false;
    } else if (schema.type === "number") {
        data = 0;
    } else if (schema.type === "date") {
        data = new Date();
    } else if (schema.type === "multi-select") {
        data = [];
    } else if (schema.type === "image") {
        data = [];
    }

    return data;


}
export default useDefaultValues;
