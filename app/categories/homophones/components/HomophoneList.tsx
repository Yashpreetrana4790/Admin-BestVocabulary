'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Languages, Volume2 } from 'lucide-react';
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

  const difficultyConfig = {
    easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
    hard: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
    Easy: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
    Medium: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
    Hard: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {homophones.map((homophone) => {
        const difficulty = homophone.difficulty as keyof typeof difficultyConfig;
        const diffStyle = difficultyConfig[difficulty] || difficultyConfig.medium;
        
        return (
          <div 
            key={homophone._id} 
            className="group rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 group-hover:scale-110 transition-transform">
                  <Languages className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold text-foreground text-lg leading-tight">
                  {homophone.words.map(w => w.word).join(' / ')}
                </h3>
              </div>
              {homophone.difficulty && (
                <Badge className={`${diffStyle.bg} ${diffStyle.text} border ${diffStyle.border} text-xs font-medium`}>
                  {homophone.difficulty}
                </Badge>
              )}
            </div>

            {/* Words */}
            <div className="space-y-3 mb-4">
              {homophone.words.map((word, index) => (
                <div key={index} className="p-3 rounded-xl bg-muted/50 border border-transparent hover:border-border transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-foreground">{word.word}</span>
                    {word.pronunciation && (
                      <span className="text-xs text-muted-foreground">/{word.pronunciation}/</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {word.meaning}
                  </p>
                  {word.example && (
                    <p className="text-xs italic text-muted-foreground/80 mt-2 pl-3 border-l-2 border-purple-300">
                      "{word.example}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            {homophone.tags && homophone.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {homophone.tags.map((tag, index) => (
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
                <Link href={`/categories/homophones/edit/${homophone._id}`}>
                  <Edit className="h-3.5 w-3.5" />
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
          </div>
        );
      })}
    </div>
  );
}
