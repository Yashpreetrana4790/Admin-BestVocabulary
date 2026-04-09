'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WordData } from "@/types/word";
import { Volume2, Bookmark, Share2, Edit } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface WordCardProps {
  wordsdata: WordData;
}

const WordCard = ({ wordsdata }: WordCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!wordsdata) return null;

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      }
    };
  }, []);

  const playPronunciation = () => {
    if (!wordsdata.word) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(wordsdata.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
    }
  };

  const countOfMeanings = wordsdata?.meanings?.length || 0;
  const primaryMeaning = wordsdata?.meanings?.[0];
  const expressionsCount = wordsdata?.expressions?.length || 0;
  const phrasalVerbsCount =
    wordsdata?.phrasalVerbs?.length ?? wordsdata?.PhrasalVerbs?.length ?? 0;

  const normalizeDifficulty = (difficulty: string | undefined, frequency: string | undefined): { value: string; display: string } | null => {
    const value = difficulty || frequency;
    if (!value) return null;
    
    const lowerValue = value.toLowerCase();
    
    if (lowerValue === 'easy' || lowerValue === 'beginner' || lowerValue === 'low') {
      return { value: 'Easy', display: 'Easy' };
    }
    if (lowerValue === 'medium' || lowerValue === 'intermediate') {
      return { value: 'Intermediate', display: 'Intermediate' };
    }
    if (lowerValue === 'hard' || lowerValue === 'advanced' || lowerValue === 'high') {
      return { value: 'Advanced', display: 'Advanced' };
    }
    
    return { value: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(), display: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() };
  };

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Beginner: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Intermediate: "bg-amber-500/10 text-amber-600 border-amber-200",
    Advanced: "bg-rose-500/10 text-rose-600 border-rose-200",
    Hard: "bg-rose-500/10 text-rose-600 border-rose-200"
  };

  const normalizedDifficulty = normalizeDifficulty(primaryMeaning?.difficulty, wordsdata.frequency);

  return (
    <Link href={`/words/${wordsdata.word}`} className="block h-full group">
      <div className="rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full flex flex-col overflow-hidden relative">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0 relative z-10">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground truncate capitalize">
              {wordsdata.word}
            </h3>
            <span className="text-border text-lg">|</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 p-0 hover:bg-primary/10"
              onClick={(e) => {
                e.preventDefault();
                playPronunciation();
              }}
              disabled={isPlaying}
              title="Play pronunciation"
            >
              <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
            </Button>
            <button
              onClick={(e) => {
                e.preventDefault();
                playPronunciation();
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              disabled={isPlaying}
              type="button"
            >
              {wordsdata.pronunciation || primaryMeaning?.pronunciation || '/.../'}
            </button>
          </div>
          
          {normalizedDifficulty && (
            <Badge className={`text-xs shrink-0 ml-2 border ${difficultyColors[normalizedDifficulty.value as keyof typeof difficultyColors] || difficultyColors.Intermediate}`}>
              {normalizedDifficulty.display}
            </Badge>
          )}
        </div>

        {/* Definition */}
        <div className="flex-grow mb-4 space-y-2 min-h-0 overflow-hidden relative z-10">
          {wordsdata.meanings && wordsdata.meanings.length > 0 ? (
            <>
              {wordsdata?.meanings?.slice(0, 2)?.map((meaning, index) => (
                <div key={index} className="space-y-1">
                  {meaning.pos && (
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      {meaning.pos}
                    </span>
                  )}
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
                    {meaning?.meaning || meaning?.subtitle || meaning?.easyMeaning || 'No definition available'}
                  </p>
                  {index < Math.min(wordsdata?.meanings?.length - 1, 1) && wordsdata?.meanings?.length > 1 && (
                    <div className="border-t my-2"></div>
                  )}
                </div>
              ))}
              {wordsdata?.meanings?.length > 2 && (
                <span className="text-xs text-muted-foreground font-medium">
                  +{wordsdata?.meanings?.length - 2} more
                </span>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No definition available</p>
          )}
        </div>

        {/* Tags */}
        {(expressionsCount > 0 || countOfMeanings > 0 || phrasalVerbsCount > 0) && (
          <div className="flex flex-wrap gap-2 mb-3 relative z-10">
            {expressionsCount > 0 && (
              <Badge variant="outline" className="text-xs bg-blue-500/5 text-blue-600 border-blue-200">
                {expressionsCount} expressions
              </Badge>
            )}
            {countOfMeanings > 0 && (
              <Badge variant="outline" className="text-xs bg-amber-500/5 text-amber-600 border-amber-200">
                {countOfMeanings} meanings
              </Badge>
            )}
            {phrasalVerbsCount > 0 && (
              <Badge variant="outline" className="text-xs bg-purple-500/5 text-purple-600 border-purple-200">
                {phrasalVerbsCount} phrasal verbs
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end items-center mt-auto pt-3 border-t shrink-0 relative z-10">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={(e) => e.preventDefault()}
              title="Bookmark"
            >
              <Bookmark className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={(e) => e.preventDefault()}
              title="Share"
            >
              <Share2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={(e) => e.preventDefault()}
              title="Edit"
            >
              <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WordCard;
