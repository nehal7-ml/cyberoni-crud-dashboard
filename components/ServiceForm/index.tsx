"use client";

import {
  CreateServiceDTO,

} from "@/crud/DTOs";
import React, { useEffect, useState } from "react";

import  {
  NotificationType,
  useNotify,
} from "@/components/Notification";

import { useRouter } from "next/navigation";
import LoadingDots from "../shared/loading-dots";
import example from "./example.json";
import { ServiceSchema } from "../zodSchemas";
import JsonInput from "../shared/JsonInput";
import DynamicInput from "../DynamicInput";
import {  ServiceFormSchema } from "./formSchema";

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
  const { toast } = useNotify();
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
      faqs: [],
    },
  );

  const [rawJson, setRawJson] = useState(
    JSON.stringify(ServiceSchema.parse(serviceData), null, 2),
  );



  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let valid =  ServiceSchema.safeParse(serviceData);
    if(!valid.success){
        toast(`invalid Body`, {type: 'error'})
        return 
    }
    // Send the userData to your backend for creating the user
    const res = await fetch(action, {
      method,
      body: JSON.stringify(serviceData),
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


  

  useEffect(() => {
    if (initial) setServiceData(initial as CreateServiceDTO);
  }, [initial]);

  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);

      const valid = ServiceSchema.safeParse(newData);
      if (!valid.success) {
        for (const e of valid.error.errors) {
          toast(`${e.path} ${e.message}`, { type: "error" });
        }
      } else {

        console.log(serviceData, valid.data);
        setServiceData((prev) => ({
          ...prev,
          ...(valid.data as CreateServiceDTO),
        }));
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
          <JsonInput
            rawJson={rawJson}
            parseJson={parseJson}
            setRawJson={setRawJson}
            example={JSON.stringify(example, null, 2)}
          />
          <DynamicInput
            defaultValue={serviceData}
            schema={ServiceFormSchema}
            onChange={(e) => setServiceData(e)}
          />
          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {" "}
            {loading ? <LoadingDots /> : null}
            {method === "PUT" ? "Update Service" : "Create Service"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ServiceForm;
