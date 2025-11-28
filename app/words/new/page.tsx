import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BaseEditForm from "../components/EditWord";

export default function NewWordPage() {
  // For new word, we only show the basic form initially
  // After creation, user will be redirected to edit page where they can add meanings and relationships
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
        <div className="max-w-2xl">
          <BaseEditForm
            wordId="" // Empty for new word
            word=""
            pronunciation=""
            frequency="medium"
            overall_tone=""
            etymology=""
            misspellings={[]}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            After creating the word, you'll be redirected to the edit page where you can add meanings and relationships.
          </p>
        </div>
      </div>
    </div>
  );
}

