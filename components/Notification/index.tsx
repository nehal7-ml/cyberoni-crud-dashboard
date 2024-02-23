"use client";
import { Check, Info, X } from "lucide-react";
import React, { useState, useEffect, Dispatch } from "react";

export type NotificationType = "success" | "error" | "info";

export type NotificationOptions = {
  type?: NotificationType;
  autoClose?: number | 5000;
}
export type NotificationProps = {
  message: string;
  options?: NotificationOptions
};

let updateState: Dispatch<{
  message: string,
  type: NotificationType
}>
let updateShow: Dispatch<boolean>
const Notification = () => {

  const [show, setShow] = useState(false);
  const [state, setState] = useState({
    message: "",
    type: 'info'
  });

  updateState = setState;
  updateShow = setShow;

  return (
    <div className={`fixed flex bottom-10 right-10 p-4 rounded ${state.type === 'success' ? 'bg-green-500 text-white' : state.type === 'error' ? 'bg-red-500 text-white' : 'bg-red-700 text-zinc-900'} ${show ? 'opacity-100 z-[10000]' : 'opacity-0'} transition-opacity duration-300  font-semibold `}>
      {state.type === 'success' ? (
        <Check className="mr-2" />
      ) :
        state.type === 'error' ?
          (
            <X className="mr-2" />
          ) :
          <Info className="mr-2" />

      }
      {state.message}

    </div>
  )
};

function toast(message: string, options: NotificationOptions) {
  updateShow(true);
  updateState({ message, type: options.type ?? 'info' })

  setTimeout(() => {

    updateShow(false);
    updateState({message: "", type:'info'})
  }, options?.autoClose ?? 5000)
}

export { toast };
export default Notification;
