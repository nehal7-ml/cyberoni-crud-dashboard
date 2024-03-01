"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateImageDTO } from "@/crud/DTOs";
import { CreateSubServiceDTO, Discount } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { useEffect, useState } from "react";
import ListInput from "../ListInput";
import { PricingModel } from "@prisma/client";
import Ajv from "ajv";
import { SubServiceSchema } from "@/crud/jsonSchemas";

const ajv = new Ajv();
//addFormats(ajv)
const validate = ajv.compile(SubServiceSchema);

function SubServiceForm({
  subServices,
  current,
  handleSubServiceChange,
}: {
  subServices: CreateSubServiceDTO[];
  current: number;
  handleSubServiceChange: (subservice: CreateSubServiceDTO[]) => void;
}) {
  const [subServiceData, setSubServiceData] = useState<CreateSubServiceDTO>(
    current >= 0
      ? subServices[current]
      : {
          description: "",
          title: "",
          complexity: 0,
          department: "",
          estimated_hours_times_fifty_percent: 0,
          estimated_hours_times_one_hundred_percent: 0,
          pricingModel: PricingModel.DEFAULT,
          overheadCost: 0,
          serviceDeliverables: [],
          serviceUsageScore: 0,
          skillLevel: "",
          tags: [],
          image: { src: "" },
        },
  );
  const [rawJson, setRawJson] = useState(
    JSON.stringify(subServiceData, null, 2),
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setSubServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  function handleChangedImage(image: CreateImageDTO[], tags: CreateTagDTO[]) {
    setSubServiceData((prevData) => ({
      ...prevData,
      image: image[0],
      tags,
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send the productData to your backend for creating the product

    if (current >= 0) {
      subServices[current] = subServiceData;
      handleSubServiceChange(subServices);
    } else {
      handleSubServiceChange([...subServices, subServiceData]);
    }

    (e.target as HTMLFormElement).reset();

    setSubServiceData({
      description: "",
      title: "",
      complexity: 0,
      department: "",
      estimated_hours_times_fifty_percent: 0,
      estimated_hours_times_one_hundred_percent: 0,
      pricingModel: PricingModel.DEFAULT,
      overheadCost: 0,
      serviceDeliverables: [],
      serviceUsageScore: 0,
      skillLevel: "",
      tags: [],
      image: { src: "" },
    });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setSubServiceData({
      ...subServiceData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  function handleListChange(name: string, value: string[]) {
    setSubServiceData({
      ...subServiceData,
      [name]: value,
    });
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
          console.log(newData);
          for (let key of Object.keys(subServiceData)) {
            setSubServiceData((prev) => ({ ...prev, [key]: newData[key] }));
          }
        }
      }
    } catch (error) {
      console.log("invalid JSON", error);
      alert("Error parsing JSON" + error);
    }
  }

  useEffect(() => {
    if (subServices[current] ?? false) {
      setSubServiceData(subServices[current]);
    }
  }, [current, subServices]);
  return (
    <>
      <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
        <div className="absolute inset-0 z-10 h-full w-screen bg-black bg-opacity-50 backdrop-blur-lg"></div>

        <div className=" fixed top-0 z-50 max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">
            {current >= 0 ? "Update" : "Add"} Sub Service
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
                value={subServiceData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Department:
              </label>
              <input
                type="text"
                name="department"
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.department}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Estimated time for 50% (number of Hours):
              </label>
              <input
                type="number"
                name="estimated_hours_times_fifty_percent"
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.estimated_hours_times_fifty_percent}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Estimated time for 100% (number of hours):
              </label>
              <input
                type="number"
                name="estimated_hours_times_one_hundred_percent"
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.estimated_hours_times_one_hundred_percent}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Over-head Cost ($):
              </label>
              <input
                type="number"
                name="overheadCost"
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.overheadCost}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Service Usage Score (out of 100):
              </label>
              <input
                type="number"
                name="serviceUsageScore"
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.serviceUsageScore}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Complexity (out of 10):
              </label>
              <input
                type="number"
                name="complexity"
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.complexity}
                onChange={handleNumberInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                name="description"
                rows={4} // Adjust the number of rows as needed
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <ListInput
                label="Service Deliverables"
                initial={subServiceData.serviceDeliverables}
                onChange={(values) =>
                  handleListChange("serviceDeliverables", values)
                }
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Pricing Model:
              </label>
              <select
                name="pricingModel"
                className="mt-1 w-full rounded border p-2"
                value={subServiceData.pricingModel}
                onChange={handleInputChange}
              >
                {Object.keys(PricingModel).map((pricingModel, index) => (
                  <option key={index} value={pricingModel}>
                    {pricingModel}
                  </option>
                ))}
              </select>
            </div>
            <AddImagesAndTags
              maxImages={1}
              onImagesAndTagsChange={handleChangedImage}
            ></AddImagesAndTags>
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {current >= 0 ? "Update" : "Add"} Sub Service
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SubServiceForm;
