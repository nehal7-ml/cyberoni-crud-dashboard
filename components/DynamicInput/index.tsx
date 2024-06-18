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
import AddTags from "../AddImagesAndTags/AddTags";
import useDefaultValues from "./DefaultValues";
import FloatingLabelTextArea from "../shared/FloatingLabelTextArea";
import Editor from "../RichTextEditor";
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
      type: "text";
      title: string;
      required: boolean;
    }
  | {
      type: "rich-text";
      title: string;
      required: boolean;
    }
  | {
      type: "boolean";
      title: string;
      required: boolean;
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
      required: boolean;
      max?: number;
    }
  | {
      type: "tags";
      title?: "Tags";
      description: string;
      max?: number;
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
  const current = useDefaultValues({ schema });
  const [currentData, setCurrentData] = useState(current);

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange(e.target.value);
    setCurrentData(e.target.value);

  };
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let data = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value);
    onChange(data);
    setCurrentData(data);

  };

  const handleDateChange = (e: { target: { name: string; value: Date } }) => {
    onChange(e.target.value);
    setCurrentData(e.target.value);

  };

  useEffect(() => {
    if (!deepEqual(currentData, defaultValue)) {
       //console.log("calling change", schema.title, currentData, defaultValue);
      setCurrentData(defaultValue);
      
    }
  }, [currentData, defaultValue, schema.type]);

  return (
      <>
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
        ) : schema.type === "text" ? (
          <FloatingLabelTextArea
            className=""
            placeholder={schema.title}
            value={currentData as string}
            rows={7}
            name={schema.title}
            onChange={handleTextChange}
          />
        ) : schema.type === "rich-text" ? (
          <Editor
            onChange={(text) => {
              onChange(text);
              setCurrentData(text);

            }}
            defaultValue={currentData}
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
          <div className="flex gap-4  items-center">
            <div>{schema.title}</div>
            <DateInput
              name={schema.title}
              onDateChange={handleDateChange}
              value={currentData as Date}
            />
          </div>
        ) : schema.type === "boolean" ? (
          <label className="flex items-center gap-2">
            <span>{schema.title}</span>
            <input
              type="checkbox"
              value={currentData}
              onChange={(e) => (
                onChange(e.target.checked), setCurrentData(e.target.checked)
              )}
            />
          </label>
        ) : schema.type === "select" ? (
          <div>
            <label>{schema.title} : </label>
            <select
              className="rounded-md border p-4"
              value={currentData}
              onChange={(e) => (
                onChange(e.target.value), setCurrentData(e.target.value)
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
              onChange(newArray);
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
                  onChange({ ...currentData, [key]: newData });
                  setCurrentData((prev: any) => ({ ...prev, [key]: newData }));
                }}
              />
            ))}
          </div>
        ) : schema.type === "image" ? (
          <div>
            <div>{schema.title}</div>
            <AddImage
              name={schema.title}
              defaultImages={currentData}
              onImagesChange={(images) => (
                onChange(images), setCurrentData(images)
              )}
              maxImages={schema.max || 1}
            />
          </div>
        ) : schema.type === "tags" ? (
          <AddTags
            defaultTags={currentData}
            onTagsChange={(tags) => (onChange(tags), setCurrentData(tags))}
            maxTags={schema.max || 10}
          />
        ) : null}
      </>
  );
};

export default DynamicInput;
