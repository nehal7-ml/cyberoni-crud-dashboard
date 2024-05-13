"use client";

import { useEffect, useState } from "react";
import AddImagesAndTags from "../AddImagesAndTags";
import Notification, { useNotify } from "../Notification";
import {
  SoftwareProductCategory,
  CreateSoftwareProductDTO,
  CreateTagDTO,
} from "@/crud/DTOs";
import { redirect, useParams, useRouter } from "next/navigation";
import { CreateImageDTO } from "@/crud/DTOs";
import Editor from "../RichTextEditor";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import DateInput from "../DateInput";
import LoadingDots from "../shared/loading-dots";
import CategoryForm from "../CategoryForm";
import { SoftwareProductSchema } from "@/crud/jsonSchemas";
import DynamicInput from "../DynamicInput";
import { SoftwareProductFormSchema } from "./formSchema";
import { extractUUID, seoUrl, stripSlashes } from "@/lib/utils";

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(SoftwareProductSchema);

function SoftwareProductForm({
  categories,
  method,
  action,
  initial,
}: {
  method: "POST" | "PUT";
  categories: SoftwareProductCategory[];
  action: string;
  initial?: CreateSoftwareProductDTO;
}) {
  const [loading, setLoading] = useState(false);

  const [currentCategory, setCurrentCategory] = useState(-1);
  const [categoryList, setCategoryList] =
    useState<SoftwareProductCategory[]>(categories);
  const [softwareProductData, setSoftwareProductData] =
    useState<CreateSoftwareProductDTO>(
      initial || {
        title: "",
        subTitle: "",
        description: "",
        pricing: "Free",
        status: "Planned",
        link: "",
        githubLink: "",
        blog: undefined,
        tags: [],
        images: [],
        category: undefined,
      },
    );
  const [rawJson, setRawJson] = useState(
    JSON.stringify(softwareProductData, null, 2),
  );
  const { toast } = useNotify();
  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string | number | Date } },
  ) => {
    const { name, value } = e.target;

    if (name == "author") {
      setSoftwareProductData((prevData) => ({
        ...prevData,
        author: { email: value as string },
      }));
    } else {
      setSoftwareProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setSoftwareProductData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer your-access-token",
    };
    // Send the userData to your backend for creating the user
    console.log(softwareProductData);
    const res = await fetch(`${action}`, {
      method: method,
      body: JSON.stringify(softwareProductData),
      headers,
    });
    let resJson = await res.json();

    if (res.status == 200) {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "success",
      });

      router.replace(`/dashboard/softwares/view/${resJson.data.id}`);
    } else {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "error",
      });
    }

    setLoading(false);
  };



  function handleCategoryChange(
    category: SoftwareProductCategory,
    index: number,
    action: "add" | "update" | "delete",
  ) {
    if (action === "add") {
      // Add the category only if it doesn't already exist in the list
      setCategoryList((prev) =>
        prev.find((c) => c.id === category.id) ? prev : [...prev, category],
      );
    } else if (action === "update") {
      // Update the category based on id
      const newCatList = categoryList;
      newCatList[index] = category;
      setCategoryList(newCatList);
    } else if (action === "delete") {
      // Delete the category based on id (more secure)
      setCurrentCategory(-1);
      setCategoryList((prev) => prev.splice(index, 1));
    } else {
      // Optionally handle unexpected actions
      console.error("Unhandled action:", action);
    }
  }

  useEffect(() => {
    if (initial) setSoftwareProductData(initial);
  }, [initial]);

  function handleChangedImageAndTag(
    images: CreateImageDTO[],
    tags: CreateTagDTO[],
  ) {
    setSoftwareProductData((prevData) => ({
      ...prevData,
      images,
      tags,
    }));

    console.log(images);
  }

  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = validate(newData);
      if (!valid)
        alert(
          validate.errors
            ?.map(
              (err) =>
                `${err.instancePath} ${err.message} (${err.schemaPath}) `,
            )
            .join("\n"),
        );
      else {
        if (Object.keys(newData).length > 0) {
          for (let key of Object.keys(softwareProductData)) {
            if (key === "date" || (key === "publishDate" && newData[key])) {
              console.log(newData[key] as string);
              setSoftwareProductData((prev) => ({
                ...prev,
                [key]: new Date(newData[key] as string),
              }));
            } else
              setSoftwareProductData((prev) => ({
                ...prev,
                [key]: newData[key],
              }));
          }
        }
      }
    } catch (error) {
      console.log("invalid JSON", error);
      alert("Error parsing JSON" + error);
    }
  }

  useEffect(() => {
    console.log(initial);
    if (initial && initial.category && initial.category.parent) {
      let cat = categories.findIndex(
        (c) => c.id === initial.category?.parent?.id,
      );
      setCurrentCategory(cat);
    }
  }, [categories, initial]);

  useEffect(() => {
    console.log(softwareProductData);
  }, [softwareProductData]);
  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen  items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-gray-800 ">
      <div className="w-full max-w-3xl rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Software Product
        </h2>
        <form onSubmit={handleSubmit} className="h-fit">
          <DynamicInput
            onChange={(e) =>
              setSoftwareProductData((prev) => ({
                ...prev,
                ...e,

                blog:
                  e.blogLink.length > 0
                    ? { id: extractUUID(e.blogLink) }
                    : undefined,
              }))
            }
            schema={SoftwareProductFormSchema}
            defaultValue={{
              title: softwareProductData.title,
              subTitle: softwareProductData.subTitle,
              description: softwareProductData.description,
              link: softwareProductData.link,
              githubLink: softwareProductData.githubLink,
              pricing: softwareProductData.pricing,
              status: softwareProductData.status,
              blogLink: softwareProductData.blog
                ? `${stripSlashes(
                    process.env.NEXT_PUBLIC_API_URL!,
                  )}/blogs/post/${seoUrl(
                    softwareProductData.blog!.title,
                    softwareProductData.blog!.id,
                  )}`
                : "",
            }}
          />

          {categoryList && categoryList.length > 0 ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category:
                  <select
                    value={currentCategory}
                    name="category"
                    id=""
                    onChange={(e) => {
                      setCurrentCategory(Number(e.target.value));
                      setSoftwareProductData((prev) => ({
                        ...prev,
                        category: categoryList[Number(e.target.value)].children
                          ? {
                              id: categoryList[Number(e.target.value)]
                                .children![0].id as string,
                              name: categoryList[Number(e.target.value)]
                                .children![0].name as string,
                            }
                          : undefined,
                      }));
                    }}
                  >
                    <option value={-1}>Select Category</option>
                    {categoryList?.map((category, index) => (
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
                    name="category"
                    id=""
                    value={softwareProductData.category?.id ?? -1}
                    onChange={(e) => {
                      setSoftwareProductData((prev) => ({
                        category:
                          e.target.value == "-1"
                            ? undefined
                            : {
                                id: e.target.value,
                                name: e.target.value,
                              },
                        ...prev,
                      }));
                    }}
                  >
                    {currentCategory > -1
                      ? categoryList[currentCategory].children?.map(
                          (category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ),
                        )
                      : null}
                  </select>
                </label>
              </div>
            </>
          ) : null}
          <div className="mb-4">
            <CategoryForm
              onChange={(category, type) => {
                handleCategoryChange(category, currentCategory, type);
              }}
              action={"software"}
              defaultValue={
                currentCategory > -1 ? categories[currentCategory] : undefined
              }
            />
          </div>
          <div className="mb-4">
            <AddImagesAndTags
              tags={softwareProductData.tags}
              images={softwareProductData.images}
              onImagesAndTagsChange={handleChangedImageAndTag}
              maxImages={1}
              maxTags={10}
            ></AddImagesAndTags>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-400"
          >
            {loading ? <LoadingDots /> : null}
            {method === "POST"
              ? "Create SoftwareProduct"
              : "Update SoftwareProduct"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SoftwareProductForm;
