import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, AlertCircle, Shuffle } from "lucide-react";
import Link from "next/link";
import { getWord } from "../service/getWords";
import BaseEditForm from "../components/EditWord";
import MeaningsUpdateForm from "../components/MeaningsUpdateForm";
import RelationshipsSection from "../components/RelationshipsSection";
import { Card, CardContent } from "@/components/ui/card";


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

  // Handle error case - word not found or fetch failed
  if (!wordData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto py-8 px-4 max-w-9xl">
          <div className="mb-8">
            <Link href="/words">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vocabulary
              </Button>
            </Link>
          </div>
          
          <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-800">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-red-100 dark:bg-red-950/50 mb-4">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
                Word Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The word &quot;{decodedWord}&quot; could not be found. It may have been deleted or the URL is incorrect.
              </p>
              <Button asChild>
                <Link href="/words">
                  Go to Words List
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Extract _id properly (handle both string and { $oid: string } formats)
  const wordId = typeof wordData._id === 'object' && wordData._id?.$oid 
    ? wordData._id.$oid 
    : (wordData._id || '');

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
                note={wordData?.note || ''}
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
