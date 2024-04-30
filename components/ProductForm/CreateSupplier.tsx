"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateImageDTO, CreateSupplierDTO } from "@/crud/DTOs";
import { CreateTagDTO } from "@/crud/DTOs";
import { Supplier } from "@prisma/client";
import { title } from "process";
import React, { useEffect, useState } from "react";

function CreateSupplier({
  supplier,
  handleSupplierAdd,
}: {
  supplier?: CreateSupplierDTO;
  handleSupplierAdd: (subservice: Supplier) => void;
}) {
  const [supplierData, setSupplierData] = useState<CreateSupplierDTO>(
    supplier || {
      baseShippingPrice: 0,
      supplierName: "",
      height: 0,
      length: 0,
      width: 0,
      weight: 0,
      supplierUrl: "",
      availability: "",
      listPrice: 0,
      salePrice: 0,
      shippingWeight: 0,
      supplierEmail: "",
      supplierStatus: "",
      supplierWhatsApp: "",
      supplierWrittenComments: "",
    },
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  function handleChangedImage(image: CreateImageDTO[], tags: CreateTagDTO[]) {
    setSupplierData((prevData) => ({
      ...prevData,
      image: image[0],
      tags,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSupplierAdd(supplierData as Supplier);
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setSupplierData({
      ...supplierData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  useEffect(() => {
    if (supplier) setSupplierData(supplier);
  }, [supplier]);

  return (
    <>
      <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
        <div className="absolute inset-0 z-10 h-full w-screen bg-black bg-opacity-50 backdrop-blur-lg"></div>

        <div className=" fixed top-0 z-30 max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">Add Supplier</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                name="supplierName"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.supplierName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Supplier URl:
              </label>
              <input
                type="text"
                name="supplierUrl"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.supplierUrl}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                height:
              </label>
              <input
                type="number"
                name="height"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.height}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                length:
              </label>
              <input
                type="number"
                name="length"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.length}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                width:
              </label>
              <input
                type="number"
                name="width"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.width}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                weight:
              </label>
              <input
                type="number"
                name="weight"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.weight}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                base Shipping Price:
              </label>
              <input
                type="number"
                name="baseShippingPrice"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.baseShippingPrice}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                shipping Weight:
              </label>
              <input
                type="number"
                name="shippingWeight"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.shippingWeight}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                list Price:
              </label>
              <input
                type="number"
                name="listPrice"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.listPrice}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                sale Price
              </label>
              <input
                type="number"
                name="salePrice"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.salePrice}
                onChange={handleNumberInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Supplier Email:
              </label>
              <input
                type=""
                name="supplierEmail"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.supplierEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Supplier WhatsApp:
              </label>
              <input
                type="text"
                name="supplierWhatsApp"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.supplierWhatsApp}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Supplier Status:
              </label>
              <input
                type="text"
                name="supplierStatus"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.supplierStatus}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Availability:{" "}
              </label>
              <input
                type="text"
                name="availability"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.availability}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                supplier Written Comments:
              </label>
              <input
                type="text"
                name="supplierWrittenComments"
                className="mt-1 w-full rounded border p-2"
                value={supplierData.supplierWrittenComments}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add Supplier
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateSupplier;
