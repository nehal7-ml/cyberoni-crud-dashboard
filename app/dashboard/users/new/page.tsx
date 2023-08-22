'use client'
import { createAddressDTO } from "@/crud/address";
import { createUserDTO } from "@/crud/user";
import { Role } from "@prisma/client";
import React, { useState } from 'react';



const CreateUserForm: React.FC = () => {

  const [addressData, setAddressData] = useState<createAddressDTO>({
    city: '',
    country: '',
    state: '',
    street: '',
    zipCode: ''
  });
  const [userData, setUserData] = useState<createUserDTO>({
    email: '',
    role: Role.USER,
    address: addressData
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> |React.ChangeEvent<HTMLSelectElement> ) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send the userData to your backend for creating the user
    console.log(userData);
  };

  return (
    <div className="light:bg-gray-100 light:text-black dark:bg-gray-700 dark:text-gray-800 min-h-screen flex items-center justify-center">
    <div className="bg-white shadow-md rounded p-8 max-w-md w-full">
      <h2 className="text-2xl font-semibold mb-4">Create User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            className="mt-1 p-2 border rounded w-full"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role:</label>
          <select
            name="role"
            className="mt-1 p-2 border rounded w-full"
            value={userData.role}
            onChange={handleInputChange}
            required
          >
            {Object.values(Role).map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image Url:</label>
          <input
            type="email"
            name="email"
            className="mt-1 p-2 border rounded w-full"
            value={userData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Street:</label>
            <input
              type="text"
              name="street"
              className="mt-1 p-2 border rounded w-full"
              value={addressData.street}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">City:</label>
            <input
              type="text"
              name="city"
              className="mt-1 p-2 border rounded w-full"
              value={addressData.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">State:</label>
            <input
              type="text"
              name="state"
              className="mt-1 p-2 border rounded w-full"
              value={addressData.state}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Zip Code:</label>
            <input
              type="text"
              name="zipCode"
              className="mt-1 p-2 border rounded w-full"
              value={addressData.zipCode}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Country:</label>
            <input
              type="text"
              name="country"
              className="mt-1 p-2 border rounded w-full"
              value={addressData.country}
              onChange={handleInputChange}
            />
          </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Create User
        </button>
      </form>
    </div>
  </div>
  );
};

export default CreateUserForm;
