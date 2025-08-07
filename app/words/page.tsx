import WordCard from "@/components/WordCard";
import { getWords } from "./service/getWords";
import { WordData } from "@/types/word";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { PaginationControls } from "@/components/PaginationControl";


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
  searchParams: SearchParams;
}) {
  const wordData = await getWords({
    page: searchParams?.page ? +searchParams?.page : 1,
    limit: searchParams?.limit ? +searchParams?.limit : 12,
    search: searchParams?.search,
    difficulty: searchParams?.difficulty,
    length: searchParams?.length ? +searchParams?.length : undefined,
    startsWith: searchParams?.startsWith
  });

  const { pagination } = wordData;
  console.log(wordData, "wds ")
  return (
    <>
      <div>

      </div>
      <SearchBar route="/words" />
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