"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import AddImagesAndTags from "../AddImagesAndTags";
import Notification, { useNotify } from "../Notification";
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
import { BlogSchema } from "../zodSchemas";
import JsonInput from "../shared/JsonInput";
import example from "./example.json";
import DynamicInput from "../DynamicInput";
import blogFormSchema from "./formSchema";
import { createPortal } from "react-dom";
import SeoChecker from "../SeoChecker";
import { datacatalog_v1 } from "googleapis";

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

  const editorRef = useRef<HTMLDivElement | null>(null)

  const defaultBlogData = useMemo(() => {
    if (initial) {
      return initial;
    } else {
      return {
        title: "",
        subTitle: "",
        description: "",
        featured: false,
        publishDate: new Date(),
        category: undefined,
        content: "",
        author: { email: "author@example.com" },
        tags: [],
        images: [],
      };
    }
  }, [initial]);


  const [blogData, setBlogData] = useState<CreateBlogDTO>(defaultBlogData);

  const defaultJson = useMemo(() => {
    if (method === 'POST') {
      return JSON.stringify(blogData, null, 2);
    }
    return JSON.stringify(BlogSchema.parse(blogData), null, 2);
  }, [blogData, method]);
  const [rawJson, setRawJson] = useState(defaultJson);
  const { toast } = useNotify();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer your-access-token",
    };

    let valid = BlogSchema.safeParse(blogData);
    if (!valid.success) {
      for (const e of valid.error.errors) {
        toast(`${e.path} ${e.message}`, { type: "error" });
      }
      setLoading(false);

      return
    }
    console.log(blogData);
    throw "Checl Conlse"

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

  useEffect(() => {
    if (initial) setBlogData(initial);
  }, [initial]);



  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = BlogSchema.safeParse(newData);
      if (!valid.success) {
        for (const e of valid.error.errors) {
          toast(`${e.path} ${e.message}`, {
            type: "error",
          });
        }
      } else {
        setBlogData((prev) => ({
          ...prev,
          ...valid.data,
        }));
      }
    } catch (error) {
      console.log("invalid JSON", error);
      alert("Error parsing JSON" + error);
    }
  }


  useEffect(() => {
    if (document && window) {
      let elem = document.getElementById('editor-root')
      console.log("find elemnt  ;", elem);
      editorRef.current = document.getElementById('editor-root') as HTMLDivElement
    }
  }, []);

  function handleDataChange(data: CreateBlogDTO) {
    console.log("onChange data", data);
    setBlogData((prev) => ({ ...prev, ...data }));

  }
  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen  items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-gray-800 ">
      <div className="w-full rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Blog
        </h2>
        <form onSubmit={handleSubmit} className="h-fit">
          <JsonInput
            parseJson={parseJson}
            rawJson={rawJson}
            setRawJson={setRawJson}
            example={JSON.stringify(example, null, 2)}
          />
          <DynamicInput
            schema={blogFormSchema}
            onChange={handleDataChange}
            defaultValue={blogData}
          />
          {editorRef.current ? createPortal(
            <div className="flex-shrink">
              <SeoChecker
                textAreaValue={blogData.content}
                title={blogData.title}
                description={blogData.description}
                keyWords={blogData.tags.length > 0 ? blogData.tags[0].name : ""}
              />
            </div>,
            editorRef.current,
          ) : null}
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
                blogData.category as {
                  id: string;
                  name: string;
                  parentId: string | null;
                }
              }
            />
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
