"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateEventDTO, CreateImageDTO } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import { EventStatus } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import Notification, {
  NotificationType,
  useNotify,
} from "@/components/Notification";
import { redirect, useRouter } from "next/navigation";
import LoadingDots from "../shared/loading-dots";
import { revalidatePath } from "next/cache";
import JsonInput from "../shared/JsonInput";
import { EventSchema } from "../zodSchemas";
import example from './example.json'
import DynamicInput from "../DynamicInput";
import eventFormSchema from "./formSchema";
const EventForm = ({
  method,
  action,
  initial,
}: {
  method: "POST" | "PUT";
  action: string;
  initial?: CreateEventDTO;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useNotify();
  const [eventData, setEventData] = useState<CreateEventDTO>(
    initial || {
      name: "",
      date: new Date(),
      eventLink: "",
      description: "Event Description",
      isVirtual: false,
      location: "",
      status: "UPCOMING",
      image: [],
      tags: [],
    },
  );

  const defaultJSON = useMemo(() => {
    if (method === 'POST') {
      return JSON.stringify(eventData, null, 2)

    }
    else return JSON.stringify(EventSchema.parse(eventData), null, 2)
  }, [eventData, method]);

  const [rawJson, setRawJson] = useState(defaultJSON);
  const [date, setDate] = useState(
    (initial?.date || new Date()).toISOString().split("T")[0],
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "date") {
      console.log(new Date(value));
      setEventData((prevData) => ({
        ...prevData,
        date: new Date(value),
      }));
    }
    if (name === "isVirtual") {
      setEventData((prevData) => ({
        ...prevData,
        isVirtual: value === "on",
      }));
    } else {
      setEventData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);

    e.preventDefault();
    console.log(eventData);
    let valid = EventSchema.safeParse(eventData);

    if (!valid.success) {
      for (const e of valid.error.errors) {
        toast(`${e.path} ${e.message}`, {
          type: 'error'
        })

      }
      setLoading(false);
      return
    }

    const res = await fetch(`${action}`, {
      method,
      body: JSON.stringify(eventData),
    });
    let resJson = await res.json();

    if (res.status == 200) {
      message("success", resJson.message);

      router.replace(`/dashboard/events/view/${resJson.data.id}`);

    } else {
      message("error", resJson.message);
    }
    setLoading(false);

  };

  function message(type: NotificationType, message: string) {
    toast(`${message}`, {
      autoClose: 5000,
      type: type,
    });
  }

  function handleChangedImage(images: CreateImageDTO[], tags: CreateTagDTO[]) {
    setEventData((prevData) => ({
      ...prevData,
      image: images,
      tags,
    }));
  }

  function parseJson(json: string) {
    try {
      const newData = JSON.parse(json);
      const valid = EventSchema.safeParse(newData)

      if (!valid.success) {
        for (const e of valid.error.errors) {
          toast(`${e.path} ${e.message}`, {
            type: "error",
          });
        }
      } else {

        setEventData(valid.data)
      }

    } catch (error) {
      toast("Error parsing JSON: " + error, { type: 'error' })
    }
  }

  function handleDataChange(data: CreateEventDTO) {
    setEventData(data)
  }
  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Event
        </h2>
        <form onSubmit={handleSubmit}>

          <JsonInput rawJson={rawJson} setRawJson={setRawJson} example={JSON.stringify(example, null, 2)} parseJson={parseJson} />
          <DynamicInput defaultValue={eventData} onChange={handleDataChange} schema={eventFormSchema} />
          <button
            disabled={loading}
            type="submit"
            className="w-full flex justify-center items-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? <LoadingDots /> : null}
            {method === "POST" ? "Create" : "Update"} Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
