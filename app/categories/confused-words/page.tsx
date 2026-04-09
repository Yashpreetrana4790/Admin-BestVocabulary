import { Button } from '@/components/ui/button';
import { Plus, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getConfusedWords } from '../service/categoriesService';
import { PaginationControls } from '@/components/PaginationControl';
import ConfusedWordsList from './components/ConfusedWordsList';
import SearchBar from '@/components/SearchBar';

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export default async function ConfusedWordsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;
  const search = searchParams?.search || '';

  try {
    const response = await getConfusedWords(page, limit, search);
    const { data: confusedWords, pagination } = response;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Confused Words</h1>
            </div>
            <p className="text-muted-foreground">
              Commonly confused word pairs and their differences
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/categories/confused-words/new">
              <Plus className="h-4 w-4" />
              Add Word Pair
            </Link>
          </Button>
        </div>

        {/* Search */}
        <SearchBar route="/categories/confused-words" showAdvanced={false} title="Search Confused Words" />

        {confusedWords && confusedWords.length > 0 ? (
          <>
            <ConfusedWordsList confusedWords={confusedWords} />
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border bg-card">
            <div className="p-4 rounded-2xl bg-amber-500/10 mb-6">
              <BookOpen className="h-12 w-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No confused word pairs found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {search 
                ? `No confused words match your search "${search}". Try a different term.`
                : 'Get started by adding your first confused word pair.'}
            </p>
            <Button asChild>
              <Link href="/categories/confused-words/new">
                <Plus className="h-4 w-4 mr-2" />
                Add First Word Pair
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading confused words:', error);
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Confused Words</h1>
            </div>
            <p className="text-muted-foreground">
              Commonly confused word pairs and their differences
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/categories/confused-words/new">
              <Plus className="h-4 w-4" />
              Add Word Pair
            </Link>
          </Button>
        </div>

        {/* Error State */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Failed to load confused words</h2>
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
