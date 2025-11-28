'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { removeKeysFromQuery, formUrlQuery } from '@/utils/formUrlQuery';
import qs from 'query-string';

interface ActiveFiltersIndicatorProps {
  className?: string;
}

const FILTER_LABELS: Record<string, string> = {
  search: 'Search',
  startsWith: 'Starts with',
  difficulty: 'Difficulty',
  length: 'Length',
  exactLetters: 'Exact letters',
  minLetters: 'Min letters',
  maxLetters: 'Max letters',
  letterRange: 'Letters',
  onlyAlphabets: 'Only alphabets',
  minMeanings: 'Min meanings',
};

const getFilterDisplayValue = (key: string, value: string): string => {
  switch (key) {
    case 'startsWith':
      return value.toUpperCase();
    case 'difficulty':
      return value.charAt(0).toUpperCase() + value.slice(1);
    case 'length':
      if (value === 'short') return 'Short (1-4)';
      if (value === 'medium') return 'Medium (5-8)';
      if (value === 'long') return 'Long (9+)';
      return value;
    case 'exactLetters':
      return `${value} letters`;
    case 'minMeanings':
      return `${value}+ meanings`;
    case 'onlyAlphabets':
      return 'Alphabets only';
    case 'search':
      return `"${value}"`;
    default:
      return value;
    }
};

export const ActiveFiltersIndicator = ({ className }: ActiveFiltersIndicatorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get all active filters (exclude pagination params)
  const activeFilters: Array<{ key: string; value: string; displayValue: string }> = [];
  
  const paramsToCheck = [
    'search',
    'startsWith',
    'difficulty',
    'length',
    'exactLetters',
    'minLetters',
    'maxLetters',
    'onlyAlphabets',
    'minMeanings',
  ];

  paramsToCheck.forEach((key) => {
    const value = searchParams.get(key);
    if (value && value !== '') {
      const displayValue = getFilterDisplayValue(key, value);
      activeFilters.push({ key, value, displayValue });
    }
  });

  // Handle range filters (min/max letters) together
  const minLetters = searchParams.get('minLetters');
  const maxLetters = searchParams.get('maxLetters');
  const exactLetters = searchParams.get('exactLetters');
  
  if (exactLetters) {
    // Remove min/max if exact is present
    const existingMin = activeFilters.findIndex(f => f.key === 'minLetters');
    const existingMax = activeFilters.findIndex(f => f.key === 'maxLetters');
    if (existingMin !== -1) activeFilters.splice(existingMin, 1);
    if (existingMax !== -1) activeFilters.splice(existingMax, 1);
  } else if (minLetters || maxLetters) {
    // Show as combined range filter
    const existingMin = activeFilters.findIndex(f => f.key === 'minLetters');
    const existingMax = activeFilters.findIndex(f => f.key === 'maxLetters');
    
    if (existingMin !== -1 && existingMax !== -1) {
      // Combine into one filter
      activeFilters.splice(existingMin, 1);
      activeFilters.splice(activeFilters.findIndex(f => f.key === 'maxLetters'), 1);
      activeFilters.push({
        key: 'letterRange',
        value: `${minLetters}-${maxLetters}`,
        displayValue: `${minLetters}-${maxLetters} letters`,
      });
    } else if (existingMin !== -1) {
      activeFilters[existingMin] = {
        ...activeFilters[existingMin],
        displayValue: `Min ${minLetters} letters`,
      };
    } else if (existingMax !== -1) {
      activeFilters[existingMax] = {
        ...activeFilters[existingMax],
        displayValue: `Max ${maxLetters} letters`,
      };
    }
  }

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (keyToRemove: string) => {
    const currentParams = searchParams.toString();
    
    if (keyToRemove === 'letterRange') {
      // Remove both min and max letters
      const newUrl = removeKeysFromQuery({
        params: currentParams,
        KeysToRemove: ['minLetters', 'maxLetters', 'exactLetters', 'page'],
      });
      router.push(newUrl, { scroll: false });
    } else if (keyToRemove === 'exactLetters') {
      // Also remove min/max when removing exact
      const newUrl = removeKeysFromQuery({
        params: currentParams,
        KeysToRemove: ['exactLetters', 'minLetters', 'maxLetters', 'page'],
      });
      router.push(newUrl, { scroll: false });
    } else if (keyToRemove === 'minLetters' || keyToRemove === 'maxLetters') {
      // Remove the specific one, but also check if we should remove exact
      const keysToRemove = [keyToRemove, 'page'];
      const newUrl = removeKeysFromQuery({
        params: currentParams,
        KeysToRemove: keysToRemove,
      });
      router.push(newUrl, { scroll: false });
    } else {
      const newUrl = removeKeysFromQuery({
        params: currentParams,
        KeysToRemove: [keyToRemove, 'page'],
      });
      router.push(newUrl, { scroll: false });
    }
  };

  const handleClearAll = () => {
    const currentParams = searchParams.toString();
    const newUrl = removeKeysFromQuery({
      params: currentParams,
        KeysToRemove: [
          'search',
          'startsWith',
          'difficulty',
          'length',
          'exactLetters',
          'minLetters',
          'maxLetters',
          'onlyAlphabets',
          'minMeanings',
          'page',
        ],
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 p-3 bg-muted/50 rounded-lg border ${className || ''}`}>
      {activeFilters.length > 0 && (
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mr-1">Filters:</span>
      )}
      
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full text-sm shadow-sm hover:shadow transition-shadow"
        >
          <span className="text-muted-foreground text-xs font-medium">
            {FILTER_LABELS[filter.key] || filter.key}
          </span>
          <span className="font-semibold text-foreground">{filter.displayValue}</span>
          <button
            onClick={() => handleRemoveFilter(filter.key)}
            className="ml-1 -mr-1 p-1 hover:bg-muted rounded-full transition-colors cursor-pointer group"
            aria-label={`Remove ${filter.key} filter`}
          >
            <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
      ))}
      
      {activeFilters.length > 1 && (
        <button
          onClick={handleClearAll}
          className="ml-auto px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFiltersIndicator;

