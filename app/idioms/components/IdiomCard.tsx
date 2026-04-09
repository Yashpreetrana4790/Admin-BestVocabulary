'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Volume2, Bookmark, Share2, Edit } from "lucide-react";
import { useState, useEffect } from "react";

interface Idiom {
  _id: string;
  idiom: string;
  meaning: string;
  example?: string;
  difficulty?: string;
}

export function IdiomCard({ idiom }: { idiom: Idiom }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!idiom) return null;

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
    if (!idiom?.idiom) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(idiom.idiom);
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
    Easy: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Beginner: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    Intermediate: "bg-amber-500/10 text-amber-600 border-amber-200",
    Advanced: "bg-rose-500/10 text-rose-600 border-rose-200",
    Hard: "bg-rose-500/10 text-rose-600 border-rose-200"
  };

  const normalizedDifficulty = normalizeDifficulty(idiom.difficulty);

  return (
    <Link href={`/idioms/edit/${idiom._id}`} className="block h-full group">
      <div className="rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full flex flex-col overflow-hidden relative">
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0 relative z-10">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground truncate capitalize">
              {idiom.idiom}
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
          </div>
          
          {normalizedDifficulty && (
            <Badge className={`text-xs shrink-0 ml-2 border ${difficultyColors[normalizedDifficulty.value as keyof typeof difficultyColors] || difficultyColors.Intermediate}`}>
              {normalizedDifficulty.display}
            </Badge>
          )}
        </div>

        {/* Meaning and example */}
        <div className="flex-grow mb-4 space-y-3 min-h-0 overflow-hidden relative z-10">
          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
            {idiom.meaning || 'No meaning available'}
          </p>
          {idiom.example && (
            <div className="bg-muted/50 rounded-xl p-3 border-l-2 border-primary/30">
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                &ldquo;{idiom.example}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center mt-auto pt-3 border-t relative z-10">
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
}
