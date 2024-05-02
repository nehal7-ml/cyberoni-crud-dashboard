"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateImageDTO } from "@/crud/DTOs";
import {
  CreateServiceDTO,
  CreateServiceDescription,
  DisplayServiceDTO,
} from "@/crud/DTOs";
import { ServiceSchema } from "@/crud/jsonSchemas";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useEffect, useState } from "react";
import { Edit, PlusCircle, X } from "lucide-react";
import { CreateSubServiceDTO } from "@/crud/DTOs";
import Notification, {
  NotificationType,
  useNotify,
} from "@/components/Notification";
import CreateSubService from "./SubServiceForm";
import Image from "next/image";
import DescriptionForm from "./DescriptionSection";
import ListInput from "../ListInput";
import { useRouter } from "next/navigation";
import Ajv from "ajv";
import LoadingDots from "../shared/loading-dots";

const ajv = new Ajv();
//addFormats(ajv)
const validate = ajv.compile(ServiceSchema);

function ServiceForm({
  method,
  action,
  initial,
}: {
  method: "POST" | "PUT";
  action: string;
  initial?: CreateServiceDTO;
}) {
  const [loading, setLoading] = useState(false);
  
  const [showDialog, setShowDialog] = useState(false);
  const {toast} = useNotify();
  const [serviceData, setServiceData] = useState<CreateServiceDTO>(
    initial || {
      hourlyRate: 0,
      featured: false,
      previewContent: "",
      skillsUsed: [],
      title: "",
      htmlEmbed: "",
      valueBrought: [],
      SubServices: [],
      ServiceDescription: [],
      tags: [],
      image: undefined,
    },
  );
  const [editSubservice, setEditSubservice] = useState<number>(-1);

  const [descriptionForm, setDescriptionForm] = useState(false);
  const [rawJson, setRawJson] = useState(JSON.stringify(serviceData, null, 2));
  const [json, setJson] = useState<{ [key: string]: any }>({});

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setServiceData({
      ...serviceData,
      [name]: Number(value),
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    console.log(name, ":   ", typeof value);
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  function handleChangedImage(image: CreateImageDTO[], tags: CreateTagDTO[]) {
    setServiceData((prevData) => ({
      ...prevData,
      image: image[0],
      tags,
    }));
  }
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
    const res = await fetch(action, {
      method,
      body: JSON.stringify(serviceData),
      headers,
    });
    let resJson = await res.json();

    if (res.status == 200) {
      message("success", resJson.message);
      router.replace(`/dashboard/services/view/${resJson.data.id}`);
    } else {
      message("error", resJson.message);
    }
    setLoading(false);

  };

  function message(type: NotificationType, message: string) {
    toast(message, { type });
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setServiceData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  function handleSubServiceChange(subServices: CreateSubServiceDTO[]) {
    setServiceData((prevData) => ({
      ...prevData,
      SubServices: subServices,
    }));

    setShowDialog(false);
  }

  function handleRemoveSubService(subServiceToRemove: CreateSubServiceDTO) {
    if (subServiceToRemove.id) {
      setServiceData((prevData) => ({
        ...prevData,
        SubServices: prevData.SubServices?.filter(
          (subService) => subService.id !== subServiceToRemove.id,
        ),
      }));
    } else {
      setServiceData((prevData) => ({
        ...prevData,
        SubServices: prevData.SubServices?.filter(
          (subService) => subService.title !== subServiceToRemove.title,
        ),
      }));
    }
  }

  function handleDescritionChange(description: CreateServiceDescription) {
    setServiceData((prev) => ({
      ...prev,
      ServiceDescription: [...prev.ServiceDescription, description],
    }));

    setDescriptionForm(false);
  }

  useEffect(() => {
    if (initial) setServiceData(initial as CreateServiceDTO);
  }, [initial]);

  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = validate(newData);
      if (!valid) {
        toast(
          validate.errors
            ?.map(
              (err) =>
                `${err.instancePath} ${err.message} (${err.schemaPath}) `,
            )
            .join("\n") as string,
          {
            type: "error",
          },
        );
      } else {
        setJson(newData);
        if (Object.keys(newData).length > 0) {
          console.log(newData);
          for (let key of Object.keys(serviceData)) {
            setServiceData((prev) => ({ ...prev, [key]: newData[key] }));
          }
        }
      }
    } catch (error) {
      console.log("invalid JSON", (error as Error).name);
      toast("Error parsing JSON" + (error as Error).name, { type: "error" });
    }
  }

  return (
    <div className="light:bg-gray-100 light:text-black container mx-auto flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="max-h-screen w-full max-w-4xl overflow-y-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {" "}
          {method === "PUT" ? "Update" : "Create"} Service
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
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
              value={serviceData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Featured:
              <input
                type="checkbox"
                name="featured"
                className="ml-2"
                checked={serviceData.featured}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Hourly Rate:
            </label>
            <input
              type="number"
              name="hourlyRate"
              className="mt-1 w-full rounded border p-2"
              value={serviceData.hourlyRate == 0 ? "" : serviceData.hourlyRate}
              onChange={handleNumberInputChange}
              required
            />
          </div>

          <div className="mb-4 h-fit   flex-grow">
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            {serviceData.ServiceDescription?.map((section, index) => {
              return (
                <div
                  className={`my-4 flex w-full gap-5 border-2 border-dotted p-2 ${section.imageOnLeft ? "flex-row" : "flex-row-reverse"}`}
                  key={index}
                >
                  <div className="flex justify-end ">
                    <button
                      className="mx-10   my-3 self-end"
                      onClick={() =>
                        setServiceData((prev) => ({
                          ...prev,
                          ServiceDescription: prev.ServiceDescription.filter(
                            (desc, ind) => ind !== index,
                          ),
                        }))
                      }
                    >
                      <X color="red" className="cursor-pointer" />
                    </button>
                  </div>
                  <div className="w-1/3 ">
                    <Image
                      src={section.image.src}
                      alt={`${index}-section`}
                      height={500}
                      width={500}
                    ></Image>
                  </div>
                  <div className="w-2/3 justify-evenly">
                    <div className="text-3xl font-bold">{section.title}</div>
                    <div>{section.content}</div>
                  </div>
                </div>
              );
            })}

            <div className="flex w-full items-end justify-center  p-2">
              <button
                type="button"
                onClick={() => {
                  setDescriptionForm(true);
                }}
                className="rounded-full bg-blue-500 p-2 hover:bg-blue-600 hover:shadow-lg"
              >
                <PlusCircle className=" text-white" />
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Preview Content:
            </label>
            <textarea
              name="previewContent"
              rows={4} // Adjust the number of rows as needed
              className="mt-1 w-full rounded border p-2"
              value={serviceData.previewContent}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <ListInput
              label="Value Brought"
              initial={serviceData.valueBrought}
              onChange={(values) =>
                setServiceData((prev) => ({ ...prev, valueBrought: values }))
              }
            />
          </div>
          <div className="mb-4">
            <ListInput
              label="Skills used"
              initial={serviceData.skillsUsed}
              onChange={(values) =>
                setServiceData((prev) => ({ ...prev, skillsUsed: values }))
              }
            />
          </div>

          <div className="my-4 flex flex-wrap gap-10">
            {serviceData.SubServices?.map((subService, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center rounded bg-blue-200 p-2 text-blue-800"
                >
                  <button
                    type="button"
                    className="flex gap-2"
                    onClick={() => {
                      setEditSubservice(index);
                      setShowDialog(true);
                    }}
                  >
                    <span>{subService.title}</span>
                    <Edit />
                  </button>
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                    onClick={() => handleRemoveSubService(subService)}
                  >
                    X
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setEditSubservice(-1);

                setShowDialog(!showDialog);
              }}
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add Subservice
            </button>
          </div>

          <AddImagesAndTags
            maxImages={1}
            onImagesAndTagsChange={handleChangedImage}
            images={serviceData?.image ? [serviceData?.image] : []}
            tags={serviceData?.tags}
          ></AddImagesAndTags>
          <button
            disabled={loading}
            type="submit"
            className="w-full flex justify-center items-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? <LoadingDots /> : null}

            {method === "PUT" ? "Update Service" : "Create Service"}
          </button>
        </form>

        {showDialog && (
          <div
            className={`fixed left-0 top-0 flex w-screen flex-col justify-center ${showDialog ? "" : " hidden"}`}
          >
            <div className="z-30 flex justify-end ">
              <button
                className="mx-10   my-3 self-end"
                onClick={() => setShowDialog(!showDialog)}
              >
                <X color="red" className="cursor-pointer" />
              </button>
            </div>
            <CreateSubService
              current={editSubservice}
              subServices={serviceData.SubServices ?? []}
              handleSubServiceChange={handleSubServiceChange}
            ></CreateSubService>
          </div>
        )}
        <div
          className={`fixed left-0 top-0 flex w-screen flex-col justify-center ${descriptionForm ? "" : " hidden"}`}
        >
          <div className="z-30 flex justify-end">
            <button
              type="button"
              className="mx-10 my-3 self-end"
              onClick={() => setDescriptionForm(false)}
            >
              <X color="red" className="cursor-pointer" />
            </button>
          </div>
          <DescriptionForm handleDescritionChange={handleDescritionChange} />
        </div>
      </div>
    </div>
  );
}

export default ServiceForm;
