import { useMemo } from "react";
import { FormSchema } from ".";

function useDefaultValues({ schema, defaultValue }: { schema: FormSchema, defaultValue?: any }) {
    const current = useMemo(() => {
        let data: any;

        if (defaultValue) {
            data = defaultValue;

            if (schema.type === 'rich-text') {
                data = {
                    initial: defaultValue,
                    current: defaultValue,

                }
            }
            return data;
        }

        if (schema.type === "map") {
            data = {};
        }

        if (schema.type === "array") {
            data = [];
        }

        if (schema.type === "object") {
            data = {};
            const keys = Object.keys(schema.properties);

            for (let key of keys) {
                if (schema.properties[key].type === "array") {
                    data[key] = [];
                } else if (schema.properties[key].type === "object") {
                    data[key] = {};
                } else if (schema.properties[key].type === "map") {
                    data[key] = {};
                } else if (schema.properties[key].type === "string") {
                    data[key] = "";
                } else if (schema.properties[key].type === "number") {
                    data[key] = 0;
                } else {
                    data[key] = "";
                }
            }
        } else if (schema.type === "string" || schema.type === "text") {
            data = "";
        }
        else if (schema.type === 'rich-text') {
            data = {
                initial: "",
                current: ""
            }
        }


        else if (schema.type === "select") {
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
    }, [defaultValue, schema]);

    return current


}

export default useDefaultValues