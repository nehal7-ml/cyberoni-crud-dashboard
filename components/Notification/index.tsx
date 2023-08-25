'use client'
import { Check, X } from "lucide-react";
import React, { useState, useEffect } from 'react';

const Notification = ({ message, type }: { message: string, type: 'success' | 'fail' }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000); // Adjust the duration as needed

        return () => clearTimeout(timer);
    }, []);

    const notificationClass = `fixed bottom-4 right-4 p-4 rounded ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 z-50 text-white font-semibold`;
    

    return <div className={notificationClass}>
    {type === 'success' ? (
      <Check className="mr-2" />
    ) : (
      <X className="mr-2" />
    )}
    {message}
  </div>
};

export default Notification;
