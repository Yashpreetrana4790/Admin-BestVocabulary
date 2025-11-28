import { getAllphrases } from "./service/getPhrase";
import { Button } from "@/components/ui/button";
import { PhrasalVerbCard } from "./components/phraseCard";
import Link from "next/link";
import { PaginationControls } from "@/components/PaginationControl";

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

    // Debug logging
    console.log('[PhrasalVerbsPage] Response:', { 
      hasResponse: !!response,
      hasData: !!phrases,
      phrasesLength: phrases?.length,
      phrases: phrases,
      pagination: pagination
    });

    // Handle empty results
    if (!phrases || phrases.length === 0) {
      console.log('[PhrasalVerbsPage] No phrases found, showing empty state');
      return (
        <>
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold">Phrasal Verbs</h1>
            <Button asChild>
              <Link href="/phrasal-verbs/new">Add New</Link>
            </Button>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            No phrasal verbs found. <Link href="/phrasal-verbs/new" className="text-primary underline">Add your first one</Link>
          </div>
        </>
      );
    }

    console.log('[PhrasalVerbsPage] Rendering phrases:', phrases.length, 'items');
    
    return (
      <>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Phrasal Verbs</h1>
          <Button asChild>
            <Link href="/phrasal-verbs/new">Add New</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {phrases && phrases.length > 0 ? (
            phrases.map((verb) => {
              console.log('[PhrasalVerbsPage] Rendering verb:', verb._id, verb.phrase);
              return <PhrasalVerbCard key={verb._id} verb={verb} />;
            })
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No phrasal verbs to display
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
    console.error('Error loading phrasal verbs:', error);
    return (
      <>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">Phrasal Verbs</h1>
          <Button asChild>
            <Link href="/phrasal-verbs/new">Add New</Link>
          </Button>
        </div>
        <div className="p-4">
          <div className="text-center text-destructive py-8">
            <p className="font-semibold mb-2">Failed to load phrasal verbs.</p>
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