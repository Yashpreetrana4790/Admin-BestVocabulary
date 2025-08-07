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

    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Phrasal Verbs</h1>
          <Button asChild>
            <Link href="/phrasal-verbs/new">Add New</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-destructive">
          Failed to load phrasal verbs. Please try again later.
        </div>
      </div>
    );
  }
}