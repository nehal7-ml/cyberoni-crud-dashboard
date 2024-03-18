import Loading from "@/components/Loading";
import LoadingDots from "@/components/shared/loading-dots";
import { Loader2Icon } from "lucide-react";
import React from "react";

function DashboardLoading() {
  return (


    <div className="h-full w-full flex items-center justify-center">
      <div className=" flex justify-center items-center animate-spin">
        <Loader2Icon className="h-16 w-16" />
      </div>
    </div>)
}

export default DashboardLoading;
