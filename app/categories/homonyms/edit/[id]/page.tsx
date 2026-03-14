import { getHomonymById } from '../../service/categoriesService';
import HomonymForm from '../components/HomonymForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditProps {
  params: {
    id: string;
  };
}

export default async function EditHomonymPage({ params }: EditProps) {
  const id = params?.id;

  if (!id) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold">Invalid homonym ID.</p>
        </div>
      </div>
    );
  }

  try {
    const response = await getHomonymById(id);
    const homonym = response.data;

    if (!homonym) {
      return (
        <div className="p-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Homonym not found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/categories/homonyms">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Homonyms
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Homonym</h1>
        </div>
        <HomonymForm initialData={homonym} homonymId={id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading homonym:', error);
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold mb-2">Failed to load homonym.</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please check your connection and try again.'}
          </p>
        </div>
      </div>
    );
  }
}

