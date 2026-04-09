import { Button } from '@/components/ui/button';
import { Plus, FolderTree, AlertCircle } from 'lucide-react';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FolderTree className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Word Categories</h1>
            </div>
            <p className="text-muted-foreground">
              Organize words into categories like Biology, Science, Literature, etc.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/categories/word-categories/new">
              <Plus className="h-4 w-4" />
              Create Category
            </Link>
          </Button>
        </div>

        {/* Search */}
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
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border bg-card">
            <div className="p-4 rounded-2xl bg-blue-500/10 mb-6">
              <FolderTree className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No categories found</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {search 
                ? `No categories match your search "${search}". Try a different term.`
                : 'Get started by creating your first word category.'}
            </p>
            <Button asChild>
              <Link href="/categories/word-categories/new">
                <Plus className="h-4 w-4 mr-2" />
                Create First Category
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading categories:', error);
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FolderTree className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Word Categories</h1>
            </div>
            <p className="text-muted-foreground">
              Organize words into categories like Biology, Science, Literature, etc.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/categories/word-categories/new">
              <Plus className="h-4 w-4" />
              Create Category
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
              <h2 className="text-lg font-semibold text-destructive mb-2">Failed to load categories</h2>
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
