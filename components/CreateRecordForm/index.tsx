"use client"
import { createUserDTO } from "@/crud/user";
import { Role } from "@prisma/client";
import React, { useState } from 'react';



// Component
const CreateRecordForm = ({ children, recordType }: { children: JSX.Element[], recordType: string }) => {
    const [formData, setFormData] = useState<createUserDTO>({
        firstName: '',
        lastName: '',
        email: '',
        emailVerified: false,
        role: Role.USER,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement logic to handle form submission and user creation
        console.log(formData);
    };

    return (
        <div className="bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Create New {recordType}</h2>
            <form className="text-2xl font-semibold text-gray-800 dark:bg-gray-800 dark:text-white mb-4" onSubmit={handleSubmit}>
                {children}
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Create {recordType}</button>
            </form>
        </div>
    );
};

export default CreateRecordForm;
