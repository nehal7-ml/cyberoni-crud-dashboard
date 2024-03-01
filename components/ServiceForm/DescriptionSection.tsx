"use client";
import { Image, ServiceDescription } from "@prisma/client";
import AddImage from "../AddImagesAndTags/AddImage";
import React, { useRef, useState } from "react";
import { CreateImageDTO } from "@/crud/DTOs";
import { CreateServiceDescription } from "@/crud/DTOs";

function DescriptionForm({
  initial,
  handleDescritionChange,
}: {
  initial?: ServiceDescription & { image: Image };
  handleDescritionChange: (description: CreateServiceDescription) => void;
}) {
  const form = useRef<HTMLFormElement>(null);
  const [description, setDescription] = useState<CreateServiceDescription>(
    initial || {
      content: "",
      title: "",
      imageOnLeft: false,
      image: { src: "" },
    },
  );

  function handleChangedImage(image: CreateImageDTO[]) {
    setDescription((prevData) => ({
      ...prevData,
      image: image[0],
    }));
  }
  function handleSubmit(e: React.FormEvent) {
    // Send the productData to your backend for creating the product
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log(formData.get("imageOnLeft"));
    handleDescritionChange({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      imageOnLeft:
        formData.get("imageOnLeft") === "on" ? true : (false as boolean),
      image: description.image,
    });
    (e.target as HTMLFormElement).reset();
    setDescription({
      content: "",
      title: "",
      imageOnLeft: false,
      image: { src: "" },
    });
  }
  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="absolute inset-0 z-10 h-full w-screen bg-black bg-opacity-50 backdrop-blur-lg"></div>
      <div className=" fixed top-0 z-50 max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">Add Service Description</h2>
        <form ref={form} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <input
              type="text"
              name="title"
              className="mt-1 w-full rounded border p-2"
              required
            ></input>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Content:
            </label>
            <textarea
              name="content"
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <AddImage
            onImagesChange={handleChangedImage}
            defaultImages={description.image.src ? [description.image] : []}
            maxImages={1}
          />
          <div className="mb-4 flex gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Image on left:
            </label>
            <input
              type="checkbox"
              name="imageOnLeft"
              className="mt-1 rounded border p-2"
            />
          </div>

          <button
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            type="submit"
          >
            Add Description section
          </button>
        </form>
      </div>
    </div>
  );
}

export default DescriptionForm;
