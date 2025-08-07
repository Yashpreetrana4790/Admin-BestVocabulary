"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const limit = Number(searchParams.get("limit")) || itemsPerPage;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("pageInput") as HTMLInputElement;
    const page = Math.min(Math.max(1, Number(input.value)), totalPages);
    handlePageChange(page);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                isActive={currentPage > 1}
              />
            </PaginationItem>

            {/* Current page indicator */}
            <PaginationItem>
              <div className="px-4 py-1 text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                isActive={currentPage < totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            name="pageInput"
            type="number"
            min={1}
            max={totalPages}
            defaultValue={currentPage}
            className="w-20 text-center"
          />
          <Button type="submit">Go</Button>
        </form>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * limit + 1}-{Math.min(currentPage * limit, totalItems)} of {totalItems} items
      </div>
    </div>
  );
}