import WordCard from "@/components/WordCard";
import { getWords } from "./service/getWords";
import { WordData } from "@/types/word";
import SearchBar from "@/components/SearchBar";
import { PaginationControls } from "@/components/PaginationControl";
import { BookOpen } from "lucide-react";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  difficulty?: string;
  length?: string;
  startsWith?: string;
};

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const wordData = await getWords({
    page: params?.page ? +params?.page : 1,
    limit: params?.limit ? +params?.limit : 12,
    search: params?.search,
    difficulty: params?.difficulty,
    length: params?.length ? +params?.length : undefined,
    startsWith: params?.startsWith
  });

  const words: WordData[] = wordData?.words || wordData?.data || (Array.isArray(wordData) ? wordData : []);

  const validWords = words.filter((word: WordData) => {
    const wordObj = word as WordData & Record<string, unknown>;
    const hasWord = !!(word?.word || wordObj?.term || wordObj?.name);
    return hasWord;
  });

  const pagination = wordData?.pagination || {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 12,
    totalItems: 0
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchBar route="/words" />
      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Words</h1>
          <p className="text-muted-foreground mt-1">
            {pagination.totalItems > 0 
              ? `Showing ${validWords.length} of ${pagination.totalItems.toLocaleString()} words`
              : "Manage your vocabulary database"
            }
          </p>
        </div>

        {validWords && validWords.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {validWords.map((word: WordData, index: number) => {
                const wordId: string = typeof word._id === 'object' && word._id?.$oid
                  ? word._id.$oid
                  : (typeof word._id === 'string' ? word._id : `word-${index}`);
                return (
                  <WordCard key={wordId} wordsdata={word} />
                );
              })}
            </div>
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-2xl bg-muted mb-6">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No words found</h3>
            <p className="text-muted-foreground max-w-md">
              {params?.search
                ? `No words match your search "${params.search}". Try a different search term.`
                : "There are no words in the database yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
