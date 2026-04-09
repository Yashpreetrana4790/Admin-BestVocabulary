'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WordSearch from '@/components/WordSearch';
import { addWordToCategory, removeWordFromCategory } from '../../service/categoryService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Volume2, Trash2, Search, Sparkles } from 'lucide-react';
import { PaginationControls } from '@/components/PaginationControl';
import Link from 'next/link';
import { ConfirmationPopup } from '@/components/AlertComponent';

interface Word {
  _id: string;
  word: string;
  pronunciation?: string;
  meanings?: Array<{
    meaning: string;
    pos?: string;
  }>;
  frequency?: string;
}

interface CategoryWordsManagerProps {
  categoryId: string;
  categoryName: string;
  initialWords: Word[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export default function CategoryWordsManager({
  categoryId,
  categoryName,
  initialWords,
  pagination,
}: CategoryWordsManagerProps) {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>(initialWords);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleAddWord = async (wordOption: any) => {
    if (!wordOption || !wordOption._id) {
      toast.error('Please select a valid word from the search results');
      return;
    }

    setIsAdding(true);
    try {
      await addWordToCategory(categoryId, wordOption._id);
      toast.success(`"${wordOption.word}" added to ${categoryName}`);
      router.refresh();
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add word to category');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveWord = async (wordId: string, wordName: string) => {
    setRemovingId(wordId);
    try {
      await removeWordFromCategory(categoryId, wordId);
      toast.success(`"${wordName}" removed from ${categoryName}`);
      setWords(words.filter(w => w._id !== wordId));
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to remove word from category');
    } finally {
      setRemovingId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.word && data.word._id) {
        await handleAddWord(data.word);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      toast.error('Failed to add word to category');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Word Section */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Search className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Add Words</h2>
            <p className="text-sm text-muted-foreground">Search and add words to this category</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <WordSearch
            value=""
            onChange={handleAddWord}
            placeholder="Search for words to add..."
            label=""
          />

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[100px] border-2 border-dashed rounded-xl p-6 flex items-center justify-center transition-all ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/20 hover:border-muted-foreground/40'
            }`}
          >
            <div className="text-center">
              <div className={`p-3 rounded-full mx-auto mb-3 ${dragOver ? 'bg-primary/10' : 'bg-muted'}`}>
                <Plus className={`h-6 w-6 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {dragOver ? 'Drop to add word' : 'Drag words here'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Or use the search above
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Words in Category */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Words in Category</h2>
              <p className="text-sm text-muted-foreground">{pagination.totalItems} word{pagination.totalItems !== 1 ? 's' : ''} total</p>
            </div>
          </div>
        </div>

        {words && words.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
              {words.map((word) => (
                <div
                  key={word._id}
                  className="group relative rounded-xl border bg-background p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                >
                  <Link href={`/words/${word.word}`} className="block">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {word.word}
                      </h3>
                      {word.frequency && (
                        <Badge variant="outline" className="text-xs bg-background">
                          {word.frequency}
                        </Badge>
                      )}
                    </div>
                    
                    {word.pronunciation && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>/{word.pronunciation}/</span>
                      </div>
                    )}
                    
                    {word.meanings && word.meanings.length > 0 && (
                      <div className="space-y-1">
                        {word.meanings[0].pos && (
                          <Badge variant="secondary" className="text-xs">
                            {word.meanings[0].pos}
                          </Badge>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {word.meanings[0].meaning}
                        </p>
                      </div>
                    )}
                  </Link>
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ConfirmationPopup
                      onConfirm={() => handleRemoveWord(word._id, word.word)}
                      confirmText="Remove"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      disabled={removingId === word._id}
                      title="Remove from Category"
                      description={`Remove "${word.word}" from ${categoryName}? The word won't be deleted.`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-2xl bg-muted mb-6">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No words yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Start building your category by searching for words above and adding them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
