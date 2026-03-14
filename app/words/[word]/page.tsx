import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, AlertCircle, Shuffle } from "lucide-react";
import Link from "next/link";
import { getWord } from "../service/getWords";
import BaseEditForm from "../components/EditWord";
import MeaningsUpdateForm from "../components/MeaningsUpdateForm";
import { WordRelationsTab } from "../components/WordRelationsTab";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type WordProp = {
  params: {
    word: string;
  };
};


export default async function WordDetailPage({ params }: WordProp) {

  const { word } = params;
  const decodedWord = decodeURIComponent(word);
  const wordData = await getWord(decodedWord);
  
  // Debug logging
  console.log('📄 Word detail page - wordData received:', {
    hasData: !!wordData,
    word: wordData?.word,
    hasMeanings: !!wordData?.meanings,
    meaningsCount: wordData?.meanings?.length || 0,
    hasEtymology: !!wordData?.etymology,
    hasPronunciation: !!wordData?.pronunciation,
    meaningsPreview: wordData?.meanings?.slice(0, 2).map((m: any) => ({ 
      pos: m?.pos, 
      meaning: m?.meaning?.substring(0, 50) 
    })) || []
  });

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto py-8 px-4 max-w-9xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/words">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vocabulary
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {wordData?.word || 'Word Details'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {wordData?.pronunciation && `/${wordData.pronunciation}/`}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Details & Meanings
              </TabsTrigger>
              <TabsTrigger value="relations" className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                Relations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <BaseEditForm
                    word={wordData?.word || ''}
                    pronunciation={wordData?.pronunciation || ''}
                    frequency={wordData?.frequency || ''}
                    overall_tone={wordData?.overall_tone || ''}
                    wordId={wordId}
                    etymology={wordData?.etymology || ''}
                    misspellings={wordData?.misspellings || []}
                    note={wordData?.note || ''}
                  />
                </div>
                <div className="space-y-6">
                  <MeaningsUpdateForm
                    wordId={wordId}
                    initialMeanings={wordData?.meanings || []}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="relations" className="mt-6">
              <WordRelationsTab
                wordId={wordId}
                currentWord={wordData?.word || ''}
                initialSynonyms={[]}
                initialAntonyms={[]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}