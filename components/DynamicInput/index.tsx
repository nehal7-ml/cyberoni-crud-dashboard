import React, { useState, FormEvent, ChangeEvent, useMemo, useEffect } from "react";
import DateInput from "../DateInput";
import ArrayForm from "./ArrayForm";
import { deepEqual } from "@/lib/utils";
import FloatingLabelInput from "../shared/FloatingLabelInput";
import { Schema } from "zod";
import MapForm from "./MapForm";
export type FormSchema =
  {
    type: "string" | "number" | "date";
    title: string;
    required: boolean;
  }
  | {
    type: "select" | "multi-select";
    options: { label: string; value: string }[];
    required: boolean;
    title: string;
  } | {
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
    title: string;
    description: string;
    type: "map";
    required: boolean;
    items: FormSchema;
    toString: (object: any) => string;
  };

interface DynamicInputProps {
  defaultValue?: any;
  schema: FormSchema;
  onChange: (data: any) => void;
}
const DynamicInput: React.FC<DynamicInputProps> = ({ schema, onChange, defaultValue }) => {
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

    }

    return data;
  }, [schema]);
  const [currentData, setCurrentData] = useState(defaultValue ?? current);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentData(e.target.value)
    onChange(e.target.value);
  };
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentData(
      isNaN(Number(e.target.value))
        ? 0
        : Number(e.target.value),
    );
  };

  const handleDateChange = (e: { target: { name: string; value: Date } }) => {
    setCurrentData(e.target.value);
  };

  useEffect(() => {

    console.log(defaultValue);
    if (defaultValue === undefined) {
      setCurrentData(current)
    }

    console.log(defaultValue, currentData, schema.title);
    if (!deepEqual(currentData, defaultValue) && currentData !== undefined) {
      console.log("calling change");
      onChange(currentData)

    }
  }, [current, currentData, defaultValue, onChange, schema.title]);

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
            <select className="border p-4 rounded-md">
              {schema.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : schema.type === "map" ? (
           <MapForm defaultValue={currentData} schema={schema} onChange={(data:any)=>setCurrentData(data)} />
        ) : schema.type === "array" ? (
          <ArrayForm
            defaultValue={currentData}
            schema={schema}
            onChange={(newArray) => {
              setCurrentData(newArray);
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
                  setCurrentData((prev: any) => ({ ...prev, [key]: newData }));
                }}
              />
            ))}
          </div>
        )

          : null}
      </div>

    </div>
  );
};

export default DynamicInput;