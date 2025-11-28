import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getWord } from "../service/getWords";
import BaseEditForm from "../components/EditWord";
import MeaningsUpdateForm from "../components/MeaningsUpdateForm";
import RelationshipsSection from "../components/RelationshipsSection";


type WordProp = {
  params: {
    word: string;
  };
};


export default async function WordDetailPage({ params }: WordProp) {

  const { word } = params;
  
  // Decode the word parameter in case it's URL-encoded
  const decodedWord = decodeURIComponent(word);
  
  try {
    const wordData = await getWord(decodedWord);


    return (
      <div className="container mx-auto py-8 px-4 max-w-9xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/words">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vocabulary
            </Button>
          </Link>
        </div>
        <div className="space-y-6">
          <div className="flex gap-5">
            <div className="w-1/2">
              <BaseEditForm
                word={wordData?.word}
                pronunciation={wordData?.pronunciation}
                frequency={wordData?.frequency}
                overall_tone={wordData?.overall_tone}
                wordId={wordData?._id}
                etymology={wordData?.etymology}
                misspellings={wordData?.misspellings}
              />
            </div>
            <MeaningsUpdateForm
              wordId={wordData?._id}
              initialMeanings={wordData?.meanings}
            />
          </div>
          
          {/* Relationships Section */}
          <RelationshipsSection
            wordId={wordData?._id}
            currentWord={wordData?.word}
            meanings={wordData?.meanings || []}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading word:', error);
    return (
      <div className="container mx-auto py-8 px-4 max-w-9xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/words">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vocabulary
            </Button>
          </Link>
        </div>
        <div className="text-center text-destructive py-8">
          <p className="font-semibold mb-2">Failed to load word.</p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Word not found. Please check if the word exists.'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Searching for: "{decodedWord}"
          </p>
        </div>
      </div>
    );
  }
}