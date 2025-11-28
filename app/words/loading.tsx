import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="p-5">
      {/* Search Bar Skeleton */}
      <Skeleton className="h-12 w-full rounded-md mb-4" />

      {/* Word Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-md" />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center mt-10">
        <Skeleton className="h-10 w-24 rounded-md mx-2" />
        <Skeleton className="h-10 w-24 rounded-md mx-2" />
      </div>
    </div>
  );
};

export default Loading;
