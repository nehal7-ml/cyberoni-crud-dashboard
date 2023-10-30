'use client'
import { Check, X } from "lucide-react";
import React, { useState, useEffect, Dispatch } from 'react';

export type NotificationType = 'success' | 'fail'
const Notification = ({ message, type, visible, setVisible }: { message: string, type: NotificationType, visible: boolean, setVisible: Dispatch<boolean> }) => {

  useEffect(() => {
    if (visible) {

      setTimeout(() => { setVisible(false) }, 3000)
    }

  }, [setVisible, visible]);
  const notificationClass = `fixed bottom-4 right-4 p-4 rounded ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } ${visible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 z-50 text-white font-semibold`;


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
