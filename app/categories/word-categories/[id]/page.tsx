import { getCategoryById, getWordsInCategory, removeWordFromCategory } from '../service/categoryService';
import WordSearchWithDrag from '@/components/WordSearchWithDrag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import CategoryWordsManager from './components/CategoryWordsManager';

interface CategoryDetailProps {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryDetailProps) {
  const id = params?.id;
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;

  if (!id) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold">Invalid category ID.</p>
        </div>
      </div>
    );
  }

  try {
    const [categoryResponse, wordsResponse] = await Promise.all([
      getCategoryById(id, true),
      getWordsInCategory(id, page, limit)
    ]);

    const category = categoryResponse.data;
    const { data: words, pagination } = wordsResponse;

    if (!category) {
      return (
        <div className="p-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Category not found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/categories/word-categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            {category.image ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                style={{ 
                  backgroundColor: category.color ? `${category.color}20` : '#3b82f620',
                  color: category.color || '#3b82f6'
                }}
              >
                {category.icon || '📚'}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="text-muted-foreground">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        <CategoryWordsManager 
          categoryId={id}
          categoryName={category.name}
          initialWords={words}
          pagination={pagination}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading category:', error);
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold mb-2">Failed to load category.</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please check your connection and try again.'}
          </p>
        </div>
      </div>
    );
  }
}

