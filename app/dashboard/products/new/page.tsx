'use client'
import AddImagesAndTags from "@/components/AddImagesAndTags";
import { createImageDTO } from "@/crud/images";
import { createProductDTO } from "@/crud/product";
import { createTagDTO } from "@/crud/tags";
import React, { useState } from 'react';



const CreateProductForm: React.FC = () => {
  const [productData, setProductData] = useState<createProductDTO>({
    sku: '',
    name: '',
    status: '',
    ratings: null,
    inventory: 0,
    productBreakdown: null,
    shippingReturnPolicy: '',
    description: '',
    price: 0,
    profitMargin: 0,
    displayPrice: 0,
    category: '',
    subcategory: null,
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
          const res = await fetch(`${apiUrl}/products/add`, {method: 'POST', body: JSON.stringify(productData), headers})
          console.log(await res.json());
  };


  function handleChangedImage(images: createImageDTO[], tags: createTagDTO[]) {
    setProductData ((prevData)=> ({
    ...prevData,
    images,
    tags
    }))

    console.log(productData)

  }

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
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              className="mt-1 p-2 border rounded w-full"
              value={productData.price}
              onChange={handleInputChange}
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
          <AddImagesAndTags onImagesAndTagsChange={handleChangedImage}></AddImagesAndTags>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductForm;
