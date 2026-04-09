'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteConfusedWords } from '../../service/categoriesService';
import { toast } from 'sonner';
import { ConfirmationPopup } from '@/components/AlertComponent';
import { useState } from 'react';

interface WordInfo {
  word: string;
  meaning: string;
  pronunciation?: string;
  examples?: string[];
}

interface ConfusedWord {
  _id: string;
  word1: WordInfo;
  word2: WordInfo;
  explanation: string;
  commonMistake?: string;
  difficulty?: string;
  tags?: string[];
  memoryTip?: string;
}

interface ConfusedWordsListProps {
  confusedWords: ConfusedWord[];
}

export default function ConfusedWordsList({ confusedWords }: ConfusedWordsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteConfusedWords(id);
      toast.success('Confused word pair deleted successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete confused word pair');
    } finally {
      setDeletingId(null);
    }
  };

  const difficultyConfig = {
    easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
    hard: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {confusedWords.map((item) => {
        const difficulty = item.difficulty as keyof typeof difficultyConfig;
        const diffStyle = difficultyConfig[difficulty] || difficultyConfig.medium;
        
        return (
          <div 
            key={item._id} 
            className="group rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-amber-300 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold text-foreground text-lg">
                  {item.word1.word} <span className="text-muted-foreground font-normal">/</span> {item.word2.word}
                </h3>
              </div>
              {item.difficulty && (
                <Badge className={`${diffStyle.bg} ${diffStyle.text} border ${diffStyle.border} text-xs font-medium`}>
                  {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                </Badge>
              )}
            </div>

            {/* Explanation */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
              {item.explanation}
            </p>

            {/* Memory Tip */}
            {item.memoryTip && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                  <p className="text-xs font-medium text-amber-600">Memory Tip</p>
                </div>
                <p className="text-xs text-muted-foreground">{item.memoryTip}</p>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-background">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 pt-4 border-t">
              <Link 
                href={`/categories/confused-words/edit/${item._id}`}
                className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1 group/link"
              >
                Continue reading
                <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <Link href={`/categories/confused-words/edit/${item._id}`}>
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <ConfirmationPopup
                  onConfirm={() => handleDelete(item._id)}
                  confirmText="Delete"
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === item._id}
                  title="Delete Confused Words"
                  description={`Are you sure you want to delete "${item.word1.word} / ${item.word2.word}"? This action cannot be undone.`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
