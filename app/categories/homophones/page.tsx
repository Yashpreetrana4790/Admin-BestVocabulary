import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getHomophones } from '../service/categoriesService';
import { PaginationControls } from '@/components/PaginationControl';
import { Badge } from '@/components/ui/badge';
import { ConfirmationPopup } from '@/components/AlertComponent';
import HomophoneList from './components/HomophoneList';
import SearchBar from '@/components/SearchBar';

type SearchParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export default async function HomophonesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const limit = searchParams?.limit ? parseInt(searchParams.limit) : 20;
  const search = searchParams?.search || '';

  try {
    const response = await getHomophones(page, limit, search);
    const { data: homophones, pagination } = response;

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
              <h1 className="text-3xl font-bold">Homophones</h1>
              <p className="text-muted-foreground mt-1">
                Words that sound the same but have different meanings and spellings
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/categories/homophones/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Homophone Group
            </Link>
          </Button>
        </div>

        <SearchBar route="/categories/homophones" showAdvanced={false} title="Search Homophones" />

        {homophones && homophones.length > 0 ? (
          <>
            <HomophoneList homophones={homophones} />
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
                <p className="text-lg mb-2">No homophone groups found</p>
                <p className="text-sm">Click "Add Homophone Group" to get started</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading homophones:', error);
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
              <h1 className="text-3xl font-bold">Homophones</h1>
              <p className="text-muted-foreground mt-1">
                Words that sound the same but have different meanings and spellings
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/categories/homophones/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Homophone Group
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-destructive">
              <p className="font-semibold mb-2">Failed to load homophones</p>
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
