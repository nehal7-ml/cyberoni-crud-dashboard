"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Check, Info, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export type NotificationType = "success" | "error" | "info";

export interface NotificationOptions {
  type?: NotificationType;
  autoClose?: number;
}

export interface NotificationProps {
  message: string;
  options: NotificationOptions;
}

const defaultOptions: NotificationOptions = {
  type: "success",
  autoClose: 5000,
};

const NotificationContext = createContext<{
  state: NotificationProps;
  toast: (message: string, options?: NotificationOptions) => void;
}>({
  state: { message: "", options: defaultOptions },
  toast: () => {}, // default empty function
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<NotificationProps>({
    message: "",
    options: defaultOptions,
  });

  const toast = (
    message: string,
    options: NotificationOptions = defaultOptions,
  ) => {
    console.log("notiifcation runnning");
    setNotification({ message, options });
  };

  useEffect(() => {
    if (notification?.options?.autoClose) {
      const timer = setTimeout(
        () => setNotification({ message: "", options: defaultOptions }),
        notification.options.autoClose,
      );
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ toast, state: notification }}>
      {children}
      {notification && (
        <NotificationComponent
          message={notification.message}
          options={notification.options}
        />
      )}
    </NotificationContext.Provider>
  );
};

const NotificationComponent: React.FC<NotificationProps> = ({
  message,
  options,
}) => {
  useEffect(() => {
    if (message.length > 0) {
      toast(message, {
        autoClose: options.autoClose,
        type: options.type,
      });
    }
  });
  return (
    <>
      {
        <ToastContainer
          position="bottom-right"
          icon={
            options.type === "success" ? (
              <Check className="text-green-500" />
            ) : options.type === "info" ? (
              <Info />
            ) : (
              <X className="text-red-500" />
            )
          }
        />
      }
    </>
  );
};

export function useNotify() {
  return useContext(NotificationContext);
}

export default NotificationProvider;
