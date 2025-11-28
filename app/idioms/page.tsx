import { getAllIdioms } from "./service/getIdioms";
import { Button } from "@/components/ui/button";
import { IdiomCard } from "./components/IdiomCard";
import Link from "next/link";
import { PaginationControls } from "@/components/PaginationControl";
import SearchBar from "@/components/SearchBar";

export default async function IdiomsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    search?: string;
  };
}) {
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchParams?.search) {
      queryParams.append('search', searchParams.search);
    }

    const response = await getAllIdioms(queryParams.toString());
    const { data: idioms, pagination } = response;

    if (!idioms || idioms.length === 0) {
      return (
        <>
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold">Idioms</h1>
            <Button asChild>
              <Link href="/idioms/new">Add New</Link>
            </Button>
          </div>
          <SearchBar route="/idioms" showAdvanced={false} title="Search Idioms" />
          <div className="text-center py-8 text-muted-foreground">
            No idioms found. <Link href="/idioms/new" className="text-primary underline">Add your first one</Link>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Idioms</h1>
          <Button asChild>
            <Link href="/idioms/new">Add New</Link>
          </Button>
        </div>

        <SearchBar route="/idioms" showAdvanced={false} title="Search Idioms" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {idioms && idioms.length > 0 ? (
            idioms.map((idiom) => (
              <IdiomCard key={idiom._id} idiom={idiom} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No idioms to display
            </div>
          )}
        </div>

        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading idioms:', error);
    return (
      <>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Idioms</h1>
          <Button asChild>
            <Link href="/idioms/new">Add New</Link>
          </Button>
        </div>
        <div className="p-4">
          <div className="text-center text-destructive py-8">
            <p className="font-semibold mb-2">Failed to load idioms.</p>
            <p className="text-sm text-muted-foreground">
              {process.env.NODE_ENV === 'development' && error instanceof Error
                ? error.message
                : 'Please check your connection and try again later.'}
            </p>
          </div>
        </div>
      </>
    );
  }
}

