import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getWord } from "../service/getWords";
import BaseEditForm from "../components/EditWord";
import MeaningsUpdateForm from "../components/MeaningsUpdateForm";


type WordProp = {
  params: {
    word: string;
  };
};


export default async function WordDetailPage({ params }: WordProp) {

  const { word } = params;
  const wordData = await getWord(word);


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
      <div className="flex  gap-5">

        <BaseEditForm
          word={wordData?.word}
          pronunciation={wordData?.pronunciation}
          frequency={wordData?.frequency}
          overall_tone={wordData?.overall_tone}
          wordId={wordData?._id}
          etymology={wordData?.etymology}
          misspellings={wordData?.misspellings}
        />
        <MeaningsUpdateForm
          wordId={wordData?._id}
          initialMeanings={wordData?.meanings}


        />
      </div>
    </div>
  );
}