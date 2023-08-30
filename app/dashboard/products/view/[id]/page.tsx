'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { createImageDTO } from "@/crud/images";
import { createProductDTO } from "@/crud/product";
import { createTagDTO } from "@/crud/tags";
import React, { useEffect, useState } from 'react';
import Notification from "@/components/Notification";
import { createSupplierDTO } from "@/crud/supplier";
import { X } from "lucide-react";
import { useParams } from "next/navigation";



const CreateProductForm: React.FC = () => {
  const [notify, setNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");
  const [notifyType, setNotifyType] = useState<'success' | 'fail'>('fail');

  const [showDialog, setShowDialog] = useState(false);

  const [productData, setProductData] = useState<createProductDTO>({
    sku: '',
    name: '',
    status: '',
    ratings: undefined,
    inventory: 0,
    productBreakdown: undefined,
    shippingReturnPolicy: '',
    description: '',
    price: 0,
    profitMargin: 0,
    displayPrice: 0,
    category: '',
    subcategory: undefined,
    suppliers: [],
    tags: [],
    images: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your-access-token',
    };
    // Send the userData to your backend for creating the user
    const res = await fetch(`${apiUrl}/products/${params.id}`, { method: 'POST', body: JSON.stringify(productData), headers })
    let resJson = await res.json();

    if (res.status == 200) {
      setNotify(true); setNotifyMessage(resJson.message);
      setNotifyType('success');
    } else {
      setNotify(true); setNotifyMessage(resJson.message);
      setNotifyType('fail');
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setProductData({
      ...productData,
      [name]: Number(e.target.value)
    })
  }



  function handleChangedImage(images: createImageDTO[], tags: createTagDTO[]) {
    setProductData((prevData) => ({
      ...prevData,
      images,
      tags
    }))

    console.log(productData)

  }


  function handleSupplierAdd(supplier: createSupplierDTO) {

    setProductData((prevData) => ({
      ...prevData,
      suppliers: [...(prevData.suppliers || []), supplier]
    }))

    setShowDialog(false)

  }

  function handleRemoveSupplier(supplierToRemove: createSupplierDTO) {
    setProductData((prevData) => ({
      ...prevData,
      suppliers: prevData.suppliers?.filter(supplier => supplier.supplierName !== supplierToRemove.supplierName)
    }))

  }


  const params = useParams();

  useEffect(() => {

      async function fetchData() {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          const headers = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer your-access-token',
          };
          // Send the userData to your backend for creating the user
          const res = await fetch(`${apiUrl}/products/${params.id}`, { method: 'GET', headers })
          let resJson = await res.json();
          console.log(resJson)

          if (res.status == 200) {
              setProductData(resJson.data as createProductDTO);
          } else {
              setNotify(true); setNotifyMessage(resJson.message);
              setNotifyType('fail');
          }
      }

      fetchData()
  }, []);

  return (
    <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded p-8 max-w-4xl w-full overflow-scroll max-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">SKU:</label>
            <input
              type="text"
              name="sku"
              className="mt-1 p-2 border rounded w-full"
              value={productData.sku}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              className="mt-1 p-2 border rounded w-full"
              value={productData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status:</label>
            <input
              type="text"
              name="status"
              className="mt-1 p-2 border rounded w-full"
              value={productData.status}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Inventory:</label>
            <input
              type="number"
              name="inventory"
              className="mt-1 p-2 border rounded w-full"
              value={productData.inventory}
              onChange={handleNumberInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              className="mt-1 p-2 border rounded w-full"
              value={productData.price}
              onChange={handleNumberInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              name="description"
              rows={4} // Adjust the number of rows as needed
              className="mt-1 p-2 border rounded w-full"
              value={productData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Shipping Policy:</label>
            <textarea
              name="shippingReturnPolicy"
              rows={4} // Adjust the number of rows as needed
              className="mt-1 p-2 border rounded w-full"
              value={productData.shippingReturnPolicy}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <input
              type="text"
              name="category"
              className="mt-1 p-2 border rounded w-full"
              value={productData.category}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amazon ASIN:</label>
            <input
              type="text"
              name="amazonProductId"
              className="mt-1 p-2 border rounded w-full"
              value={productData.amazonProductId}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">CJdropshipping id:</label>
            <input
              type="text"
              name="cjDropShippingId"
              className="mt-1 p-2 border rounded w-full"
              value={productData.cjDropShippingId}
              onChange={handleInputChange}
            />
          </div>

          <div className="my-4 flex flex-wrap gap-2">
            {productData.suppliers?.map((supplier, index) => {
              return (
                <div key={index} className="bg-blue-200 text-blue-800 p-2 rounded flex items-center">
                  <span>{supplier.supplierName}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring focus:ring-red-300"
                    onClick={() => handleRemoveSupplier(supplier)}
                  >
                    X
                  </button>
                </div>)
            })}

            <button type="button" onClick={() => setShowDialog(!showDialog)} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Add Supplier</button>
          </div>

          <AddImagesAndTags tags={productData.tags} images={productData.images}  onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Create Product
          </button>
        </form>

      </div>
      {notify && <Notification message={notifyMessage} type={notifyType}></Notification>}
    </div>
  );
};

export default CreateProductForm;
