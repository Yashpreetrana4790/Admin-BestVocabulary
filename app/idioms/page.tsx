import { getAllIdioms } from "./service/getIdioms";
import { Button } from "@/components/ui/button";
import { IdiomCard } from "./components/IdiomCard";
import Link from "next/link";
import { PaginationControls } from "@/components/PaginationControl";
import SearchBar from "@/components/SearchBar";
import { MessageSquare, Plus, AlertCircle } from "lucide-react";

export default async function IdiomsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = Number(params?.limit) || 12;

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const response = await getAllIdioms(queryParams.toString());
    const { data: idioms, pagination } = response;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Idioms</h1>
            <p className="text-muted-foreground mt-1">
              Manage idiomatic expressions
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/idioms/new">
              <Plus className="h-4 w-4" />
              Add New Idiom
            </Link>
          </Button>
        </div>

        {/* Search */}
        <SearchBar route="/idioms" showAdvanced={false} title="Search Idioms" />

        {idioms && idioms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {idioms.map((idiom) => (
                <IdiomCard key={idiom._id} idiom={idiom} />
              ))}
            </div>
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border bg-card">
            <div className="p-4 rounded-2xl bg-emerald-500/10 mb-6">
              <MessageSquare className="h-12 w-12 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No idioms found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {searchParams?.search
                ? `No idioms match your search. Try a different search term.`
                : "There are no idioms in the database yet. Add your first idiom to get started."}
            </p>
            <Button asChild>
              <Link href="/idioms/new">
                <Plus className="h-4 w-4 mr-2" />
                Add First Idiom
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading idioms:', error);
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Idioms</h1>
            <p className="text-muted-foreground mt-1">
              Manage idiomatic expressions
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/idioms/new">
              <Plus className="h-4 w-4" />
              Add New Idiom
            </Link>
          </Button>
        </div>

        {/* Error State */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Failed to load idioms</h2>
              <p className="text-sm text-muted-foreground">
                {process.env.NODE_ENV === 'development' && error instanceof Error
                  ? error.message
                  : 'Please check your connection and try again later.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
