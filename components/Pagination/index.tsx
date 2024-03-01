"use client";
import React from "react";
import { useRouter, useParams, usePathname } from "next/navigation";

const Pagination = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );
  const router = useRouter();
  // Get the current URL pathname
  const currentPath = usePathname();

  // Get the full current URL
  const currentUrl = useParams();
  function onPageChange(page: number) {
    router.push(currentPath.replace(currentPage.toString(), page.toString()));
  }
  return (
    <div className="flex justify-center space-x-2">
      {currentPage > 1 && (
        <button
          className="rounded bg-blue-500 px-2 py-1 font-semibold text-white hover:bg-blue-600"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>
      )}

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`${
            currentPage === pageNumber
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          } rounded px-2 py-1 font-semibold`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          className="rounded bg-blue-500 px-2 py-1 font-semibold text-white hover:bg-blue-600"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
