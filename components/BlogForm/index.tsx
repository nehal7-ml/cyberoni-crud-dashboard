"use client";

import { useEffect, useState } from "react";
import AddImagesAndTags from "../AddImagesAndTags";
import Notification, { toast } from "../Notification";
import { BlogSchema } from "@/crud/jsonSchemas";
import { CreateBlogDTO, CreateTagDTO, DisplayBlogDTO } from "@/crud/DTOs";
import { redirect, useParams, useRouter } from "next/navigation";
import { CreateImageDTO } from "@/crud/DTOs";
import Editor from "../RichTextEditor";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import DateInput from "../DateInput";
import CategoryForm from "./CategoryForm";

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
    categories: {
      name: string;
      id: string;
      children: { name: string; id: string }[];
    }[];
  action: string;
  initial?: CreateBlogDTO;
}) {
  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyType, setNotifyType] = useState<"success" | "fail">("fail");
  const [initialContent, setInitialContent] = useState(initial?.content || "");

  const [currentCategory, setCurrentCategory] = useState(-1);
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
  const [json, setJson] = useState<{ [key: string]: any }>({});

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
  };

  function setQuillData(value: string) {
    setBlogData((prevData) => ({
      ...prevData,
      content: value,
    }));
  }

  useEffect(() => {
    if (initial) setBlogData(initial);
    if(initial && initial.category && initial.category.parent) {
      let cat = categories.findIndex((c) => c.id === initial.category?.parent?.id);
      setCurrentCategory(cat);
    }
  }, [categories, initial]);

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
        setJson(newData);
        if (Object.keys(newData).length > 0) {
          console.log(newData);
          for (let key of Object.keys(blogData)) {
            console.log(key, newData[key]);
            setBlogData((prev) => ({ ...prev, [key]: newData[key] }));
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

  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen  items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-gray-800 ">
      <div className="w-full max-w-3xl rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Create Blog</h2>
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
          {categories && categories.length > 0 ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Category:
                  <select
                    value={currentCategory}
                    name="category"
                    id=""
                    onChange={(e) => setCurrentCategory(Number(e.target.value))}
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
                    name="category"
                    id=""
                    value={blogData.category?.name ?? -1}
                    onChange={(e) =>
                      setBlogData((prev) => ({
                        ...prev,
                        category: {
                          name: e.target.value,
                          parent: { id: categories[currentCategory].id },
                        },
                      }))
                    }
                  >
                    {currentCategory > -1
                      ? categories[currentCategory].children?.map(
                        (category) => (
                          <option key={category.id} value={category.name}>
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
          <CategoryForm
            onAddCategory={(newCat) => (categories = [...categories, newCat])}
          />
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
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {method === "POST" ? "Create Blog" : "Update Blog"}
          </button>
        </form>
      </div>
      <Notification />
    </div>
  );
}

export default BlogForm;
