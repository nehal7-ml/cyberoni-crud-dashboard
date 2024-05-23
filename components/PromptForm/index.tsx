"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateImageDTO, GptCategory } from "@/crud/DTOs";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useEffect, useState } from "react";
import Notification, {
  NotificationType,
  useNotify,
} from "@/components/Notification";
import ListInput from "../ListInput";
import { redirect, useRouter } from "next/navigation";
import { JSONSchemaType, SomeJSONSchema } from "ajv/dist/types/json-schema";

import addFormats from "ajv-formats";
import DynamicInput, { FormSchema } from "../DynamicInput";
import {
  conversationStartersProperties,
  stepProperties,
  sysCommandProperties,
  variablesNeededProperties,
} from "./formSchema";
import LoadingDots from "../shared/loading-dots";
import CategoryForm from "../CategoryForm";
import { GptPromptSchema } from "../zodSchemas";

const GptPromptForm = ({
  method,
  categories,
  action,
  initial,
}: {
  categories: {
    name: string;
    id: string;
    children: { name: string; id: string }[];
  }[];
  method: "POST" | "PUT";
  action: string;
  initial?: CreateGptPromptDTO;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useNotify();
  const [currentCategory, setCurrentCategory] = useState(-1);
  const [categoryList, setCategoryList] = useState<GptCategory[]>(categories);
  const [gptPromptData, setGptPromptData] = useState<CreateGptPromptDTO>(
    initial || {
      description: "",
      category: undefined,
      title: "",
      prompt: "",
      model: "",
      temperature: 0,
      max_tokens: 0,
      top_p: 0,
      best_of: 0,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: [],
      timesUsed: 0,
      timesIntegrated: 0,
      costPerToken: 0,
      profitMargin: 0,
      seed: 0,
      conversationStarters: [],
      startPhrase: "",
      steps: [],
      stream: true,
      sysCommands: {},
      toolChoice: "",
      tools: [],
      variables: [],
      tags: [],
      image: [],
      botUrl: "",
    },
  );

  const [rawJson, setRawJson] = useState(
    JSON.stringify(gptPromptData, null, 2),
  );

  useEffect(() => {
    if (initial && initial.category && initial.category.parent) {
      let cat = categoryList.findIndex(
        (c) => c.id === initial.category?.parent?.id,
      );
      setCurrentCategory(cat);
    }
  }, [categories, categoryList, initial]);

  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = GptPromptSchema.safeParse(newData);
      if (!valid.success)
        for (const e of valid.error.errors) {
          toast(`${e.path} ${e.message}`, {
            type: "error",
          });
        }
      else {
        setGptPromptData((prev) => ({ ...prev, ...newData }))
      }
    } catch (error) {
      console.log("invalid JSON", error);
      toast(`Invalid Json`, {
        type: "error",
      });
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setGptPromptData((prevData) => ({
      ...prevData,
      [name]: value,
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

    console.log(gptPromptData);
    const res = await fetch(`${action}`, {
      method,
      body: JSON.stringify(gptPromptData),
      headers,
    });
    let resJson = await res.json();
    console.log(res.status);
    if (res.status == 200) {
      message("success", resJson.message);
      router.replace(`/dashboard/prompts/view/${resJson.data.id}`);
    } else {
      message("error", resJson.message);
    }
    setLoading(false);
  };

  function message(type: NotificationType, message: string) {
    toast(message, {
      type,
    });
  }
  function handleChangedImage(images: CreateImageDTO[], tags: CreateTagDTO[]) {
    setGptPromptData((prevData) => ({
      ...prevData,
      image: images,
      tags,
    }));
  }

  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setGptPromptData((prevData) => ({
      ...prevData,
      [name]: isNaN(Number(value)) ? 0 : Number(value),
    }));
  }

  function handleListInput(name: string, value: string[]) {
    setGptPromptData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleCategoryChange(
    category: GptCategory,
    index: number,
    action: "add" | "update" | "delete",
  ) {
    if (action === "add") {
      // Add the category only if it doesn't already exist in the list
      setCategoryList((prev) =>
        prev.find((c) => c.id === category.id) ? prev : [...prev, category],
      );
      setCurrentCategory(-1);
    } else if (action === "update") {
      // Update the category based on id
      const newCatList = categoryList;
      newCatList[index] = category;
      setCurrentCategory(-1);
      setCategoryList(newCatList);
    } else if (action === "delete") {
      // Delete the category based on id (more secure)
      setCurrentCategory(-1);
      const newCatList = categoryList;
      newCatList.splice(index, 1);
      setCategoryList(newCatList);
    } else {
      // Optionally handle unexpected actions
      console.error("Unhandled action:", action);
    }
  }

  return (
    <div className="light:bg-gray-100 light:text-black flex max-h-screen items-center justify-center p-2 dark:bg-gray-700 dark:text-gray-800">
      <div className="m-1 h-full max-h-screen w-full  overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} GPT Prompt
        </h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <input
              type="text"
              name="title"
              className="mt-1 w-full rounded border p-2"
              value={gptPromptData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <input
              type="text"
              name="description"
              className="mt-1 w-full rounded border p-2"
              value={gptPromptData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Prompt:
            </label>
            <textarea
              name="prompt"
              rows={3}
              className="mt-1 w-full rounded border p-2"
              value={gptPromptData.prompt ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Model:
            </label>

            <select
              name="status"
              className="mt-1 w-full rounded border p-2"
              value={gptPromptData.model ?? ""}
              onChange={handleInputChange}
            >
              <option value={"gpt-3.5-turbo"}>gpt-3.5-turbo</option>
              <option value={"gpt-4-32k"}>gpt-4-32k</option>
              <option value={"gpt-4-1106-preview"}>gpt-4-1106-preview</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              GPT url:
            </label>
            <input
              type="url"
              name="botUrl"
              className="mt-1 w-full rounded border p-2"
              value={gptPromptData.botUrl ?? ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <DynamicInput
              schema={sysCommandProperties}
              onChange={(data) =>
                setGptPromptData((prev) => ({ ...prev, sysCommands: data }))
              }
              defaultValue={gptPromptData.sysCommands}
            />
          </div>
          <div>
            <DynamicInput
              schema={stepProperties}
              defaultValue={gptPromptData.steps}
              onChange={(data) =>
                setGptPromptData((prev) => ({ ...prev, steps: data }))
              }
            />
          </div>
          <div>
            <DynamicInput
              schema={variablesNeededProperties}
              defaultValue={gptPromptData.variables}
              onChange={(data) =>
                setGptPromptData((prev) => ({ ...prev, variables: data }))
              }
            />
          </div>
          <div>
            <DynamicInput
              schema={conversationStartersProperties}
              defaultValue={gptPromptData.conversationStarters}
              onChange={(data) =>
                setGptPromptData((prev) => ({
                  ...prev,
                  conversationStarters: data,
                }))
              }
            />
          </div>

          <div className="mb-4">
            <ListInput
              initial={gptPromptData.stop}
              label="Stop sequences (comma separated):"
              onChange={(value) => handleListInput("stop", value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-1 ">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                frequency penalty :
              </label>
              <input
                type="number"
                name="frequency_penalty"
                className="mt-1 w-full rounded border p-2"
                value={gptPromptData.frequency_penalty.toString() ?? ""}
                onChange={handleNumberInput}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                best of (number of completions):
              </label>
              <input
                type="number"
                name="best_of"
                className="mt-1 w-full rounded border p-2"
                value={gptPromptData.best_of.toString() ?? ""}
                onChange={handleNumberInput}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                presence penalty:
              </label>
              <input
                type="number"
                name="presence_penalty"
                className="mt-1 w-full rounded border p-2"
                value={gptPromptData.presence_penalty.toString() ?? ""}
                onChange={handleNumberInput}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                temperature:
              </label>
              <input
                type="number"
                name="temperature"
                className="mt-1 w-full rounded border p-2"
                value={gptPromptData.temperature.toString() ?? ""}
                onChange={handleNumberInput}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                cost Per Token:
              </label>
              <input
                type="number"
                name="costPerToken"
                className="mt-1 w-full rounded border p-2"
                value={gptPromptData.costPerToken.toString() ?? ""}
                onChange={handleNumberInput}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                max tokens:
              </label>
              <input
                type="number"
                name="max_tokens"
                className="mt-1 w-full rounded border p-2"
                value={gptPromptData.max_tokens.toString()}
                onChange={handleNumberInput}
              />
            </div>
          </div>

          <div className="mb-4">
            <CategoryForm
              onChange={(category) => {
                setGptPromptData((prev) => ({ ...prev, category }));
              }}
              action={"prompt"}
              selected={
                gptPromptData.category as {
                  id: string;
                  name: string;
                  parentId: string | null;
                }
              }
            />
          </div>
          <AddImagesAndTags
            images={gptPromptData.image}
            tags={gptPromptData.tags}
            maxImages={1}
            onImagesAndTagsChange={handleChangedImage}
            maxTags={10}
          ></AddImagesAndTags>

          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? <LoadingDots /> : null}
            {method === "POST" ? "Create" : "Update"} GPT Prompt
          </button>
        </form>
      </div>
    </div>
  );
};

export default GptPromptForm;
