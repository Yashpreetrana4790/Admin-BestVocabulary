'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteHomophone } from '../../service/categoriesService';
import { toast } from 'sonner';
import { ConfirmationPopup } from '@/components/AlertComponent';
import { useState } from 'react';

interface Word {
  word: string;
  meaning: string;
  example?: string;
  pronunciation?: string;
}

interface Homophone {
  _id: string;
  words: Word[];
  difficulty?: string;
  tags?: string[];
  notes?: string;
}

interface HomophoneListProps {
  homophones: Homophone[];
}

export default function HomophoneList({ homophones }: HomophoneListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteHomophone(id);
      toast.success('Homophone group deleted successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete homophone group');
    } finally {
      setDeletingId(null);
    }
  };

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {homophones.map((homophone) => (
        <Card key={homophone._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                {homophone.words.map(w => w.word).join(' / ')}
              </CardTitle>
              {homophone.difficulty && (
                <Badge className={difficultyColors[homophone.difficulty as keyof typeof difficultyColors] || ''}>
                  {homophone.difficulty}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {homophone.words.map((word, index) => (
                <div key={index} className="p-2 bg-muted rounded-md">
                  <div className="font-semibold text-sm">{word.word}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {word.meaning}
                  </div>
                  {word.example && (
                    <div className="text-xs italic text-muted-foreground mt-1">
                      "{word.example}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            {homophone.tags && homophone.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {homophone.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                asChild
                variant="outline"
                size="sm"
              >
                <Link href={`/categories/homophones/edit/${homophone._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <ConfirmationPopup
                onConfirm={() => handleDelete(homophone._id)}
                confirmText="Delete"
                variant="destructive"
                size="sm"
                disabled={deletingId === homophone._id}
                title="Delete Homophone Group"
                description={`Are you sure you want to delete this homophone group? This action cannot be undone.`}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

