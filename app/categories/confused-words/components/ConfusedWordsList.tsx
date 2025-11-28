'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteConfusedWords } from '../../service/categoriesService';
import { toast } from 'sonner';
import { ConfirmationPopup } from '@/components/AlertComponent';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {confusedWords.map((item) => (
        <div 
          key={item._id} 
          className="group relative p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-all duration-200 bg-white dark:bg-stone-900"
        >
          {/* Action Menu - Top Right */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/categories/confused-words/edit/${item._id}`} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 cursor-pointer"
                  disabled={deletingId === item._id}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Word Pair - Prominent Display */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
              {item.word1.word} <span className="text-gray-400">/</span> {item.word2.word}
            </h3>
          </div>

          {/* Explanation */}
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 line-clamp-4">
            {item.explanation}
          </p>

          {/* Memory Tip (if available) */}
          {item.memoryTip && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border-l-2 border-amber-400">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">💡 Memory Tip</p>
              <p className="text-xs text-amber-700 dark:text-amber-300">{item.memoryTip}</p>
            </div>
          )}

          {/* Difficulty Badge */}
          {item.difficulty && (
            <div className="mb-4">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  item.difficulty === 'easy' 
                    ? 'border-emerald-300 text-emerald-700 dark:text-emerald-400'
                    : item.difficulty === 'medium'
                    ? 'border-amber-300 text-amber-700 dark:text-amber-400'
                    : 'border-red-300 text-red-700 dark:text-red-400'
                }`}
              >
                {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
              </Badge>
            </div>
          )}

          {/* Continue Reading / View Details Link */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <Link 
              href={`/categories/confused-words/edit/${item._id}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 group/link"
            >
              Continue reading...
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

