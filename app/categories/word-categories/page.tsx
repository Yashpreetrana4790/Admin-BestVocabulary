import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCategories } from './service/categoryService';
import { PaginationControls } from '@/components/PaginationControl';
import CategoryList from './components/CategoryList';
import SearchBar from '@/components/SearchBar';

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export default async function WordCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;
  const search = searchParams?.search || '';

  try {
    const response = await getCategories(page, limit, search);
    const { data: categories, pagination } = response;

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/categories">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Word Categories</h1>
              <p className="text-muted-foreground mt-1">
                Organize words into categories like Biology, Science, Literature, etc.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/categories/word-categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Link>
          </Button>
        </div>

        <SearchBar route="/categories/word-categories" showAdvanced={false} title="Search Categories" />

        {categories && categories.length > 0 ? (
          <>
            <CategoryList categories={categories} />
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
                <p className="text-lg mb-2">No categories found</p>
                <p className="text-sm">Click "Create Category" to organize your words</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/categories">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Word Categories</h1>
            </div>
          </div>
          <Button asChild>
            <Link href="/categories/word-categories/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              <p className="font-semibold mb-2">Failed to load categories</p>
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

