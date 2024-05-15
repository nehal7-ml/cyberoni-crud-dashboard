import { useEffect, useState } from "react";
import DynamicInput from "../DynamicInput";
import Modal from "../shared/Modal";
import { CategoryType } from "@/types/global";
import Notification, { useNotify } from "../Notification";
import { X } from "lucide-react";
import LoadingDots from "../shared/loading-dots";
import DeleteModal from "../DeleteModal";

import { z } from "zod";
import { CreateCategory } from "@/crud/DTOs";
const categorySchema = z.object({
  name: z.string().trim().min(1, "Category Name cannot be empty"),
  children: z.array(
    z.object({
      name: z.string().trim().min(1, "Sub Category Name cannot be empty"),
    }),
  ),
});

function CategoryForm({
  action,
  onChange,
  selected,
}: {
  action: CategoryType;
  onChange: (
    Category: { name: string; id: string; parentId: string | null } | undefined,
  ) => void;
  selected?: { name: string; id: string; parentId: string | null };
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<CreateCategory[]>([]);
  const [method, setMethod] = useState<"POST" | "PUT" | "DELETE">("POST");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSubCategory, setCurrentSubCategory] = useState(-1);
  const [currentCategory, setCurrentCategory] = useState<CreateCategory>({
    id: "",
    name: "",
    children: [],
  });

  const { toast } = useNotify();

  async function handleSubmit() {
    const valid = categorySchema.safeParse(currentCategory);

    if (!valid.success) {
      console.log(valid.error.errors);
      for (let err of valid.error.errors) {
        toast(err.message, { type: "error" });
      }
      return;
    }

    setLoading(true);
    console.log(currentCategory);
    const res = await fetch(
      `/api/categories/${action}/${method == "POST" ? `add` : `${currentCategory?.id}`}`,
      {
        method: method,
        body: JSON.stringify(currentCategory),
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
      setCategories((prev) =>
        method == "POST"
          ? [...prev, data]
          : prev.map((c) => (c.id == data.id ? data : c)),
      );
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
    setCurrentCategory((prev)=>({
      ...prev,
      name: data.name,
      children: data.children,
    }));
  }

  useEffect(() => {
    if (selected && categories.length > 0) {
      // console.log(selected);
      if (selected.parentId !== null) {
        const category = categories.findIndex((c) => c.id == selected.parentId);
        if (category !== currentIndex) {
          setCurrentIndex(category);
          setCurrentCategory(categories[category]);
        }

        const subCategory = categories[category].children.findIndex(
          (c) => c.id == selected.id,
        );
        if (subCategory !== currentSubCategory) {
          setCurrentSubCategory(subCategory);
        }
      } else {
        const category = categories.findIndex((c) => c.id == selected.id);
        if (category !== currentIndex) {
          setCurrentIndex(category);
          setCurrentCategory(categories[category]);
        }
      }
    }
  }, [categories, currentIndex, currentSubCategory, selected]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/categories/${action}/all`);
      const { data } = await res.json();
      setCategories(data);
    }

    fetchData();
  }, [action]);

  return (
    <>
      <div>
        {categories.length > 0 ? (
          <>
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">
                Category:
                <select
                  className="rounded-md p-3"
                  value={currentIndex}
                  name="category"
                  id=""
                  onChange={(e) => {
                    setCurrentIndex(Number(e.target.value));
                    setCurrentCategory(categories[Number(e.target.value)]);
                    setCurrentSubCategory(-1);
                    onChange({
                      name: categories[Number(e.target.value)].name,
                      id: categories[Number(e.target.value)].id!,
                      parentId: null,
                    });
                  }}
                >
                  <option value={-1}>Select Category</option>
                  {categories?.map((category, index) => (
                    <option key={category.id} value={index}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Sub-Category:
                <select
                  className="rounded-md p-3"
                  name="category"
                  id=""
                  value={currentSubCategory}
                  onChange={(e) => {
                    setCurrentSubCategory(Number(e.target.value));

                    onChange({
                      id: currentCategory.children[Number(e.target.value)].id!,
                      name: currentCategory.children[Number(e.target.value)]
                        .name,
                      parentId: currentCategory.id!,
                    });
                  }}
                >
                  {currentIndex > -1 ? (
                    <>
                      {categories[currentIndex].children.length > 0 && (
                        <option value={-1}>Select Sub-Category</option>
                      )}

                      {categories[currentIndex].children?.map(
                        (category, index) => (
                          <option className="" key={category.id} value={index}>
                            {category.name}
                          </option>
                        ),
                      )}
                    </>
                  ) : null}
                </select>
              </label>
            </div>
          </>
        ) : null}
      </div>
      <div className="flex items-center justify-normal gap-4">
        <button
          type="button"
          onClick={() => {
            setMethod("POST");
            setCurrentCategory({ name: "", children: [] });
            setShowDialog(true);
          }}
          className="text-sm text-slate-500"
        >
          Add category
        </button>
        {currentIndex > -1 && (
          <>
            {" "}
            <button
              type="button"
              onClick={() => {
                setMethod("PUT");
                setShowDialog(true);
              }}
              className="text-sm text-slate-500"
            >
              Edit category
            </button>
            <button
              type="button"
              onClick={() => {
                if (!currentCategory.id) {
                  toast("Please select a category to delete", {
                    type: "error",
                  });

                  return;
                }
                setDeleteModal(true);
                setMethod("DELETE");
              }}
              className="text-sm text-red-700"
            >
              delete category
            </button>
          </>
        )}
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
            defaultValue={{
              name: currentCategory.name,
              children: currentCategory.children,
            }}
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
        url={`/api/categories/${action}/${currentCategory?.id}`}
        onDelete={() => (
          setDeleteModal(false),
          setCurrentIndex(-1),
          setCurrentSubCategory(-1),
          setCurrentCategory({ name: "", children: [] }),
          setCategories((prev) => prev.filter((c) => c.id != currentCategory?.id)),
          onChange(undefined)
        )}
      ></DeleteModal>
    </>
  );
}

export default CategoryForm;
