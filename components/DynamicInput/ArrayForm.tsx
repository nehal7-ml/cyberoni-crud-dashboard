"use client";
import { ChangeEvent, Key, useEffect, useMemo, useState } from "react";
import DynamicInput, { FormSchema } from ".";
import { arraysAreEqual } from "@/lib/utils";
import Chip from "./Chip";
import { PlusCircle, X } from "lucide-react";
import DateInput from "../DateInput";
import Modal from "../shared/Modal";
import ListInput from "../ListInput";
import useDefaultValues from "./DefaultValues";

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

  const initial = useDefaultValues({
    schema: schema.items,
  })

  const [currentItem, setCurrentItem] = useState<any>(initial);

  function addItem() {
    // console.log(currentItem);
    onChange(items.concat(currentItem));
    setItems([...items, currentItem]);
    setCurrentItem(initial);
    setMode("EDIT");
    setCurrentIndex(items.length + 1);
    setOpenForm(false);
  }
  function updateItem(index: number) {
    const newItems = items;
    newItems[index] = currentItem;
    onChange(newItems);
    setItems(newItems);

    setCurrentItem(initial);
    setOpenForm(false);
    setCurrentIndex(-1);
  }

  useEffect(() => {

    //console.log("useEffect Ayyay form:  ", schema.title, items, defaultValue);
    if (!arraysAreEqual(items, defaultValue)) {
      //console.log("chanings items Arrys", items, defaultValue);
      setItems(defaultValue);
    }
  }, [defaultValue, items]);



  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="w-full font-semibold">{schema.title} : </div>
      <div className="my-5 flex w-full flex-wrap gap-3">
        {items.map((item: any, index: number) => (
          <Chip
            key={index}
            label={
              schema.items.type === "object"
                ? schema.toString(item)
                : item.toString()
            }
            onEdit={() => {
              setMode("EDIT");
              setCurrentIndex(index);
              setCurrentItem(item);
              setOpenForm(true);
            }}
            onDelete={() => {
              let newItems = items.filter((item: any, i: number) => i !== index)
              onChange(newItems);
              setItems(newItems);
            }}
          />
        ))}
      </div>
      <Modal setShow={setOpenForm} show={openForm}>
        <div className="container relative max-h-full  overflow-hidden rounded-md bg-gray-50  px-7">
          <button
            type="button"
            onClick={() => setOpenForm(false)}
            className="absolute right-1 top-2 hover:text-red-500"
          >
            <X></X>
          </button>
          <div className="max-h-[70vh]  overflow-y-auto px-4">
            {schema.items.type === "string" ? (
              <>
                <ListInput
                  onChange={(newItems) => {
                    onChange(newItems);
                    setItems(newItems);
                    setOpenForm(false);
                    setCurrentIndex(-1);
                  }}
                  initial={items as string[]}
                  label={schema.title}
                />
              </>
            ) : (
              <DynamicInput
                onChange={(data) => setCurrentItem(data)}
                defaultValue={currentItem}
                schema={schema.items}
              />
            )}
          </div>
          <div className=" flex items-center justify-center shadow-inner py-2">
            {schema.items.type === "string" ? null : (
              <button
                onClick={
                  mode === "ADD"
                    ? addItem
                    : () => (updateItem(currentIndex), setOpenForm(false))
                }
                type="button"
                className="flex w-fit items-end justify-center gap-3 rounded bg-blue-500 p-2 text-white"
              >
                {mode === "EDIT" ? "Update Item" : "Add Item"}
              </button>
            )}
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
        Add New {schema.title}
      </button>
    </div>
  );
}

export default ArrayForm;
