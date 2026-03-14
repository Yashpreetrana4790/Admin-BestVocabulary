'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Volume2, Bookmark, Share2, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface PhrasalVerb {
  _id: string;
  phrase: string;
  meaning: string;
  example: string;
  difficulty?: string;
}

export function PhrasalVerbCard({ verb }: { verb: PhrasalVerb }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!verb) return null;

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
    if (!verb.phrase) return;

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
    const utterance = new SpeechSynthesisUtterance(verb.phrase);
    
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

    // Speak the phrase
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
    }
  };

  // Normalize difficulty - map variations to standard values
  const normalizeDifficulty = (difficulty: string | undefined): { value: string; display: string } | null => {
    if (!difficulty) return null;
    
    const lowerValue = difficulty.toLowerCase();
    
    if (lowerValue === 'easy' || lowerValue === 'beginner' || lowerValue === 'low') {
      return { value: 'Easy', display: 'Easy' };
    }
    if (lowerValue === 'medium' || lowerValue === 'intermediate') {
      return { value: 'Intermediate', display: 'Intermediate' };
    }
    if (lowerValue === 'hard' || lowerValue === 'advanced' || lowerValue === 'high') {
      return { value: 'Advanced', display: 'Advanced' };
    }
    
    return { value: difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase(), display: difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase() };
  };

  const difficultyColors = {
    Beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200",
    Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200",
    Intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200"
  };

  const normalizedDifficulty = normalizeDifficulty(verb.difficulty);

  return (
    <Link href={`/phrasal-verbs/edit/${verb._id}`} className="block h-full">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-stone-900 p-5 hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden">
        {/* Header: Phrase name, speaker icon, and difficulty badge */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Large phrase name */}
            <h3 className="text-2xl font-bold text-black-900 dark:text-blue-100 truncate capitalize">
              {verb.phrase}
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

        {/* Meaning text */}
        <div className="flex-grow mb-4 space-y-2 min-h-0 overflow-hidden">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
            {verb.meaning || 'No meaning available'}
          </p>

          {/* Example */}
          {verb.example && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2 border-l-2 border-indigo-200 dark:border-indigo-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2 overflow-hidden text-ellipsis">
                "{verb.example}"
              </p>
            </div>
          )}
        </div>

        {/* Footer: Action buttons */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
          {/* Left side - empty for now, can add usage chart later */}
          <div className="flex items-center gap-2">
            {/* Placeholder for future usage chart */}
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
}
