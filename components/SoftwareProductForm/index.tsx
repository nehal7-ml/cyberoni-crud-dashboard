"use client";

import { useEffect, useMemo, useState } from "react";
import AddImagesAndTags from "../AddImagesAndTags";
import Notification, { useNotify } from "../Notification";
import {
  SoftwareProductCategory,
  CreateSoftwareProductDTO,
  CreateTagDTO,
  CreateCategory,
} from "@/crud/DTOs";
import { redirect, useParams, useRouter } from "next/navigation";
import { CreateImageDTO } from "@/crud/DTOs";
import Editor from "../RichTextEditor";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import DateInput from "../DateInput";
import LoadingDots from "../shared/loading-dots";
import CategoryForm from "../CategoryForm";
import DynamicInput from "../DynamicInput";
import {
  SoftwareProductFormSchema,
  SubscriptionModelSchema,
} from "./formSchema";
import { extractUUID, seoUrl, stripSlashes } from "@/lib/utils";
import { ZodNullable } from "zod";
import { SoftwareProductSchema } from "../zodSchemas";
import JsonInput from "../shared/JsonInput";
import example from "./example.json";

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
  // console.log(initial);
  const [loading, setLoading] = useState(false);

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
        subscriptionModel: undefined,
      },
    );
  const [rawJson, setRawJson] = useState(
    JSON.stringify(SoftwareProductSchema.parse(softwareProductData), null, 2),
  );

  const { toast } = useNotify();

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

      router.push(`/dashboard/softwares/view/${resJson.data.id}`);
    } else {
      toast(`${resJson.message}`, {
        autoClose: 5000,
        type: "error",
      });
    }

    setLoading(false);
  };

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
  }

  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = SoftwareProductSchema.safeParse(newData);
      if (!valid.success)
        for (const e of valid.error.errors) {
          toast(`${e.path} ${e.message}`, {
            type: "error",
          });
        }
      else {
        console.log(valid.data);
        setSoftwareProductData((prev) => ({
          ...prev,
          ...(valid.data as CreateSoftwareProductDTO),
          blog: valid.data.blogLink
            ? {
                id: extractUUID(valid.data.blogLink),
                title: valid.data.blogLink,
              }
            : prev.blog,
        }));
      }
    } catch (error) {
      console.log("invalid JSON", error);
      toast(`Invalid Json`, {
        type: "error",
      });
    }
  }

  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen  items-center justify-center bg-gray-100 dark:bg-gray-700 dark:text-gray-800 ">
      <div className="w-full max-w-3xl rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Software Product
        </h2>
        <form onSubmit={handleSubmit} className="h-fit">
          <JsonInput
            rawJson={rawJson}
            parseJson={parseJson}
            setRawJson={setRawJson}
            example={JSON.stringify(example, null, 2)}
          />
          <DynamicInput
            onChange={(e) =>
              setSoftwareProductData((prev) => ({
                title: e.title,
                subTitle: e.subTitle,
                description: e.description,
                link: e.link,
                githubLink: e.githubLink,
                pricing: e.pricing,
                status: e.status,
                blog:
                  e.blogLink.length > 0
                    ? {
                        id: extractUUID(e.blogLink),
                        title: prev.blog?.title as string,
                      }
                    : undefined,
                images: prev.images,
                tags: prev.tags,
                category: prev.category,
              }))
            }
            schema={SoftwareProductFormSchema}
            defaultValue={useMemo(
              () => ({
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
              }),
              [softwareProductData],
            )}
          />

          {softwareProductData.pricing === "Subscription" && (
            <div className="mb-4">
              <DynamicInput
                defaultValue={softwareProductData.subscriptionModel ?? []}
                onChange={(e) =>
                  setSoftwareProductData((prev) => ({
                    ...prev,
                    subscriptionModel: e,
                  }))
                }
                schema={SubscriptionModelSchema}
              />
            </div>
          )}

          <div className="mb-4">
            <CategoryForm
              onChange={(category) => {
                setSoftwareProductData((prev) => ({
                  ...prev,
                  category: category,
                }));
              }}
              action={"software"}
              selected={
                softwareProductData.category as {
                  id: string;
                  name: string;
                  parentId: string | null;
                }
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
