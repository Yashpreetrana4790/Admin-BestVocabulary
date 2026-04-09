import React from 'react';
import { getAllQuestions } from './service/getAllQuestions';
import { Lightbulb, HelpCircle, FileEdit, AlertCircle } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { PaginationControls } from '@/components/PaginationControl';

const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
    case 'intermediate':
      return 'bg-amber-500/10 text-amber-600 border-amber-200';
    case 'hard':
      return 'bg-rose-500/10 text-rose-600 border-rose-200';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'multiple-choice':
      return (
        <div className="p-2.5 rounded-xl bg-blue-500/10">
          <HelpCircle className="h-5 w-5 text-blue-600" />
        </div>
      );
    case 'fill-in-the-blank':
      return (
        <div className="p-2.5 rounded-xl bg-purple-500/10">
          <FileEdit className="h-5 w-5 text-purple-600" />
        </div>
      );
    default:
      return (
        <div className="p-2.5 rounded-xl bg-muted">
          <Lightbulb className="h-5 w-5 text-muted-foreground" />
        </div>
      );
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
    const { data: questions, pagination } = await getAllQuestions(page, 12);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Questions</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage quiz questions
            </p>
          </div>
        </div>

        {/* Search */}
        <SearchBar route="/questions" showAdvanced={false} title="Search Questions" />

        {questions && questions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {questions.map((q: Question) => (
                <div
                  key={q._id}
                  className="group rounded-2xl border bg-card p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col relative overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    {getTypeIcon(q.type)}
                    <span className="font-semibold text-sm text-foreground">{q.category}</span>
                  </div>

                  {/* Question */}
                  <p className="text-foreground font-medium mb-4 line-clamp-3 min-h-[4rem] relative z-10">
                    {q.description}
                  </p>

                  {/* Answer */}
                  <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl mb-3 relative z-10">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-primary capitalize">A:</span>
                      <p className="text-sm text-foreground/80 font-medium">{q.answer}</p>
                    </div>
                  </div>

                  {/* Hint */}
                  <div className="flex items-start gap-2 mb-4 relative z-10">
                    <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      {q.hint}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-auto pt-3 border-t relative z-10">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyStyles(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    {q.options.length > 0 && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                        {q.options.length} options
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border bg-card">
            <div className="p-4 rounded-2xl bg-purple-500/10 mb-6">
              <HelpCircle className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No questions found</h3>
            <p className="text-muted-foreground max-w-md">
              There are no questions in the database yet. Add some questions to get started.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading questions:', error);
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Questions</h1>
            <p className="text-muted-foreground mt-1">
              Browse and manage quiz questions
            </p>
          </div>
        </div>

        <SearchBar route="/questions" showAdvanced={false} title="Search Questions" />

        {/* Error State */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Failed to load questions</h2>
              <p className="text-sm text-muted-foreground">
                {process.env.NODE_ENV === 'development' && error instanceof Error
                  ? error.message
                  : 'Please check your connection and try again later.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default QuestionsPage;
