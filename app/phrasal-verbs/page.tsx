import { getAllphrases } from "./service/getPhrase";
import { Button } from "@/components/ui/button";
import { PhrasalVerbCard } from "./components/phraseCard";
import Link from "next/link";
import { PaginationControls } from "@/components/PaginationControl";
import { Plus, AlertCircle, Layers } from "lucide-react";

export default async function PhrasalVerbsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
  };
}) {
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;

  try {
    const response = await getAllphrases(`page=${page}&limit=${limit}`);
    const { data: phrases, pagination } = response;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Phrasal Verbs</h1>
            <p className="text-muted-foreground mt-1">
              Manage phrasal verb expressions
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/phrasal-verbs/new">
              <Plus className="h-4 w-4" />
              Add New Phrase
            </Link>
          </Button>
        </div>

        {phrases && phrases.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {phrases.map((verb) => (
                <PhrasalVerbCard key={verb._id} verb={verb} />
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
            <div className="p-4 rounded-2xl bg-amber-500/10 mb-6">
              <Layers className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No phrasal verbs found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              There are no phrasal verbs in the database yet. Add your first one to get started.
            </p>
            <Button asChild>
              <Link href="/phrasal-verbs/new">
                <Plus className="h-4 w-4 mr-2" />
                Add First Phrase
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading phrasal verbs:', error);
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Phrasal Verbs</h1>
            <p className="text-muted-foreground mt-1">
              Manage phrasal verb expressions
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/phrasal-verbs/new">
              <Plus className="h-4 w-4" />
              Add New Phrase
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
              <h2 className="text-lg font-semibold text-destructive mb-2">Failed to load phrasal verbs</h2>
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
