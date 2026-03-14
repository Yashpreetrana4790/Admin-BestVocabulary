import WordCard from "@/components/WordCard";
import { getWords } from "./service/getWords";
import { WordData } from "@/types/word";
import SearchBar from "@/components/SearchBar";
import { PaginationControls } from "@/components/PaginationControl";
import ActiveFiltersIndicator from "@/components/ActiveFiltersIndicator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  difficulty?: string;
  length?: string;
  startsWith?: string;
  exactLetters?: string;
  minLetters?: string;
  maxLetters?: string;
  onlyAlphabets?: string;
  minMeanings?: string;
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
    startsWith: params?.startsWith,
    exactLetters: params?.exactLetters,
    minLetters: params?.minLetters,
    maxLetters: params?.maxLetters,
    onlyAlphabets: params?.onlyAlphabets === 'true',
    minMeanings: params?.minMeanings,
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
    <>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Words</h1>
        <Button asChild>
          <Link href="/words/new">Add New Word</Link>
        </Button>
      </div>
      <SearchBar route="/words" />
      <div className="px-4">
        <ActiveFiltersIndicator />
      </div>
      
      {validWords && validWords.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
    </>
  );
}
