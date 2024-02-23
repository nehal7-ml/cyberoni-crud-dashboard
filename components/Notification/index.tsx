"use client";
import { Check, X } from "lucide-react";
import React, { useState, useEffect, Dispatch } from "react";

export type NotificationType = "success" | "fail";
export type NotificationProps = {
  message: string;
  type: NotificationType;
  visible: boolean;
  setVisible?: Dispatch<boolean>;
};
const Notification = ({
  message,
  type,
  visible,
  setVisible,
}: NotificationProps) => {
  const [show, setShow] = useState(visible);
  useEffect(() => {
    setShow(visible);
    if (visible) {
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [setVisible, visible]);
  const notificationClass = `fixed flex gap-5 w-fit bottom-4 right-4 p-4 rounded ${type === "success" ? "bg-green-500" : "bg-red-500"} ${visible ? "block opacity-100" : "hidden opacity-0"} transition-opacity duration-300 z-[99999] text-white font-semibold`;

  return (
    <>
      {show ? (
        <div className={notificationClass}>
          {type === "success" ? (
            <Check className="mr-2" />
          ) : (
            <X className="mr-2" />
          )}
          {message}
        </div>
      ) : (
        <>
          <div className="hidden"></div>
        </>
      )}
    </>
  );
};

export const useNotify = (): [
  NotificationProps,
  Dispatch<NotificationProps>,
] => {
  const [notifyState, setNotifyState] = useState<NotificationProps>({
    message: "",
    visible: false,
    type: "success",
  });

  return [notifyState, setNotifyState as Dispatch<NotificationProps>];
};
export default Notification;
