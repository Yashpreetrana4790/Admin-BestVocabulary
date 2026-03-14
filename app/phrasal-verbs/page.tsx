import { getAllphrases } from "./service/getPhrase";
import { Button } from "@/components/ui/button";
import { PhrasalVerbCard } from "./components/phraseCard";
import Link from "next/link";
import { PaginationControls } from "@/components/PaginationControl";
import { Plus, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8 px-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Phrasal Verbs
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage phrasal verbs and expressions
              </p>
            </div>
            <Button asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/phrasal-verbs/new" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New
              </Link>
            </Button>
          </div>

          {phrases && phrases.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4">
                {phrases.map((verb) => (
                  <PhrasalVerbCard key={verb._id} verb={verb} />
                ))}
              </div>

              <PaginationControls
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                itemsPerPage={pagination?.itemsPerPage}
                totalItems={pagination?.totalItems}
              />
            </>
          ) : (
            <Card className="mx-4 border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-950/50 mb-4">
                  <Plus className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No phrasal verbs yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first phrasal verb
                </p>
                <Button asChild>
                  <Link href="/phrasal-verbs/new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Phrasal Verb
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
        <Card className="max-w-md w-full border-red-200 dark:border-red-800">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/50 mb-4">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">
              Failed to Load
            </h3>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t fetch the phrasal verbs. Please check your connection and try again.
            </p>
            <Button asChild variant="outline">
              <a href="/phrasal-verbs">Retry</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}