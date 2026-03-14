import PhrasalVerbEditor from "../../components/PhraseVerbEditor";
import { getPhraseById } from "../../service/getPhrase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


interface EditProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: EditProps) {
  const id = params?.id;
  
  if (!id) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/phrasal-verbs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Phrasal Verbs
            </Button>
          </Link>
        </div>
        <div className="text-center text-destructive py-8">
          <p className="font-semibold mb-2">Invalid phrasal verb ID.</p>
        </div>
      </div>
    );
  }
  
  try {
    const phrase = await getPhraseById(id);
    
    if (!phrase) {
      return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <Link href="/phrasal-verbs">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Phrasal Verbs
              </Button>
            </Link>
          </div>
          <div className="text-center text-destructive py-8">
            <p className="font-semibold mb-2">Phrasal verb not found.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/phrasal-verbs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Phrasal Verbs
            </Button>
          </Link>
        </div>
        <PhrasalVerbEditor initialData={phrase} phraseId={id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading phrase:', error);
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/phrasal-verbs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Phrasal Verbs
            </Button>
          </Link>
        </div>
        <div className="text-center text-destructive py-8">
          <p className="font-semibold mb-2">Failed to load phrasal verb.</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please check your connection and try again.'}
          </p>
        </div>
      </div>
    );
  }
}