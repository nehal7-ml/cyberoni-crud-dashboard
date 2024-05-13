import { useEffect, useState } from "react";
import DynamicInput from "../DynamicInput";
import Modal from "../shared/Modal";
import { CategoryType } from "@/types/global";
import Notification, { useNotify } from "../Notification";
import { X } from "lucide-react";
import LoadingDots from "../shared/loading-dots";
import DeleteModal from "../DeleteModal";

import { z } from 'zod'
const categorySchema =
  z.object({
    name: z.string().min(1, "Category Name cannot be empty"),
    children: z.array(
      z.object({
        name: z.string().min(1, "Sub Category Name cannot be empty"),
      })
    ).min(1, "Provide at least one subcategory")
  })



function CategoryForm({
  action,
  onChange,
  defaultValue,
}: {
  action: CategoryType;
  onChange: (data: any, type: "add" | "update" | "delete") => void;
  defaultValue?: {
    id?: string;
    name: string;
    children?: { id?: string; name: string }[];
  };
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"POST" | "PUT" | "DELETE">("POST");
  const [category, setCategory] = useState(
    defaultValue || {
      name: "",
      children: [],
    },
  );
  const { toast } = useNotify();

  async function handleSubmit() {

    const valid = categorySchema.safeParse(category)

    if(!valid.success){

      console.log(valid.error.errors);
      for(let err of (valid.error.errors)){
        toast(err.message, {type: 'error'});
      }
      return 
    }

    setLoading(true);
    console.log(category);
    const res = await fetch(
      `/api/categories/${action}/${method == "POST" ? `add` : `${defaultValue?.id}`}`,
      {
        method: method,
        body: JSON.stringify(category),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (res.status == 200) {
      toast(`Category ${method == "POST" ? "added" : "updated"} successfully`, {
        type: "success",
      });
      const { data } = await res.json();
      console.log("recieved data", data);
      onChange(data, method === "POST" ? "add" : "update");
      setShowDialog(false);

    } else {
      toast("Something went wrong", {
        type: "error",
      });
    }

    setLoading(false);
  }

  async function handleChange(data: {
    name: string;
    children: { name: string; id?: string }[];
  }) {
    setCategory({
      name: data.name,
      children: data.children,
    });
  }

  useEffect(() => {
    if (defaultValue) {
      setCategory(defaultValue);
    } else {
      setCategory({ name: "", children: [] });
    }
  }, [defaultValue]);

  return (
    <>
      <div className="flex items-center justify-normal gap-4">
        <button
          type="button"
          onClick={() => {
            setMethod("POST");

            setCategory({ name: "", children: [] });
            setShowDialog(true)
          }}
          className="text-sm text-slate-500"
        >
          Add category
        </button>
        {defaultValue && <> <button
          type="button"
          onClick={() => {
            setMethod("PUT");
            setShowDialog(true)
          }}
          className="text-sm text-slate-500"
        >
          Edit category
        </button>

          <button
            type="button"
            onClick={() => {

              if (!category.id) {
                toast("Please select a category to delete", {
                  type: "error",
                })

                return
              }
              setDeleteModal(true);
              setMethod("DELETE");
            }}
            className="text-sm text-red-700"
          >
            delete category
          </button>
        </>
        }

      </div>
      <Modal show={showDialog} setShow={setShowDialog}>
        <div className="relative mx-auto flex w-fit flex-col items-center justify-end gap-3  bg-gray-50 p-5">
          <button
            onClick={() => setShowDialog(false)}
            className="absolute right-0 top-0 text-red-500"
          >
            <X />
          </button>
          <DynamicInput
            defaultValue={{ name: category.name, children: category.children }}
            onChange={handleChange}
            schema={{
              type: "object",
              properties: {
                name: { type: "string", required: true, title: "Category" },
                children: {
                  type: "array",
                  description: "Subcategories of this category",
                  items: {
                    title: "Subcategory",
                    type: "object",
                    description: "Subcategories of this category",
                    properties: {
                      id: {
                        type: "string",
                        title: "SubcategoryID",
                        required: false,
                        disabled: true,
                      },
                      name: {
                        type: "string",
                        title: "Subcategory",
                        required: true,
                      },
                    },
                    required: true,
                  },
                  required: true,
                  title: "Subcategory",
                  toString: (object: { name: string }) => {
                    return object.name;
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
            className="flex w-fit  items-center justify-center gap-3 rounded bg-blue-500 p-2 text-white"
          >
            {loading && <LoadingDots />} {method === "POST" ? "Add" : "Update"}{" "}
            Categories
          </button>
        </div>
      </Modal>

      <DeleteModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        url={`/api/categories/${action}/${defaultValue?.id}`}
        onDelete={() => (
          setShowDialog(false),
          setCategory({ name: "", children: [] }),
          onChange({ id: defaultValue?.id }, "delete")
        )}
      ></DeleteModal>
    </>
  );
}

export default CategoryForm;
