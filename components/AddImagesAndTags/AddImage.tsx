"use client";
import { CreateImageDTO } from "@/crud/DTOs";
import { bufferToB64, generateUUID } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Loading from "../Loading";
import { Edit, PlusCircle, X, XCircle } from "lucide-react";
import Notification, { useNotify } from "../Notification";

function AddImage({
  defaultImages,
  onImagesChange,
  maxImages,
  submit,
}: {
  defaultImages?: CreateImageDTO[];
  onImagesChange: (images: CreateImageDTO[]) => void;
  maxImages?: number;
  submit?: boolean;
}) {
  const [images, setImages] = useState<CreateImageDTO[]>(defaultImages || []);
  const {toast} = useNotify();

  const [imageModal, setImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [image, setImage] = useState<CreateImageDTO>({
    name: "",
    src: "",
  });

  const fileTypes = ["JPG", "PNG", "GIF"];

  const [loading, setLoading] = useState(false);

  const handleAddImage = async (file: any) => {
    setLoading(true);
    let newfiles = images;
    for (let i = 0; i < file.length && i < (maxImages || 10); i++) {
      const newFile = file.item(i);
      const newFileSrc = bufferToB64(await newFile.arrayBuffer(), newFile.type);

      if (images.length < (maxImages || 10)) {
        const image = {
          src: newFileSrc,
          name: newFile.name,
        };
        setImage(image);
        //setImages(newfiles)
      } else {
        // alert(`Only ${maxImages || 10} images allowed`)
        toast(`Only ${maxImages || 10} images allowed`, {
          autoClose: 5000,
          type: "error",
        });
      }
    }

    setLoading(false);
    console.log("loaded Image");
  };

  const handleRemoveImage = async (
    imageToRemove: CreateImageDTO,
    index: number,
  ) => {
    const newFiles = images.filter((image) => image.src !== imageToRemove.src);
    setImages(newFiles);
    onImagesChange(newFiles);
  };

  function handleSave() {
    const currentImage = image;
    let toUpdate = currentImageIndex === -1 ? false : true;

    if (toUpdate) {
      let newFiles = images.map((image, index) => {
        if (index === currentImageIndex) {
          return {
            ...image,
            src: currentImage.src,
            name: currentImage.name,
          };
        } else return image;
      });

      onImagesChange(newFiles);
    } else if (currentImage.name && currentImage.src) {
      let newFiles = images;
      if (images.length >= (maxImages || 10)) {
        toast(`Only ${maxImages || 10} images allowed`, {
          type: "error",
        });
        setImage({
          name: "",
          src: "",
        });
        return;
      }
      newFiles.push(currentImage);
      onImagesChange(newFiles);
    }

    setImage({
      name: "",
      src: "",
    });

    setImageModal(false);
  }

  useEffect(() => {
    if (defaultImages && defaultImages.length > 0) {
      console.log(defaultImages);
      setImages(defaultImages);
    }
  }, [defaultImages]);

  useEffect(() => {
    if (submit) {
    }
  }, [submit]);

  function updateImage(image: CreateImageDTO, index: number = -1) {
    setCurrentImageIndex(index);
    setImage(index === -1 ? image : images[index]);
    setImageModal(true);
  }
  return (
    <>
      <h2 className="mb-2 text-lg font-semibold">Add Images</h2>
      <div className="mb-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div
              key={image.src}
              className="relative flex flex-col rounded bg-gray-200 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.name as string}
                className="h-20 w-20 cursor-pointer object-cover"
                onClick={() => {
                  updateImage(image);
                }}
              />
              <div className="line-clamp-1 w-20 text-ellipsis p-1 hover:line-clamp-none hover:w-auto hover:overflow-visible hover:whitespace-nowrap hover:shadow-md">
                {image.name}
              </div>
              <div className="absolute right-2 top-1  flex items-center justify-center">
                <button
                  type="button"
                  className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                  onClick={() => handleRemoveImage(image, index)}
                >
                  <XCircle />
                </button>
              </div>

              <div className="  flex items-center justify-center">
                <button
                  type="button"
                  className="ml-2 rounded-md p-1 text-blue-600 hover:text-blue-800 hover:shadow-md focus:outline-none focus:ring focus:ring-red-300"
                  onClick={() => updateImage(image, index)}
                >
                  <Edit />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            type="button"
            onClick={() => (setImageModal(true), setImage({ name: "", src: "" }), setCurrentImageIndex(-1))}
            className="rounded-full bg-blue-500 p-2 hover:bg-blue-600 hover:shadow-lg"
          >
            <PlusCircle className=" text-white" />
          </button>
          <div
            className={`fixed left-0 top-0 z-[100] flex h-screen w-screen flex-col justify-center backdrop-blur-md ${imageModal ? "" : " hidden"}`}
          >
            <div className="container relative mx-auto my-auto flex flex-col justify-center rounded-xl bg-gray-100 p-5">
              <div className="z-30 flex justify-end">
                <button
                  type="button"
                  className="mx-10 my-3 self-end"
                  onClick={() => setImageModal(false)}
                >
                  <X color="red" className="cursor-pointer" />
                </button>
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <label htmlFor="src">Src:</label>
                <input
                  className="rounded  border p-2 "
                  type="url"
                  id="src"
                  value={image.src}
                  onChange={(e) =>
                    setImage((prev) => ({ ...prev, src: e.target.value }))
                  }
                />
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <label htmlFor="name">Name:</label>
                <input
                  className="rounded border p-2 "
                  type="text"
                  id="name"
                  name="image-name"
                  value={image.name || ""}
                  onChange={(e) =>
                    setImage((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <FileUploader
                  multiple={true}
                  handleChange={handleAddImage}
                  name="file"
                  types={fileTypes}
                  text="file"
                />
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <button
                  onClick={handleSave}
                  type="button"
                  className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  {image.id ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <div
            role="status"
            className="fixed left-0 top-0 z-[100] h-screen w-screen  backdrop-blur-md"
          >
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}

export default AddImage;
