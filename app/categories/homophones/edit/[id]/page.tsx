import { getHomophoneById } from '../../service/categoriesService';
import HomophoneForm from '../components/HomophoneForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditProps {
  params: {
    id: string;
  };
}

export default async function EditHomophonePage({ params }: EditProps) {
  const id = params?.id;

  if (!id) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold">Invalid homophone ID.</p>
        </div>
      </div>
    );
  }

  try {
    const response = await getHomophoneById(id);
    const homophone = response.data;

    if (!homophone) {
      return (
        <div className="p-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Homophone group not found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/categories/homophones">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Homophones
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Homophone Group</h1>
        </div>
        <HomophoneForm initialData={homophone} homophoneId={id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading homophone:', error);
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold mb-2">Failed to load homophone group.</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please check your connection and try again.'}
          </p>
        </div>
      </div>
    );
  }
}

