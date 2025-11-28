'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteHomonym } from '../../service/categoriesService';
import { toast } from 'sonner';
import { ConfirmationPopup } from '@/components/AlertComponent';
import { useState } from 'react';

interface Meaning {
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  context?: string;
}

interface Homonym {
  _id: string;
  word: string;
  meanings: Meaning[];
  pronunciation?: string;
  difficulty?: string;
  tags?: string[];
  etymology?: string;
}

interface HomonymListProps {
  homonyms: Homonym[];
}

export default function HomonymList({ homonyms }: HomonymListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteHomonym(id);
      toast.success('Homonym deleted successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete homonym');
    } finally {
      setDeletingId(null);
    }
  };

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {homonyms.map((homonym) => (
        <Card key={homonym._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl capitalize">{homonym.word}</CardTitle>
              {homonym.difficulty && (
                <Badge className={difficultyColors[homonym.difficulty as keyof typeof difficultyColors] || ''}>
                  {homonym.difficulty}
                </Badge>
              )}
            </div>
            {homonym.pronunciation && (
              <p className="text-sm text-muted-foreground mt-1">{homonym.pronunciation}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {homonym.meanings.slice(0, 2).map((meaning, index) => (
                <div key={index} className="p-2 bg-muted rounded-md">
                  {meaning.partOfSpeech && (
                    <Badge variant="outline" className="text-xs mb-1">
                      {meaning.partOfSpeech}
                    </Badge>
                  )}
                  <div className="text-sm">{meaning.meaning}</div>
                  {meaning.example && (
                    <div className="text-xs italic text-muted-foreground mt-1">
                      "{meaning.example}"
                    </div>
                  )}
                </div>
              ))}
              {homonym.meanings.length > 2 && (
                <div className="text-xs text-muted-foreground">
                  +{homonym.meanings.length - 2} more meaning{homonym.meanings.length - 2 > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {homonym.tags && homonym.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {homonym.tags.map((tag, index) => (
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
                <Link href={`/categories/homonyms/edit/${homonym._id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <ConfirmationPopup
                onConfirm={() => handleDelete(homonym._id)}
                confirmText="Delete"
                variant="destructive"
                size="sm"
                disabled={deletingId === homonym._id}
                title="Delete Homonym"
                description={`Are you sure you want to delete "${homonym.word}"? This action cannot be undone.`}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

