import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WordData } from "@/types/word";
import { Volume2, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface WordCardProps {
  wordsdata: WordData;
}

const WordCard = ({ wordsdata }: WordCardProps) => {
  const wordObj = wordsdata as WordData & Record<string, unknown>;
  const wordText = wordsdata?.word || wordObj?.term || wordObj?.name || '';
  
  if (!wordsdata || !wordText) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
        <p className="text-sm text-destructive">Invalid word data</p>
      </div>
    );
  }

  const countOfMeanings = wordsdata?.meanings?.length || 0;
  const primaryMeaning = wordsdata?.meanings?.[0];
  const encodedWord = encodeURIComponent(wordText);

  const difficultyConfig: Record<string, { bg: string; text: string }> = {
    Beginner: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    Easy: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
    Intermediate: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    Medium: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
    Advanced: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
    Hard: { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
  };

  const difficulty = primaryMeaning?.difficulty || 'Beginner';
  const difficultyStyle = difficultyConfig[difficulty] || difficultyConfig.Beginner;

  return (
    <Link href={`/words/${encodedWord}`} className="block h-full">
      <div className="group rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors capitalize truncate">
              {wordText}
            </h3>
            {wordsdata.pronunciation && (
              <p className="text-sm text-muted-foreground font-mono mt-0.5">
                {wordsdata.pronunciation}
              </p>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-xl hover:bg-primary/10 shrink-0"
            onClick={(e) => e.preventDefault()}
          >
            <Volume2 className="h-4 w-4 text-primary" />
          </Button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {primaryMeaning?.pos && (
            <Badge className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">
              {primaryMeaning.pos}
            </Badge>
          )}
          {difficulty && (
            <Badge className={`text-xs border-0 ${difficultyStyle.bg} ${difficultyStyle.text}`}>
              {difficulty}
            </Badge>
          )}
          {wordsdata.frequency && (
            <Badge variant="outline" className="text-xs">
              {wordsdata.frequency}
            </Badge>
          )}
        </div>

        {/* Meaning */}
        <div className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {primaryMeaning?.meaning || primaryMeaning?.subtitle || "No definition available"}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{countOfMeanings} {countOfMeanings === 1 ? "meaning" : "meanings"}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Edit</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WordCard;
