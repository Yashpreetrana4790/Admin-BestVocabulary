'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, FolderOpen, FolderTree, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '../service/categoryService';
import { toast } from 'sonner';
import { ConfirmationPopup } from '@/components/AlertComponent';
import { useState } from 'react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  image?: string;
  words?: any[];
  tags?: string[];
}

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCategory(id);
      toast.success('Category deleted successfully');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {categories.map((category) => {
        const wordCount = category.words?.length || 0;
        
        return (
          <div 
            key={category._id} 
            className="group rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              {/* Icon */}
              {category.image ? (
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: category.color ? `${category.color}15` : 'rgb(59 130 246 / 0.1)',
                  }}
                >
                  {category.icon || <FolderTree className="h-6 w-6 text-blue-600" />}
                </div>
              )}
              
              {/* Title and Count */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground mb-1 truncate">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {wordCount} word{wordCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Description */}
            {category.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                {category.description}
              </p>
            )}

            {/* Tags */}
            {category.tags && category.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {category.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-background">
                    #{tag.replace(/^#/, '')}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
              >
                <Link href={`/categories/word-categories/${category._id}`}>
                  <FolderOpen className="h-3.5 w-3.5" />
                  View Words
                </Link>
              </Button>
              
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
              >
                <Link href={`/categories/word-categories/edit/${category._id}`}>
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>

              <ConfirmationPopup
                onConfirm={() => handleDelete(category._id)}
                confirmText="Del"
                variant="destructive"
                size="sm"
                icon={false}
                className="h-9 px-3 shrink-0"
                disabled={deletingId === category._id}
                title="Delete Category"
                description={`Are you sure you want to delete "${category.name}"? Words in this category will not be deleted.`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
