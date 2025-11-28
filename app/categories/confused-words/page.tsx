import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
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
      <div className="p-6 space-y-6">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="/categories">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Commonly Confused Words
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Caught between words? Make the right choice.
                </p>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/categories/confused-words/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Confused Word Pair
              </Link>
            </Button>
          </div>
        </div>

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
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="text-lg mb-2">No confused word pairs found</p>
                <p className="text-sm">Click "Add Confused Word Pair" to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading confused words:', error);
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="/categories">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Commonly Confused Words
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Caught between words? Make the right choice.
                </p>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/categories/confused-words/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Confused Word Pair
              </Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              <p className="font-semibold mb-2">Failed to load confused words</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Please check your connection and try again.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
