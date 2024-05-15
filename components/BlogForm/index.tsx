"use client";

import { useEffect, useState } from "react";
import AddImagesAndTags from "../AddImagesAndTags";
import Notification, { useNotify } from "../Notification";
import { BlogSchema } from "@/crud/jsonSchemas";
import {
  BlogCategory,
  CreateBlogDTO,
  CreateTagDTO,
  DisplayBlogDTO,
} from "@/crud/DTOs";
import { redirect, useParams, useRouter } from "next/navigation";
import { CreateImageDTO } from "@/crud/DTOs";
import Editor from "../RichTextEditor";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import DateInput from "../DateInput";
import LoadingDots from "../shared/loading-dots";
import CategoryForm from "../CategoryForm";

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(BlogSchema);

function BlogForm({
  categories,
  method,
  action,
  initial,
}: {
  method: "POST" | "PUT";
  categories: BlogCategory[];
  action: string;
  initial?: CreateBlogDTO;
}) {
  const [loading, setLoading] = useState(false);

  const [initialContent, setInitialContent] = useState(initial?.content || "");

  const [currentCategory, setCurrentCategory] = useState(-1);
  const [categoryList, setCategoryList] = useState<BlogCategory[]>(categories);
  const [blogData, setBlogData] = useState<CreateBlogDTO>(
    initial || {
      title: "",
      subTitle: "",
      description: "",
      featured: false,
      date: new Date(),
      publishDate: new Date(),
      category: undefined,
      content: "",
      author: { email: "" },
      tags: [],
      images: [],
    },
  );
  const [rawJson, setRawJson] = useState(JSON.stringify(blogData, null, 2));
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
      setBlogData((prevData) => ({
        ...prevData,
        author: { email: value as string },
      }));
    } else {
      setBlogData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setBlogData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer your-access-token",
    };
    // Send the userData to your backend for creating the user
    console.log(blogData);
    const res = await fetch(`${action}`, {
      method: method,
      body: JSON.stringify(blogData),
      headers,
    });
    let resJson = await res.json();

    if (res.status == 200) {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "success",
      });

      router.replace(`/dashboard/blogs/view/${resJson.data.id}`);
    } else {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "error",
      });
    }

    setLoading(false);
  };

  function setQuillData(value: string) {
    setBlogData((prevData) => ({
      ...prevData,
      content: value,
    }));
  }

  function handleCategoryChange(
    category: BlogCategory,
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
    if (initial) setBlogData(initial);
  }, [initial]);

  function handleChangedImageAndTag(
    images: CreateImageDTO[],
    tags: CreateTagDTO[],
  ) {
    setBlogData((prevData) => ({
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
          for (let key of Object.keys(blogData)) {
            if (key === "date" || key === "publishDate" && newData[key]) {
              console.log(newData[key] as string);
              setBlogData((prev) => ({
                ...prev,
                [key]: new Date(newData[key] as string),
              }));
            } else setBlogData((prev) => ({ ...prev, [key]: newData[key] }));
          }
        }

        if (newData.content as string) {
          setInitialContent(newData.content as string);
        }
      }
    } catch (error) {
      console.log("invalid JSON", error);
      alert("Error parsing JSON" + error);
    }
  }

  useEffect(() => {
    if (initial && initial.category && initial.category.parent) {
      let cat = categories.findIndex(
        (c) => c.id === initial.category?.parent?.id,
      );
      setCurrentCategory(cat);
    }
  }, [categories, initial]);
  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen  items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-gray-800 ">
      <div className="w-full max-w-3xl rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Blog
        </h2>
        <form onSubmit={handleSubmit} className="h-fit">
          <div className="mb-4">
            <label className="block" htmlFor="json">
              Json input auto fill:{" "}
            </label>
            <textarea
              className={"w-full p-3 ring-2 invalid:ring-red-500"}
              name="json"
              id=""
              rows={7}
              value={rawJson}
              onChange={(event) => setRawJson(event.target.value)}
            ></textarea>
            <button
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              type="button"
              onClick={() => parseJson(rawJson)}
            >
              Parse Json
            </button>
          </div>
          <div className="my-4 flex items-center  justify-center gap-3 text-center font-bold">
            <hr className="w-1/3" /> OR <hr className="w-1/3" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <input
              type="text"
              name="title"
              className="mt-1 w-full rounded border p-2"
              value={blogData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Author email/username:
            </label>
            <input
              type="text"
              name="author"
              className="mt-1 w-full rounded border p-2"
              value={blogData.author.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Publish Date:
            </label>
            <DateInput
              name="publishDate"
              value={blogData.publishDate}
              onDateChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              SubTitle:
            </label>
            <input
              type="text"
              name="subTitle"
              className="mt-1 w-full rounded border p-2"
              value={blogData.subTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              name="description"
              rows={7}
              className="mt-1 w-full rounded border p-2"
              value={blogData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Featured:
              <input
                type="checkbox"
                name="featured"
                className="ml-2"
                checked={blogData.featured}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>
          
          <div className="mb-4">
            <CategoryForm
              onChange={(category) => {
                setBlogData((prev) => ({
                  ...prev,
                  category,
                }));
              }}
              action={"blog"}
              selected={
                blogData.category as { id: string; name: string, parentId: string | null }
              }
            />
          </div>
          <div className="mb-4 h-fit">
            <label className="block text-sm font-medium text-gray-700">
              Content:
            </label>
            <Editor
              onChange={setQuillData}
              defaultValue={initialContent}
            ></Editor>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Template:
            </label>
            <select
              name="templateId"
              className="mt-1 w-full rounded border p-2"
            >
              <option value={undefined}>default</option>
            </select>
          </div>
          <div className="mb-4">
            <AddImagesAndTags
              tags={blogData.tags}
              images={blogData.images}
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
            {method === "POST" ? "Create Blog" : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BlogForm;
