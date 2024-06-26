import React from "react";

function Loading() {
  return (
    <div className="w-ful fixed left-0 right-0 top-0 z-[9999] flex h-full items-center  justify-center backdrop-blur-sm">
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
    </div>
  );
}

export default Loading;
