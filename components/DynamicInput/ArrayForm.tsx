"use client";
import { ChangeEvent, Key, useEffect, useMemo, useState } from "react";
import DynamicInput, { FormSchema } from ".";
import { arraysAreEqual } from "@/lib/utils";
import Chip from "./Chip";
import { PlusCircle, X } from "lucide-react";
import DateInput from "../DateInput";
import Modal from "../shared/Modal";

function ArrayForm({
  schema,
  defaultValue,
  onChange,
}: {
  schema: {
    type: "array";
    items: FormSchema;
    toString: (object: any) => string;
    title: string;
  };
  defaultValue: any[];
  onChange: (value: any[]) => void;
}) {
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");
  const [currentIndex, setCurrentIndex] = useState(-1);
  let [items, setItems] = useState(defaultValue || []);

  const initial = useMemo(() => {
    let data: any;
    if (schema.items.type === "map") {
      data = {};
    }

    if (schema.items.type === "array") {
      data = [];
    }

    if (schema.items.type === "object") {
      data = {};
      const keys = Object.keys(schema.items.properties);

      for (let key of keys) {
        if (schema.items.properties[key].type === "array") {
          data[key] = [];
        } else if (schema.items.properties[key].type === "object") {
          data[key] = {};
        } else if (schema.items.properties[key].type === "map") {
          data[key] = {};
        } else if (schema.items.properties[key].type === "string") {
          data[key] = "";
        } else if (schema.items.properties[key].type === "number") {
          data[key] = 0;
        } else {
          data[key] = "";
        }
      }
    } else if (
      schema.items.type === "string" ||
      schema.items.type === "select"
    ) {
      data = "";
    } else if (schema.items.type === "number") {
      data = 0;
    } else if (schema.items.type === "date") {
      data = new Date();
    } else if (schema.items.type === "multi-select") {
      data = [];
    }

    return data;
  }, [schema]);

  const [currentItem, setCurrentItem] = useState<any>(initial);

  function addItem() {
    console.log(currentItem);
    setItems([...items, currentItem]);
    setCurrentItem(initial);
    setMode("EDIT");
    setCurrentIndex(items.length + 1);
    setOpenForm(false)
  }
  function updateItem(index: number) {
    setItems((prev) => {
      const newItems = prev;
      newItems[index] = currentItem;
      return newItems;
    });
    setCurrentItem(initial);
    setOpenForm(false);
    setCurrentIndex(-1);
  }

  useEffect(() => {
    if (!arraysAreEqual(items, defaultValue)) {
      onChange(items);
    }
  }, [defaultValue, items, onChange]);
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="w-full font-semibold">{schema.title} : </div>
      <div className="my-5 flex w-full flex-wrap gap-3">
        {items.map((item: any, index: number) => (
          <Chip
            key={index}
            label={schema.toString(item)}
            onEdit={() => {
              setMode("EDIT");
              setCurrentIndex(index);
              setCurrentItem(item);
              setOpenForm(true);
            }}
            onDelete={() => {
              setItems(items.filter((item: any, i: number) => i !== index));
            }}
          />
        ))}
      </div>
      <Modal setShow={setOpenForm} show={openForm}>
        <div className="relative max-h-full overflow-hidden rounded-md bg-gray-50 p-4">
          <button
            type="button"
            onClick={() => setOpenForm(false)}
            className="absolute right-2 top-2 hover:text-red-500"
          >
            <X></X>
          </button>
          <div className="max-h-[80vh] p-4">
            <DynamicInput
              onChange={(data) => setCurrentItem(data)}
              defaultValue={currentItem}
              schema={schema.items}
            />
          </div>
          <div className=" flex items-center justify-center">
            <button
              onClick={
                mode === "ADD" ? addItem : () => (updateItem(currentIndex), setOpenForm(false))
              }
              type="button"
              className="flex w-fit items-end justify-center gap-3 rounded bg-blue-500 p-2 text-white"
            >
              {mode === "EDIT" ? "Update Item" : "Add Item"}
            </button>
          </div>
        </div>
      </Modal>
      <button
        onClick={() => (
          setCurrentItem(initial), setOpenForm(true), setMode("ADD")
        )}
        type="button"
        className="flex w-fit items-end justify-center gap-3 rounded bg-blue-500 p-2 text-white"
      >
        <PlusCircle />
        Add {schema.title}
      </button>
    </div>
  );
}

export default ArrayForm;
