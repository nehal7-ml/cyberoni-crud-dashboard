import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useMemo,
  useEffect,
} from "react";
import DateInput from "../DateInput";
import ArrayForm from "./ArrayForm";
import { deepEqual } from "@/lib/utils";
import FloatingLabelInput from "../shared/FloatingLabelInput";
import { Schema } from "zod";
import MapForm from "./MapForm";
import AddImage from "../AddImagesAndTags/AddImage";
export type FormSchema =
  | {
    type: "number" | "date";
    title: string;
    required: boolean;
    disabled?: boolean;
  }
  | {
    type: "string";
    title: string;
    required: boolean;
    disabled?: boolean;
    pattern?: string;
  }
  | {
    type: "select" | "multi-select";
    options: { label: string; value: string }[];
    required: boolean;
    title: string;
  }
  | {
    title: string;
    description: string;
    type: "array";
    required: boolean;
    items: FormSchema;
    toString: (object: any) => string;
  }
  | {
    type: "object";

    title: string;
    description: string;
    required: boolean;
    properties: {
      [key: string]: FormSchema;
    };
    toString: (object: any) => string;
  }
  | {
    type: "image";
    title: string;
    description: string;
    required: boolean;
  }
  | {
    title: string;
    description: string;
    type: "map";
    required: boolean;
    items: FormSchema;
    toString: (object: any) => string;
  };

interface DynamicInputProps {
  defaultValue: any;
  schema: FormSchema;
  onChange: (data: any) => void;
}
const DynamicInput: React.FC<DynamicInputProps> = ({
  schema,
  onChange,
  defaultValue,
}) => {
  const current = useMemo(() => {
    let data: any;
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
    } else if (schema.type === "string" || schema.type === "select") {
      data = "";
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
  }, [schema]);
  const [currentData, setCurrentData] = useState(defaultValue ?? current);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentData(e.target.value);
    onChange(e.target.value);
  };
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let data = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value);
    setCurrentData(data);

    onChange(data);
  };

  const handleDateChange = (e: { target: { name: string; value: Date } }) => {
    setCurrentData(e.target.value);
    onChange(e.target.value);
  };

  useEffect(() => {
    console.log("dynamic form ", defaultValue, currentData,!deepEqual(currentData, defaultValue));

    if (defaultValue && !deepEqual(currentData, defaultValue)) {
      console.log("calling change", currentData, defaultValue);
      setCurrentData(defaultValue);
    }
  }, [current, currentData, defaultValue, onChange,schema.type]);

  return (
    <div>
      <div>
        {schema.type === "string" ? (
          <FloatingLabelInput
            type={"text"}
            className=""
            placeholder={schema.title}
            name={schema.title}
            value={currentData as string}
            onChange={handleTextChange}
            disabled={schema.disabled ?? false}
            pattern={schema.pattern ?? undefined}
            title={`${schema.title}`}
          />
        ) : schema.type === "number" ? (
          <FloatingLabelInput
            placeholder={schema.title}
            type={"text"}
            className=""
            name={schema.title}
            value={currentData as string}
            onChange={handleNumberChange}
            pattern="[0-9]*"
            disabled={schema.disabled ?? false}
          />
        ) : schema.type === "date" ? (
          <DateInput
            name={schema.title}
            onDateChange={handleDateChange}
            value={currentData as Date}
          />
        ) : schema.type === "select" ? (
          <div>
            <label>{schema.title} : </label>
            <select
              className="rounded-md border p-4"
              value={currentData}
              onChange={(e) => (
                onChange(e.target.value),
                setCurrentData(e.target.value)
              )}
            >
              {schema.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : schema.type === "map" ? (
          <MapForm
            defaultValue={currentData}
            schema={schema}
            onChange={(data: any) => (onChange(data), setCurrentData(data))}
          />
        ) : schema.type === "array" ? (
          <ArrayForm
            defaultValue={currentData}
            schema={schema}
            onChange={(newArray) => {
              setCurrentData(newArray);
              onChange(newArray);
            }}
          />
        ) : schema.type === "multi-select" ? (
          <div></div>
        ) : schema.type === "object" ? (
          <div>
            {Object.entries(schema.properties).map(([key, value]) => (
              <DynamicInput
                key={key}
                defaultValue={currentData[key]}
                schema={value}
                onChange={(newData) => {
                  onChange({ ...currentData, [key]: newData });
                  setCurrentData((prev: any) => ({ ...prev, [key]: newData }));
                }}
              />
            ))}
          </div>
        ) : schema.type === "image" ? (
          <AddImage
            name={schema.title}
            defaultImages={currentData}
            onImagesChange={(images) => (
              onChange(images),
              setCurrentData(images)
            )}
            maxImages={1}
          />
        ) : null}
      </div>
    </div>
  );
};

export default DynamicInput;
