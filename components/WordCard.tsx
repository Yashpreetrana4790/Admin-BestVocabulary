import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WordData } from "@/types/word";
import { Volume2, ArrowUpNarrowWide } from "lucide-react";
import Link from "next/link";


// WordCard component to display individual word details
interface WordCardProps {
  wordsdata: WordData;
}

const WordCard = ({ wordsdata }: WordCardProps) => {
  if (!wordsdata) return null;

  const countOfMeanings = wordsdata?.meanings?.length || 0;
  const primaryMeaning = wordsdata?.meanings?.[0];

  const difficultyColors = {
    Beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-stone-900 p-4 hover:shadow-sm transition-shadow h-full flex flex-col">
      {/* Header with word and pronunciation */}
      <div className="flex justify-between items-start">
        <Link
          href={`/words/${wordsdata.word}`}
          className="text-lg font-semibold hover:underline capitalize"
        >
          {wordsdata.word}
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-2 mt-1 mb-2 flex-wrap">
        <span className="text-sm text-muted-foreground">
          {wordsdata.pronunciation}
        </span>
        {primaryMeaning?.difficulty && (
          <Badge className={`text-xs ${difficultyColors[primaryMeaning.difficulty as keyof typeof difficultyColors]}`}>
            {primaryMeaning.difficulty}
          </Badge>
        )}
        <Badge variant="outline" className="text-xs">
          {wordsdata.frequency}
        </Badge>
      </div>

      {/* Meaning and examples */}
      <div className="flex-grow space-y-2">
        <p className="text-sm line-clamp-2">
          {primaryMeaning?.meaning || primaryMeaning?.subtitle}
        </p>

        {/* Part of speech and category */}
        <div className="flex flex-wrap gap-1">
          {wordsdata.meanings?.map((meaning, index) => (
            <div key={index} className="flex items-center gap-1">

              <Badge variant="outline" className="text-xs">
                {meaning.pos}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowUpNarrowWide className="h-4 w-4" />
          <span>{countOfMeanings} {countOfMeanings === 1 ? "meaning" : "meanings"}</span>
        </div>

      </div>
    </div>
  );
};

export default WordCard;