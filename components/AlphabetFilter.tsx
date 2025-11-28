'use client';

import { formUrlQuery, removeKeysFromQuery } from '@/utils/formUrlQuery';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import qs from 'query-string';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface AlphabetFilterProps {
  className?: string;
}

export const AlphabetFilter = ({ className }: AlphabetFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLetter = searchParams.get('startsWith')?.toUpperCase() || null;

  const handleLetterClick = (letter: string) => {
    const currentParams = searchParams.toString();
    
    if (selectedLetter === letter) {
      // Deselect if already selected
      const newUrl = removeKeysFromQuery({
        params: currentParams,
        KeysToRemove: ['startsWith', 'page']
      });
      router.push(newUrl, { scroll: false });
    } else {
      // Select new letter and reset page to 1
      // Parse current params
      const parsedParams = qs.parse(currentParams);
      parsedParams.startsWith = letter.toLowerCase();
      parsedParams.page = '1';
      
      // Build new URL
      const newUrl = qs.stringifyUrl({
        url: window.location.pathname,
        query: parsedParams,
      }, { skipNull: true });
      
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2 p-4 bg-zinc-50 dark:bg-zinc-900', className)}>
      <div className="w-full mb-2">
        <span className="text-sm font-medium text-muted-foreground">Filter by letter:</span>
      </div>
      <div className="flex flex-wrap gap-2 w-full">
        {ALPHABET.map((letter) => {
          const isActive = selectedLetter === letter;
          return (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer',
                'border-2',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-background hover:bg-muted border-border hover:border-primary/50'
              )}
              aria-pressed={isActive}
            >
              {letter}
            </button>
          );
        })}
        {selectedLetter && (
          <button
            onClick={() => {
              const newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                KeysToRemove: ['startsWith', 'page']
              });
              router.push(newUrl, { scroll: false });
            }}
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default AlphabetFilter;

