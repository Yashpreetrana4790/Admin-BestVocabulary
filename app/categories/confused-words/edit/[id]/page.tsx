import { getConfusedWordsById } from '../../service/categoriesService';
import ConfusedWordsForm from '../components/ConfusedWordsForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditProps {
  params: {
    id: string;
  };
}

export default async function EditConfusedWordsPage({ params }: EditProps) {
  const id = params?.id;

  if (!id) {
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold">Invalid confused words ID.</p>
        </div>
      </div>
    );
  }

  try {
    const response = await getConfusedWordsById(id);
    const confusedWords = response.data;

    if (!confusedWords) {
      return (
        <div className="p-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Confused word pair not found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/categories/confused-words">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Confused Words
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Confused Word Pair</h1>
        </div>
        <ConfusedWordsForm initialData={confusedWords} confusedWordsId={id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading confused words:', error);
    return (
      <div className="p-6">
        <div className="text-center text-destructive">
          <p className="font-semibold mb-2">Failed to load confused word pair.</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please check your connection and try again.'}
          </p>
        </div>
      </div>
    );
  }
}

