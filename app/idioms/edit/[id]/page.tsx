import IdiomEditor from '../../components/IdiomEditor';
import { getIdiomById } from '../../service/getIdioms';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditProps {
  params: {
    id: string;
  };
}

export default async function EditIdiomPage({ params }: EditProps) {
  const id = params?.id;
  
  if (!id) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/idioms">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Idioms
            </Button>
          </Link>
        </div>
        <div className="text-center text-destructive py-8">
          <p className="font-semibold mb-2">Invalid idiom ID.</p>
        </div>
      </div>
    );
  }
  
  try {
    const idiom = await getIdiomById(id);
    
    if (!idiom) {
      return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/idioms">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Idioms
              </Button>
            </Link>
          </div>
          <div className="text-center text-destructive py-8">
            <p className="font-semibold mb-2">Idiom not found.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/idioms">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Idioms
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Idiom</h1>
        </div>
        <IdiomEditor initialData={idiom} idiomId={id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading idiom:', error);
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/idioms">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Idioms
            </Button>
          </Link>
        </div>
        <div className="text-center text-destructive py-8">
          <p className="font-semibold mb-2">Failed to load idiom.</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please check your connection and try again.'}
          </p>
        </div>
      </div>
    );
  }
}

