import { getCategoryById, getWordsInCategory } from '../service/categoryService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, AlertCircle, FolderTree, BookOpen, Plus } from 'lucide-react';
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
      <div className="space-y-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Invalid Category</h2>
              <p className="text-sm text-muted-foreground">Invalid category ID provided.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  try {
    const [categoryResponse, wordsResponse] = await Promise.all([
      getCategoryById(id, true),
      getWordsInCategory(id, page, limit)
    ]);

    const category = categoryResponse.data || categoryResponse;
    const { data: words, pagination } = wordsResponse;

    if (!category) {
      return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-destructive mb-2">Category Not Found</h2>
                <p className="text-sm text-muted-foreground">The requested category does not exist.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const wordCount = words?.length || category.words?.length || 0;

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <div className="rounded-2xl border bg-gradient-to-br from-blue-500/5 to-blue-500/0 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {category.image ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-blue-200 shadow-lg">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-lg"
                  style={{ 
                    backgroundColor: category.color ? `${category.color}20` : 'rgb(59 130 246 / 0.15)',
                  }}
                >
                  {category.icon || <FolderTree className="h-10 w-10 text-blue-600" />}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-muted-foreground max-w-xl mb-3">{category.description}</p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="secondary" className="gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    {wordCount} word{wordCount !== 1 ? 's' : ''}
                  </Badge>
                  {category.tags && category.tags.length > 0 && (
                    category.tags.slice(0, 3).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-background">
                        #{tag.replace(/^#/, '')}
                      </Badge>
                    ))
                  )}
                  {category.tags && category.tags.length > 3 && (
                    <Badge variant="outline" className="bg-background">
                      +{category.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:shrink-0">
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link href={`/categories/word-categories/edit/${id}`}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Words Manager */}
        <CategoryWordsManager 
          categoryId={id}
          categoryName={category.name}
          initialWords={words || []}
          pagination={pagination}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading category:', error);
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Failed to Load Category</h2>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Please check your connection and try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
