'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WordSearch from '@/components/WordSearch';
import { addWordToCategory, removeWordFromCategory } from '../../service/categoryService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import WordCard from '@/components/WordCard';
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
      // Reset search by reloading
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
      <Card>
        <CardHeader>
          <CardTitle>Add Words to Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <WordSearch
              value=""
              onChange={handleAddWord}
              placeholder="Search for words to add to this category..."
              label="Search Words"
            />
            <p className="text-xs text-muted-foreground">
              💡 Search for words and click to add them, or drag words from search results into the category box below
            </p>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`min-h-[120px] border-2 border-dashed rounded-lg p-6 flex items-center justify-center transition-all ${
              dragOver
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 dark:border-gray-700'
            }`}
          >
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Drop words here to add to {categoryName}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Or search above and click to add
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Words in Category */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Words in {categoryName}
              <Badge variant="outline" className="ml-2">
                {pagination.totalItems}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {words && words.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {words.map((word) => (
                  <div
                    key={word._id}
                    className="relative group border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/words/${word.word}`} className="block">
                      <div className="font-semibold text-lg mb-1">{word.word}</div>
                      {word.pronunciation && (
                        <div className="text-sm text-muted-foreground mb-2">
                          {word.pronunciation}
                        </div>
                      )}
                      {word.meanings && word.meanings.length > 0 && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {word.meanings[0].meaning}
                        </div>
                      )}
                    </Link>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ConfirmationPopup
                        onConfirm={() => handleRemoveWord(word._id, word.word)}
                        confirmText="Remove"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        disabled={removingId === word._id}
                        title="Remove Word from Category"
                        description={`Are you sure you want to remove "${word.word}" from ${categoryName}? The word itself will not be deleted.`}
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
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No words in this category yet</p>
              <p className="text-sm">Search above to add words to {categoryName}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

