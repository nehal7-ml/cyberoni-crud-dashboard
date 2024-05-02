import { useEffect, useMemo, useState } from "react";
import DynamicInput, { FormSchema } from ".";
import { arraysAreEqual, deepEqual } from "@/lib/utils";
import Chip from "./Chip";
import { PlusCircle, X } from "lucide-react";
import Modal from "../shared/Modal";
import FloatingLabelInput from "../shared/FloatingLabelInput";
import Notification, { useNotify } from "../Notification";

function MapForm({
    schema,
    defaultValue,
    onChange,
}: {
    schema: {
        type: "map";
        items: FormSchema;
        toString: (object: any) => string;
        title: string;
    };
    defaultValue: { [key: string]: any };
    onChange: (data: { [key: string]: any }) => void;
}) {
    const [openForm, setOpenForm] = useState(false);
    let [items, setItems] = useState(defaultValue || {});
    const toast = useNotify();
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
    const [currentKey, setCurrentKey] = useState("");
    const [mode, setMode] = useState<"ADD" | "EDIT">("ADD");

    function addItem(key: string) {
        if (!key) {
            toast("Please enter a key", {
                type: 'error'
            });

            return
        }
        setItems((prev) => ({ ...prev, [key]: currentItem }))
        setCurrentItem(currentItem);
        setCurrentKey(key);
        setMode('EDIT')
    }
    function updateItem(key: string) {
        if (!key) {
            toast("Please enter a key", {
                type: 'error'
            });

            return
        }
        setItems((prev) => ({
            ...prev, [key]: currentItem
        }));
        setCurrentItem(initial);
        setOpenForm(false);
        setCurrentKey("");
    }

    useEffect(() => {
        // console.log(items, defaultValue, "Arrayingput");
        if (!deepEqual(items, defaultValue)) {
            onChange(items);

        }
    }, [defaultValue, items, onChange]);
    return (
        <div className="flex flex-col justify-start items-center w-full">
            <div className="w-full font-semibold">{schema.title} : </div>
            <div className="flex flex-wrap w-full my-5 gap-3">
                {Object.entries(items).map(([key, value]: any[]) => (
                    <Chip
                        key={key}
                        label={`${key} : ${schema.toString(value)}`}
                        onEdit={() => {
                            setMode("EDIT");
                            setCurrentKey(key);
                            setCurrentItem(value);
                            setOpenForm(true);
                        }}
                        onDelete={() => {
                            delete items[key];
                            setItems({ ...items });
                        }}
                    />
                ))}
            </div>
            <Modal setShow={setOpenForm} show={openForm}>
                <div className="relative overflow-hidden max-h-full bg-gray-50 rounded-sm p-4">
                    <button type="button" onClick={() => setOpenForm(false)} className="absolute right-2 top-2 hover:text-red-500">
                        <X></X>
                    </button>
                    <div className="p-4 max-h-[80vh]">
                        <FloatingLabelInput disabled={mode === 'EDIT'} placeholder="Key" value={currentKey} onChange={(e) => setCurrentKey(e.target.value)} ></FloatingLabelInput>
                        <DynamicInput onChange={(data) => setCurrentItem(data)} defaultValue={currentItem} schema={schema.items} />
                    </div>
                    <div className="flex justify-center items-center">
                        <button onClick={mode === 'ADD' ? () => addItem(currentKey) : () => updateItem(currentKey)} type="button" className="flex gap-3 bg-blue-500 p-2 rounded text-white w-fit justify-center items-end">
                            {mode === "EDIT" ? "Update" : "Add"}

                        </button>
                    </div>
                </div>
            </Modal>
            <button onClick={() => (setMode('ADD'), setCurrentItem(initial), setOpenForm(true))} type="button" className="flex gap-3 bg-blue-500 p-2 rounded text-white w-fit justify-center items-end">
                <PlusCircle />
                Add
            </button>
        </div>
    );
}

export default MapForm;