import WordCard from "@/components/WordCard";
import { getWords } from "./service/getWords";
import { WordData } from "@/types/word";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { PaginationControls } from "@/components/PaginationControl";
import ActiveFiltersIndicator from "@/components/ActiveFiltersIndicator";
import { Button } from "@/components/ui/button";
import Link from "next/link";


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
  searchParams: SearchParams;
}) {
  const wordData = await getWords({
    page: searchParams?.page ? +searchParams?.page : 1,
    limit: searchParams?.limit ? +searchParams?.limit : 12,
    search: searchParams?.search,
    difficulty: searchParams?.difficulty,
    length: searchParams?.length ? +searchParams?.length : undefined,
    startsWith: searchParams?.startsWith,
    exactLetters: searchParams?.exactLetters,
    minLetters: searchParams?.minLetters,
    maxLetters: searchParams?.maxLetters,
    onlyAlphabets: searchParams?.onlyAlphabets === 'true',
    minMeanings: searchParams?.minMeanings,
  });

  const { pagination } = wordData;
  console.log(wordData, "wds ")
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {wordData?.words?.map((word: WordData, index: number) => (
          <WordCard key={index} wordsdata={word} />
        ))}

      </div>
      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        itemsPerPage={pagination.itemsPerPage}
        totalItems={pagination.totalItems}
      />
    </>
  );
}