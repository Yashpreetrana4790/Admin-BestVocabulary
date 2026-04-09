'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutGrid, FolderTree, Languages, AlignLeft, BookOpen, ChevronRight } from 'lucide-react';

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAllCategories = pathname === '/categories';
  const isWordCategories = pathname === '/categories/word-categories' || pathname?.startsWith('/categories/word-categories/');
  const isHomophones = pathname === '/categories/homophones' || pathname?.startsWith('/categories/homophones/');
  const isHomonyms = pathname === '/categories/homonyms' || pathname?.startsWith('/categories/homonyms/');
  const isConfusedWords = pathname === '/categories/confused-words' || pathname?.startsWith('/categories/confused-words/');

  const currentCategory = isHomophones ? 'Homophones' 
    : isHomonyms ? 'Homonyms' 
    : isConfusedWords ? 'Confused Words'
    : isWordCategories ? 'Word Categories'
    : null;

  const CurrentIcon = isHomophones ? Languages
    : isHomonyms ? AlignLeft
    : isConfusedWords ? BookOpen
    : isWordCategories ? FolderTree
    : null;

  const currentColor = isHomophones ? 'text-purple-600'
    : isHomonyms ? 'text-emerald-600'
    : isConfusedWords ? 'text-amber-600'
    : isWordCategories ? 'text-blue-600'
    : 'text-primary';

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link 
          href="/categories" 
          className={cn(
            "flex items-center gap-1.5 transition-colors",
            isAllCategories 
              ? "text-foreground font-medium" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Categories
        </Link>
        
        {currentCategory && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className={cn("flex items-center gap-1.5 font-medium", currentColor)}>
              {CurrentIcon && <CurrentIcon className="h-4 w-4" />}
              {currentCategory}
            </span>
          </>
        )}
      </div>

      {/* Main Content */}
      {children}
    </div>
  );
}
