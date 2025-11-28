import React from 'react';
import { getAllQuestions } from './service/getAllQuestions';
import { Lightbulb, HelpCircle, FileEdit } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { PaginationControls } from '@/components/PaginationControl';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return <HelpCircle className="h-5 w-5 text-blue-500" />;
    case 'fill-in-the-blank':
      return <FileEdit className="h-5 w-5 text-purple-500" />;
    default:
      return <Lightbulb className="h-5 w-5 text-gray-500" />;
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



const QuestionsPage = async ({ searchParams }: { searchParams: { page: string, search: string } }) => {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  try {
    const { data: questions, pagination } = await getAllQuestions(page, 10);

    console.log(questions, "questionsLL")

    // Handle empty results
    if (!questions || questions.length === 0) {
      return (
        <>
          <SearchBar route="/questions" showAdvanced={false} title="All Questions" />
          <div className="text-center py-8 text-muted-foreground">
            No questions found. Please add some questions first.
          </div>
        </>
      );
    }

    return (
      <>
        <SearchBar route="/questions" showAdvanced={false} title="All Questions" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          {questions.map((q: Question) => (

          <div
            key={q._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition duration-200 p-5 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              {getTypeIcon(q.type)}
              <span className="font-semibold text-lg">{q.category}</span>
            </div>

            {/* Question */}
            <p className="text-gray-800 font-medium mb-3">{q.description}</p>

            {/* Answer */}
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-3">
              <strong>Answer:</strong> {q.answer}
            </div>

            {/* Hint */}
            <p className="text-xs text-gray-500 italic mb-3">
              💡 {q.hint}
            </p>

            {/* Tags */}
            <div className="flex justify-between items-center mt-auto">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  q.difficulty
                )}`}
              >
                {q.difficulty}
              </span>
              {q.options.length > 0 && (
                <span className="text-xs text-gray-500">
                  {q.options.length} option{q.options.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading questions:', error);
    return (
      <>
        <SearchBar route="/questions" showAdvanced={false} title="All Questions" />
        <div className="p-4">
          <div className="text-center text-destructive py-8">
            <p className="font-semibold mb-2">Failed to load questions.</p>
            <p className="text-sm text-muted-foreground">
              {process.env.NODE_ENV === 'development' && error instanceof Error
                ? error.message
                : 'Please check your connection and try again later.'}
            </p>
          </div>
        </div>
      </>
    );
  }
};

export default QuestionsPage;
