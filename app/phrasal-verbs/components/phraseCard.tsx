import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

interface PhrasalVerb {
  _id: string;
  phrase: string;
  meaning: string;
  example: string;
  difficulty?: string;
}

export function PhrasalVerbCard({ verb }: { verb: PhrasalVerb }) {
  // Difficulty styling
  const difficultyStyles = {
    easy: "bg-emerald-500/10 text-emerald-600",
    medium: "bg-amber-500/10 text-amber-600",
    hard: "bg-rose-500/10 text-rose-600",
  };

  const difficultyStyle = difficultyStyles[verb.difficulty as keyof typeof difficultyStyles] ||
    "bg-gray-500/10 text-gray-600";

  return (
    <Card className="relative group overflow-hidden border border-gray-200 shadow-none transition-all duration-300 hover:shadow-lg hover:border-gray-300 rounded-xl">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-600"></div>

      {/* Header with verb and difficulty */}
      <CardHeader className="pt-5 pb-3 px-6">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold tracking-tight text-gray-800 group-hover:text-indigo-700 transition-colors">
            {verb.phrase}
          </CardTitle>
          <Badge className={`${difficultyStyle} px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider`}>
            {verb.difficulty || 'medium'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-5">
        {/* Meaning section */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 mb-1 tracking-wide">MEANING</h3>
          <p className="text-gray-700 leading-relaxed line-clamp-2">
            {verb.meaning}
          </p>
        </div>

        {/* Example section */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-gray-500 mb-1 tracking-wide">EXAMPLE</h3>
          <div className="bg-gray-50 rounded-lg p-3 border-l-2 border-indigo-200">
            <p className="text-sm text-gray-600 italic">
              "{verb?.example || 'No example available'}"

            </p>
          </div>
        </div>

        {/* Edit button */}
        <Button
          asChild
          variant="ghost"
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 hover:border-indigo-300 group-hover:border-indigo-400 transition-all"
        >
          <Link
            href={`/phrasal-verbs/edit/${verb._id}`}
            className="flex items-center justify-center text-gray-700 group-hover:text-indigo-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            <span className="font-medium">Edit Details</span>
          </Link>
        </Button>
      </CardContent>

      {/* Hover effect elements */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-indigo-100 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 rounded-full bg-blue-100 blur-xl"></div>
      </div>
    </Card>
  );
}