"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateImageDTO, GptCategory } from "@/crud/DTOs";
import { CreateGptPromptDTO } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useEffect, useState } from "react";
import Notification, {
  NotificationType,
  toast,
} from "@/components/Notification";
import ListInput from "../ListInput";
import { redirect, useRouter } from "next/navigation";
import { JSONSchemaType, SomeJSONSchema } from "ajv/dist/types/json-schema";
import {
  GptConversationStartersSchema,
  GptStepsSchema,
  GptVariablesSchema,
  sysCommandsSchema,
} from "@/crud/jsonSchemas";
import Tooltip from "../shared/ToolTip";
import { InfoIcon } from "lucide-react";
import Ajv from "ajv";
import DynamicInput, { FormSchema } from "../DynamicInput";
import { conversationStartersProperties, stepProperties, sysCommandProperties, variablesNeededProperties } from "./formSchema";
import GptCategoryForm from "./CategoryForm";




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
  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyType, setNotifyType] = useState<"success" | "fail">("fail");
  const [currentCategory, setCurrentCategory] = useState(-1);

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
      image: undefined,
      botUrl: "",
    },
  );

  useEffect(() => {
      if(initial && initial.category && initial.category.parent) {
        let cat = categories.findIndex((c) => c.id === initial.category?.parent?.id);
        setCurrentCategory(cat);
      }
  }, [categories, initial]);

  const [jsonValues, setJsonValues] = useState({
    conversationStarters:
      initial && initial.conversationStarters
        ? JSON.stringify(initial.conversationStarters, null, 2)
        : "",
    steps:
      initial && initial.steps ? JSON.stringify(initial.steps, null, 2) : "",
    sysCommands:
      initial && initial.sysCommands
        ? JSON.stringify(initial.sysCommands, null, 2)
        : "",
    variables:
      initial && initial.variables
        ? JSON.stringify(initial.variables, null, 2)
        : "",
  });

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
  };

  function message(type: NotificationType, message: string) {
    toast(message, {
      type,
    });
  }
  function handleChangedImage(images: CreateImageDTO[], tags: CreateTagDTO[]) {
    setGptPromptData((prevData) => ({
      ...prevData,
      image: images[0],
      tags,
    }));
  }

  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setGptPromptData((prevData) => ({
      ...prevData,
      [name]: value === "" ? "" : Number(value),
    }));
  }

  function handleListInput(name: string, value: string[]) {
    setGptPromptData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleJsonInputs(name: string, value: string, schema: any) {
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    try {
      const newData = JSON.parse(value);

      const valid = validate(newData);

      if (!valid) {
        toast(
          `${validate.errors
            ?.map(
              (err) =>
                `${err.instancePath} ${err.message} (${err.schemaPath}) `,
            )
            .join("\n")}`,
          {
            type: "error",
          },
        );
      } else {
        setGptPromptData((prevData) => ({
          ...prevData,
          [name]: newData,
        }));

        toast("Parsed Sucessfully", { type: "success" });
      }
    } catch (error) {
      toast("Invalid JSON: " + error, {
        type: "error",
      });
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
              value={gptPromptData.prompt as string}
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
              value={gptPromptData.model as string}
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
              value={gptPromptData.botUrl}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <DynamicInput schema={sysCommandProperties} onChange={(data) => (setGptPromptData((prev) => ({ ...prev, sysCommands: data })))} defaultValue={gptPromptData.sysCommands} />
          </div>
          <div>
            <DynamicInput schema={stepProperties} defaultValue={gptPromptData.steps} onChange={(data) => (setGptPromptData((prev) => ({ ...prev, steps: data })))} />
          </div>
          <div>
            <DynamicInput schema={variablesNeededProperties} defaultValue={gptPromptData.variables} onChange={(data) => (setGptPromptData((prev) => ({ ...prev, variables: data })))} />
          </div>
          <div>
            <DynamicInput schema={conversationStartersProperties} defaultValue={gptPromptData.conversationStarters} onChange={(data) => (setGptPromptData((prev) => ({ ...prev, conversationStarters: data })))} />
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
                value={gptPromptData.frequency_penalty}
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
                value={gptPromptData.best_of}
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
                value={gptPromptData.presence_penalty}
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
                value={gptPromptData.temperature}
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
                value={gptPromptData.costPerToken}
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
                value={gptPromptData.max_tokens}
                onChange={handleNumberInput}
              />
            </div>
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
                    value={gptPromptData.category?.name ?? -1}
                    onChange={(e) =>
                      setGptPromptData((prev) => ({
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
          <GptCategoryForm
            onAddCategory={(newCat) => (categories = [...categories, newCat])}
          />
          <AddImagesAndTags
            maxImages={1}
            onImagesAndTagsChange={handleChangedImage}
            maxTags={10}
          ></AddImagesAndTags>

          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {method === "POST" ? "Create" : "Update"} GPT Prompt
          </button>
        </form>
      </div>
      <Notification />
    </div>
  );
};

export default GptPromptForm;
