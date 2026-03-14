import React from 'react';
import { getAllQuestions } from './service/getAllQuestions';
import { Lightbulb, HelpCircle, FileEdit } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { PaginationControls } from '@/components/PaginationControl';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'intermediate':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'hard':
      return 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-800';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/30"><HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" /></div>;
    case 'fill-in-the-blank':
      return <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/30"><FileEdit className="h-5 w-5 text-purple-600 dark:text-purple-400" /></div>;
    default:
      return <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"><Lightbulb className="h-5 w-5 text-gray-600 dark:text-gray-400" /></div>;
  }
};


type Question = {
  answer: string;
  category: string;
  description: string;
  difficulty: string;
  hint: string;
  options: string[];
  type: string;
  __v: number;
  _id: string;
};



const QuestionsPage = async ({ searchParams }: { searchParams: Promise<{ page: string, search: string }> }) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const { data: questions, pagination } = await getAllQuestions(page, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <SearchBar route="/questions" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {questions.map((q: Question) => (
          <div
            key={q._id}
            className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col relative overflow-hidden"
          >
            {/* Decorative gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 dark:from-purple-950/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-3 relative z-10">
              {getTypeIcon(q.type)}
              <span className="font-bold text-base">{q.category}</span>
            </div>

            {/* Question */}
            <p className="text-gray-800 dark:text-gray-200 font-medium mb-4 line-clamp-3 min-h-[3.6rem] relative z-10">
              {q.description}
            </p>

            {/* Answer */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-100 dark:border-purple-900 p-3 rounded-lg mb-3 relative z-10">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400">A:</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{q.answer}</p>
              </div>
            </div>

            {/* Hint */}
            <div className="flex items-start gap-2 mb-3 relative z-10">
              <span className="text-amber-500">💡</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic line-clamp-2">
                {q.hint}
              </p>
            </div>

            {/* Tags */}
            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200 dark:border-gray-800 relative z-10">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                  q.difficulty
                )}`}
              >
                {q.difficulty}
              </span>
              {q.options.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {q.options.length} option{q.options.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <PaginationControls
        currentPage={pagination?.currentPage}
        totalPages={pagination?.totalPages}
        itemsPerPage={pagination?.itemsPerPage}
        totalItems={pagination?.totalItems}
      />
    </div>
  );
};

export default QuestionsPage;
