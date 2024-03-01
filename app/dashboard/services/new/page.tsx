import ServiceForm from "@/components/ServiceForm";
import React from "react";

function CreateServcie() {
  return (
    <>
      <div className="light:bg-gray-100 light:text-black flex min-h-screen items-center justify-center dark:bg-gray-700 dark:text-gray-800">
        <ServiceForm method="POST" action="/api/services/add" />
      </div>
    </>
  );
}

export default CreateServcie;
