"use client";
import { Check, Info, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useState,
  useEffect,
  Dispatch,
  useContext,
  createContext,
  useRef,
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



const Notification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState(searchParams.get("message") as string);
  // console.log(searchParams.get('notifyType'));
  const [type, setType] = useState(searchParams.get("notifyType") || "success");
  const [autoClose, setAutoClose] = useState(
    Number(searchParams.get("autoClose") ?? 0)
  );
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    setMessage(searchParams.get("message") as string);
    setNotify(searchParams.get("notify") === "true" ? true : false);
    setAutoClose(Number(searchParams.get("autoClose") ?? 0));
    setType(searchParams.get("notifyType") || "success");
  }, [searchParams]);

  useEffect(() => {
    if (notify && autoClose) {
      if (autoClose>0) {
        setTimeout(() => {
          const newSearch = new URLSearchParams(searchParams);
          newSearch.delete("notify");
          newSearch.delete("message");
          newSearch.delete("autoClose");
          newSearch.delete("notifyType");
          router.replace("?" + newSearch.toString(), { scroll: false });
          setNotify(false);
        }, autoClose);
      }
    }
  }, [notify, router, autoClose, searchParams]);

  function close() {
    const newSearch = new URLSearchParams(searchParams);
    newSearch.delete("notify");
    newSearch.delete("message");
    newSearch.delete("autoClose");
    newSearch.delete("notifyType");
    router.replace("?" + newSearch.toString(), { scroll: false });
    setNotify(false);
  }

  return (
    <div
      className={`fixed bottom-10 right-10 flex rounded p-4 
      ${type === "success" ? "bg-green-500 text-white" : type === "error" ? "bg-red-500 text-white" : "bg-red-700 text-zinc-900"} 
      ${notify ? "z-[10000] opacity-100" : "hidden opacity-0"} font-semibold transition-opacity  duration-300 `}
    >
      <button
        onClick={() => close()}
        className="cursor-pointer"
      >
        {type === "success" ? (
          <Check className="mr-2" />
        ) : type === "error" ? (
          <X className="mr-2" />
        ) : (
          <Info className="mr-2" />
        )}
      </button>
      {message}
    </div>
  );
};



function useNotify() {
  const router = useRouter();
  const routerRef = useRef(router);

  routerRef.current = router;

  const [{ push, replace }] = useState({
    push: (path: string) => routerRef.current.push(path, { scroll: false }),
    replace: (path: string) =>
      routerRef.current.replace(path, { scroll: false }),
  });
  return (message: string, options: NotificationOptions) =>
    replace(
      `?notify=true&notifyType=${options.type}&message=${message}&autoClose=${options?.autoClose ?? 3000}`,
    );
}

export { useNotify };
export default Notification;
