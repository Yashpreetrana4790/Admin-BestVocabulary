import { getCategoryById } from '../service/categoryService';
import CategoryForm from '../components/CategoryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditProps) {
  const id = params?.id;

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
    const response = await getCategoryById(id);
    const category = response.data;

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
          <h1 className="text-3xl font-bold">Edit Category</h1>
        </div>
        <CategoryForm initialData={category} categoryId={id} />
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

