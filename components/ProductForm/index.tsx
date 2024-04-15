"use client";
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { CreateImageDTO } from "@/crud/DTOs";
import { CreateProductDTO } from "@/crud/product";
import { CreateTagDTO } from "@/crud/DTOs";
import React, { ChangeEvent, useEffect, useState } from "react";
import Notification, {
  NotificationType,
  toast,
} from "@/components/Notification";
import CreateSupplier from "./CreateSupplier";
import { CreateSupplierDTO } from "@/crud/supplier";
import { X } from "lucide-react";
import { FormProps } from "@/crud/commonDTO";
import { ProductStatus, Supplier } from "@prisma/client";
import { redirect, useRouter } from "next/navigation";
import LoadingDots from "../shared/loading-dots";

const ProductForm = ({ method, action, initial }: FormProps) => {
  const [loading, setLoading] = useState(true);

  const [supplier, setSupplier] = useState<CreateSupplierDTO | undefined>(
    undefined,
  );
  const [showDialog, setShowDialog] = useState(false);

  const [productData, setProductData] = useState<CreateProductDTO>(
    (initial as CreateProductDTO) || {
      sku: "",
      name: "",
      status: "SOLDOUT",
      ratings: undefined,
      inventory: 0,
      productBreakdown: undefined,
      shippingReturnPolicy: "",
      description: "",
      price: 0,
      profitMargin: 0,
      displayPrice: 0,
      category: "",
      subcategory: undefined,
      suppliers: [],
      tags: [],
      images: [],
    },
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setProductData((prevData) => ({
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
    const res = await fetch(`${action}`, {
      method,
      body: JSON.stringify(productData),
      headers,
    });
    let resJson = await res.json();

    if (res.status == 200) {
      message("success", resJson.message);
      router.replace(`/dashboard/products/view/${resJson.data.id}`);
    } else {
      message("error", resJson.message);
    }
    setLoading(false);

  };

  function message(type: NotificationType, message: string) {
    toast(message, { type });
  }

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProductData({
      ...productData,
      [name]: value == "" ? "" : Number(value),
    });
  };

  function handleChangedImage(images: CreateImageDTO[], tags: CreateTagDTO[]) {
    setProductData((prevData) => ({
      ...prevData,
      images,
      tags,
    }));

    console.log(productData);
  }

  function handleSupplierAdd(supplier: CreateSupplierDTO | Supplier) {
    setProductData((prevData) => ({
      ...prevData,
      suppliers: [
        ...((prevData.suppliers as Supplier[]) || []),
        supplier as Supplier,
      ],
    }));

    setShowDialog(false);
  }

  function handleRemoveSupplier(
    supplierToRemove: CreateSupplierDTO | Supplier,
  ) {
    setProductData((prevData) => ({
      ...prevData,
      suppliers: prevData.suppliers?.filter(
        (supplier) => supplier.supplierName !== supplierToRemove.supplierName,
      ) as Supplier[],
    }));
  }

  useEffect(() => {
    async function fetchSuppliers() {}

    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (supplier) {
      console.log(supplier);
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [supplier]);

  return (
    <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
      <div className="max-h-screen w-full max-w-4xl overflow-scroll rounded bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold">
          {method === "POST" ? "Create" : "Update"} Product
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              SKU:
            </label>
            <input
              type="text"
              name="sku"
              className="mt-1 w-full rounded border p-2"
              value={productData.sku}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 w-full rounded border p-2"
              value={productData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              name="status"
              className="mt-1 w-full rounded border p-2"
              value={productData.status}
              onChange={handleInputChange}
            >
              {Object.values(ProductStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Inventory:
            </label>
            <input
              type="number"
              name="inventory"
              className="mt-1 w-full rounded border p-2"
              value={productData.inventory}
              onChange={handleNumberInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price:
            </label>
            <input
              type="number"
              name="price"
              className="mt-1 w-full rounded border p-2"
              value={productData.price}
              onChange={handleNumberInputChange}
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
              value={productData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Shipping Policy:
            </label>
            <textarea
              name="shippingReturnPolicy"
              rows={4} // Adjust the number of rows as needed
              className="mt-1 w-full rounded border p-2"
              value={productData.shippingReturnPolicy}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <input
              type="text"
              name="category"
              className="mt-1 w-full rounded border p-2"
              value={productData.category}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Amazon ASIN:
            </label>
            <input
              type="text"
              name="amazonProductId"
              className="mt-1 w-full rounded border p-2"
              value={productData.amazonProductId}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              CJdropshipping id:
            </label>
            <input
              type="text"
              name="cjDropShippingId"
              className="mt-1 w-full rounded border p-2"
              value={productData.cjDropShippingId}
              onChange={handleInputChange}
            />
          </div>

          <div className="my-4 flex flex-wrap gap-2">
            {productData.suppliers?.map((supplier, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center rounded bg-blue-200 p-2 text-blue-800"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSupplier(supplier as CreateSupplierDTO);
                    }}
                  >
                    <span>{supplier.supplierName}</span>
                  </button>
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                    onClick={() => handleRemoveSupplier(supplier as Supplier)}
                  >
                    X
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setShowDialog(!showDialog)}
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Create Supplier
            </button>
          </div>

          <AddImagesAndTags
            tags={productData.tags}
            images={productData.images}
            onImagesAndTagsChange={handleChangedImage}
          ></AddImagesAndTags>
          <button
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center rounded bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? <LoadingDots /> : null}
            {method === "POST" ? "Create" : "Update"} Product
          </button>
        </form>
        <div
          className={`fixed left-0 top-0 w-screen flex-col justify-center ${showDialog ? "flex" : " hidden"}`}
        >
          <div className="z-30 flex justify-end">
            <button
              className="mx-10 my-3 self-end"
              onClick={() => {
                setShowDialog(!showDialog);
                setSupplier(undefined);
              }}
            >
              <X color="red" className="cursor-pointer" />
            </button>
          </div>
          <CreateSupplier
            supplier={supplier}
            handleSupplierAdd={handleSupplierAdd}
          ></CreateSupplier>
        </div>
      </div>
      <Notification />
    </div>
  );
};

export default ProductForm;
