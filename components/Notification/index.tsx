"use client";
import { Check, Info, X } from "lucide-react";
import React, {
  useState,
  useEffect,
  Dispatch,
  useContext,
  createContext,
} from "react";

export type NotificationType = "success" | "error" | "info";

export type NotificationOptions = {
  type?: NotificationType;
  autoClose?: number | 5000;
};
export type NotificationProps = {
  message: string;
  options?: NotificationOptions;
};

let updateState: (newValue: NotificationProps & { show: boolean }) => void;

const NotificationContext = createContext<
  NotificationProps & { show: boolean }
>({
  show: false,
  message: "",
});

const useMyState = () => useContext(NotificationContext);

const NotificationComponent = () => {
  const state = useMyState();

  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <div
      className={`fixed bottom-10 right-10 flex rounded p-4 ${state.options?.type === "success" ? "bg-green-500 text-white" : state.options?.type === "error" ? "bg-red-500 text-white" : "bg-red-700 text-zinc-900"} ${state.show ? "z-[10000] opacity-100" : "hidden opacity-0"} font-semibold transition-opacity  duration-300 `}
    >
      {state.options?.type === "success" ? (
        <Check className="mr-2" />
      ) : state.options?.type === "error" ? (
        <X className="mr-2" />
      ) : (
        <Info className="mr-2" />
      )}
      {state.message}
    </div>
  );
};

function toast(message: string, options: NotificationOptions) {
  updateState({
    message,
    show: true,
    options,
  });

  setTimeout(() => {
    updateState({
      message: "",
      show: false,
    });
  }, options?.autoClose ?? 5000);
}

// Define a provider component to manage the shared state
const Notification = () => {
  const [value, setValue] = useState<NotificationProps & { show: boolean }>({
    show: false,
    message: "",
  });

  // Function to update the shared state
  const updateValue = (newValue: NotificationProps & { show: boolean }) => {
    setValue(newValue);
  };
  updateState = updateValue;

  return (
    <NotificationContext.Provider value={value}>
      <NotificationComponent></NotificationComponent>
    </NotificationContext.Provider>
  );
};
export { toast };
export default Notification;
