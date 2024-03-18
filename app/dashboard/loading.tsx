import Loading from "@/components/Loading";
import LoadingDots from "@/components/shared/loading-dots";
import { Loader2Icon } from "lucide-react";
import React from "react";

function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className=" flex animate-spin items-center justify-center">
        <Loader2Icon className="h-16 w-16" />
      </div>
    </div>
  );
}

export default DashboardLoading;
