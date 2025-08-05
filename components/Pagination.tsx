"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { formUrlQuery } from "@/utils/formUrlQuery";

type PaginationProps = {
  pageNumber: number;
  total: number;
};

type direction = "next" | "prev";


const Pagination = ({ pageNumber, total }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: direction) => {
    const nextPageNumber = direction === "next" ? pageNumber + 1 : pageNumber - 1;

    if (nextPageNumber <= 0 || nextPageNumber > total) return;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };


  return (
    <Suspense>

      <div className="flex w-full items-center justify-center gap-2 my-5">
        <Button
          disabled={pageNumber === 1}
          onClick={() => handleNavigation("prev")}
        >
          <p className="body-medium text-white dark:text-black">Prev</p>
        </Button>
        <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
          <p className="body-semibold bg-gray-200 py-1  px-3 rounded-sm text-black">{pageNumber}</p>
        </div>
        <Button
          disabled={pageNumber === total}
          onClick={() => handleNavigation("next")}
        >
          <p className="body-medium  text-white dark:text-black">Next</p>
        </Button>
      </div>
    </Suspense>

  );
};

export default Pagination;
