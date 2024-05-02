"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateEventDTO, CreateImageDTO } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import { EventStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Notification, {
  NotificationType,
  useNotify,
} from "@/components/Notification";
import { redirect, useRouter } from "next/navigation";
import LoadingDots from "../shared/loading-dots";
import { revalidatePath } from "next/cache";

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
  const toast = useNotify();
  const [eventData, setEventData] = useState<CreateEventDTO>(
    initial || {
      name: "",
      date: new Date(),
      eventLink: "",
      description: "",
      isVirtual: false,
      location: "",
      status: "UPCOMING",
      image: [],
      tags: [],
    },
  );
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

  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Event
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name :
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 w-full rounded border p-2"
              value={eventData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Date:
            </label>
            <input
              type="date"
              name="date"
              className="mt-1 w-full rounded border p-2"
              value={date}
              required
              onChange={(event) => {
                setDate(event.target.value);
                setEventData((prev) => ({
                  ...prev,
                  date: new Date(event.target.value),
                }));
              }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              name="status"
              className="mt-1 w-full rounded border p-2"
              value={eventData.status}
              onChange={handleInputChange}
              required
            >
              {Object.values(EventStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Event Link:
            </label>
            <input
              type="url"
              name="eventLink"
              className="mt-1 w-full rounded border p-2"
              value={eventData.eventLink}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Is Virtual:
              <input
                type="checkbox"
                name="isVirtual"
                className="ml-2 "
                checked={eventData.isVirtual}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              name="description"
              rows={4} // Adjust the number of rows as needed
              className="mt-1 w-full rounded border p-2"
              value={eventData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Location :
            </label>
            <input
            type="text"
            name="location"
            placeholder="Google Maps URL"
            title="Enter a valid Google Maps URL"
            className="mt-1 w-full rounded border p-2 invalid:border-red-400 invalid:text-red-400 invalid:outline-red-500 invalid:ring-red-500"
            value={eventData.location as string}
            onChange={handleInputChange}
              pattern="^https?:\/\/((www\.)?google\.com\/maps\/(embed\?|search\?)|maps\.app\.goo\.gl\/).+$"
          />
          </div>
          <AddImagesAndTags
            images={eventData.image}
            maxImages={1}
            onImagesAndTagsChange={handleChangedImage}
          ></AddImagesAndTags>
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
      <Notification />
    </div>
  );
};

export default EventForm;
