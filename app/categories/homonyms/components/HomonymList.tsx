'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, AlignLeft } from 'lucide-react';
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

  const difficultyConfig = {
    easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
    hard: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {homonyms.map((homonym) => {
        const difficulty = homonym.difficulty as keyof typeof difficultyConfig;
        const diffStyle = difficultyConfig[difficulty] || difficultyConfig.medium;
        
        return (
          <div 
            key={homonym._id} 
            className="group rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 group-hover:scale-110 transition-transform">
                  <AlignLeft className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-xl capitalize">
                    {homonym.word}
                  </h3>
                  {homonym.pronunciation && (
                    <p className="text-sm text-muted-foreground">/{homonym.pronunciation}/</p>
                  )}
                </div>
              </div>
              {homonym.difficulty && (
                <Badge className={`${diffStyle.bg} ${diffStyle.text} border ${diffStyle.border} text-xs font-medium`}>
                  {homonym.difficulty}
                </Badge>
              )}
            </div>

            {/* Meanings */}
            <div className="space-y-3 mb-4">
              {homonym.meanings.slice(0, 2).map((meaning, index) => (
                <div key={index} className="p-3 rounded-xl bg-muted/50 border border-transparent hover:border-border transition-colors">
                  {meaning.partOfSpeech && (
                    <Badge variant="outline" className="text-xs mb-2 bg-background">
                      {meaning.partOfSpeech}
                    </Badge>
                  )}
                  <p className="text-sm text-foreground leading-relaxed">{meaning.meaning}</p>
                  {meaning.example && (
                    <p className="text-xs italic text-muted-foreground/80 mt-2 pl-3 border-l-2 border-emerald-300">
                      "{meaning.example}"
                    </p>
                  )}
                </div>
              ))}
              {homonym.meanings.length > 2 && (
                <p className="text-xs text-muted-foreground text-center py-1">
                  +{homonym.meanings.length - 2} more meaning{homonym.meanings.length - 2 > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Tags */}
            {homonym.tags && homonym.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {homonym.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-background">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Link href={`/categories/homonyms/edit/${homonym._id}`}>
                  <Edit className="h-3.5 w-3.5" />
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
          </div>
        );
      })}
    </div>
  );
}
