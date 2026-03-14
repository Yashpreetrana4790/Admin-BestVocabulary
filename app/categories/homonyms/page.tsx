import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getHomonyms } from '../service/categoriesService';
import { PaginationControls } from '@/components/PaginationControl';
import HomonymList from './components/HomonymList';
import SearchBar from '@/components/SearchBar';

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export default async function HomonymsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;
  const search = searchParams?.search || '';

  try {
    const response = await getHomonyms(page, limit, search);
    const { data: homonyms, pagination } = response;

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
              <h1 className="text-3xl font-bold">Homonyms</h1>
              <p className="text-muted-foreground mt-1">
                Words that are spelled and sound the same but have different meanings
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/categories/homonyms/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Homonym
            </Link>
          </Button>
        </div>

        <SearchBar route="/categories/homonyms" showAdvanced={false} title="Search Homonyms" />

        {homonyms && homonyms.length > 0 ? (
          <>
            <HomonymList homonyms={homonyms} />
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
                <p className="text-lg mb-2">No homonyms found</p>
                <p className="text-sm">Click "Add Homonym" to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading homonyms:', error);
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
              <h1 className="text-3xl font-bold">Homonyms</h1>
            </div>
          </div>
          <Button asChild>
            <Link href="/categories/homonyms/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Homonym
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              <p className="font-semibold mb-2">Failed to load homonyms</p>
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
