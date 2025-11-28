'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowRight, FolderOpen } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const wordCount = category.words?.length || 0;
        
        return (
          <Card key={category._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              {/* Icon and Title Section */}
              <div className="flex items-start gap-3 mb-3">
                {/* Icon */}
                {category.image ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 flex-shrink-0">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 flex-shrink-0"
                    style={{ 
                      backgroundColor: category.color ? `${category.color}20` : '#fef3c720',
                    }}
                  >
                    {category.icon || '📚'}
                  </div>
                )}
                
                {/* Title and Word Count */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {wordCount} word{wordCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Description and Tags Section */}
              {(category.description || (category.tags && category.tags.length > 0)) && (
                <div className="mb-4 space-y-2">
                  {category.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      related to {category.description.toLowerCase()}
                    </p>
                  )}
                  {category.tags && category.tags.length > 0 && (
                    <div className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                      {JSON.stringify(category.tags.map(tag => `#${tag.replace(/^#/, '')}`))}
                    </div>
                  )}
                </div>
              )}

              {/* Separator */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                {/* View Words Button */}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-start"
                >
                  <Link href={`/categories/word-categories/${category._id}`}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    View Words
                  </Link>
                </Button>

                {/* Edit Icon */}
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                >
                  <Link href={`/categories/word-categories/edit/${category._id}`}>
                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </Link>
                </Button>

                {/* Delete Button */}
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

