'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WordData } from "@/types/word";
import { Volume2, Bookmark, Share2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import UsageDonutChart from "./UsageDonutChart";


// WordCard component to display individual word details
interface WordCardProps {
  wordsdata: WordData;
}

const WordCard = ({ wordsdata }: WordCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!wordsdata) return null;

  // Cleanup: Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      }
    };
  }, []);

  // Function to play pronunciation using browser's Speech Synthesis API
  const playPronunciation = () => {
    if (!wordsdata.word) return;

    // Check if Speech Synthesis API is available
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    // Stop any currently playing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(wordsdata.word);
    
    // Set speech properties for better pronunciation
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // When speech ends, reset playing state
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsPlaying(false);
    };

    // Speak the word
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
  const phrasalVerbsCount = wordsdata?.PhrasalVerbs?.length || 0;

  // Normalize difficulty - map variations to standard values
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
    Beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200",
    Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200",
    Intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200"
  };

  const normalizedDifficulty = normalizeDifficulty(primaryMeaning?.difficulty, wordsdata.frequency);

  return (
    <Link href={`/words/${wordsdata.word}`} className="block h-full">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-stone-900 p-5 hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden">
        {/* Header: Word name, speaker icon, pronunciation, and difficulty badge */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Large word name */}
            <h3 className="text-2xl font-bold text-black-900 dark:text-blue-100 truncate capitalize">
              {wordsdata.word}
            </h3>
            {/* Vertical divider */}
            <span className="text-gray-300 dark:text-gray-700 text-lg">|</span>
            {/* Speaker icon button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer shrink-0 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.preventDefault();
                playPronunciation();
              }}
              disabled={isPlaying}
              title="Play pronunciation"
            >
              <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-blue-600 animate-pulse' : 'text-gray-500'}`} />
            </Button>
            {/* Pronunciation text - underlined and clickable, positioned after speaker */}
            <button
              onClick={(e) => {
                e.preventDefault();
                playPronunciation();
              }}
              className="text-sm text-gray-600 dark:text-gray-400 underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Click to hear pronunciation"
              disabled={isPlaying}
              type="button"
            >
              {wordsdata.pronunciation || primaryMeaning?.pronunciation || '/.../'}
            </button>
          </div>
          
          {/* Difficulty badge at top right */}
          {normalizedDifficulty && (
            <Badge 
              className={`text-xs shrink-0 ml-2 ${difficultyColors[normalizedDifficulty.value as keyof typeof difficultyColors] || difficultyColors.Intermediate}`}
            >
              {normalizedDifficulty.display}
            </Badge>
          )}
        </div>

        {/* Definition text - show multiple meanings if available */}
        <div className="flex-grow mb-4 space-y-2 min-h-0 overflow-hidden">
          {wordsdata.meanings && wordsdata.meanings.length > 0 ? (
            <>
              {/* Show first 2 meanings */}
              {wordsdata?.meanings?.slice(0, 2)?.map((meaning, index) => (
                <div key={index} className="space-y-1">
                  {meaning.pos && (
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      {meaning.pos}
                    </span>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
                    {meaning?.meaning || meaning?.subtitle || meaning?.easyMeaning || 'No definition available'}
                  </p>
                  {index < Math.min(wordsdata?.meanings?.length - 1, 1) && wordsdata?.meanings?.length > 1 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  )}
                </div>
              ))}
              {/* Show indicator if there are more meanings */}
              {wordsdata?.meanings?.length > 2 && (
                <div className="pt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1 font-medium italic">
                    +{wordsdata?.meanings?.length - 2} more meaning{wordsdata?.meanings?.length - 2 > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
              No definition available
            </p>
          )}
        </div>

        {/* Tags section - only show divider and tags if there are tags to display */}
        {(expressionsCount > 0 || countOfMeanings > 0 || phrasalVerbsCount > 0) && (
          <>
            {/* Divider - only shown when there are tags */}
            <div className="border-t border-dashed border-black dark:border-gray-700 my-3"></div>
            <div className="space-y-2 mb-3">
            {/* First row of tags */}
            <div className="flex flex-wrap gap-2">
              {/* Show idioms/phrases tag if there are expressions (regardless of meaning count) */}
              {expressionsCount > 0 && (
                <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800">
                  Idiom & phrase {expressionsCount}
                </Badge>
              )}
              {/* Show meanings tag for any number of meanings */}
              {countOfMeanings > 0 && (
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                  {countOfMeanings === 1 ? '1 meaning' : `${countOfMeanings} meanings`}
                </Badge>
              )}
            </div>

            {/* Second divider if there are phrasal verbs */}
            {phrasalVerbsCount > 0 && (
              <>
                <div className="border-t border-dashed border-gray-300 dark:border-gray-700"></div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800">
                    Idiom & phrase connection {phrasalVerbsCount}
                  </Badge>
                </div>
              </>
            )}
            </div>
          </>
        )}

        {/* Footer: Usage donut chart and action buttons - overflow visible for tooltip */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-800 shrink-0" style={{ overflow: 'visible' }}>
          {/* Usage Distribution Donut Chart */}
          <div className="flex items-center gap-2" style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}>
            <UsageDonutChart 
              usageDistribution={wordsdata?.usage_distribution}
              commonUsage={primaryMeaning?.common_usage}
              size={40}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // Add bookmark functionality
              }}
              title="Bookmark"
            >
              <Bookmark className="h-4 w-4 text-gray-500 hover:text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // Add share functionality
              }}
              title="Share"
            >
              <Share2 className="h-4 w-4 text-gray-500 hover:text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // Add trends/stats functionality
              }}
              title="View trends"
            >
              <TrendingUp className="h-4 w-4 text-gray-500 hover:text-blue-600" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WordCard;
