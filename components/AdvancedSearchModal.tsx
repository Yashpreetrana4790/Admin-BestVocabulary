'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formUrlQuery, removeKeysFromQuery } from '@/utils/formUrlQuery';
import qs from 'query-string';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DIFFICULTY_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
];

const LENGTH_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'short', label: 'Short (1-4 letters)' },
  { value: 'medium', label: 'Medium (5-8 letters)' },
  { value: 'long', label: 'Long (9+ letters)' },
];

export const AdvancedSearchModal = ({ isOpen, onClose }: AdvancedSearchModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form state
  const [minLetters, setMinLetters] = useState<string>('');
  const [maxLetters, setMaxLetters] = useState<string>('');
  const [exactLetters, setExactLetters] = useState<string>('');
  const [startsWith, setStartsWith] = useState<string>('');
  const [onlyAlphabets, setOnlyAlphabets] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [minMeanings, setMinMeanings] = useState<string>('');

  // Load current filters from URL params
  useEffect(() => {
    if (isOpen) {
      setStartsWith(searchParams.get('startsWith') || '');
      setDifficulty(searchParams.get('difficulty') || '');
      setLength(searchParams.get('length') || '');
      setOnlyAlphabets(searchParams.get('onlyAlphabets') === 'true');
      
      // Check if exact letter count is set (custom param we'll add)
      const exactCount = searchParams.get('exactLetters');
      if (exactCount) {
        setExactLetters(exactCount);
      } else {
        setMinLetters(searchParams.get('minLetters') || '');
        setMaxLetters(searchParams.get('maxLetters') || '');
      }
      setMinMeanings(searchParams.get('minMeanings') || '');
    }
  }, [isOpen, searchParams]);

  const handleApplyFilters = () => {
    const currentParams = searchParams.toString();
    const parsedParams = qs.parse(currentParams);

    // Clear previous filters
    delete parsedParams.startsWith;
    delete parsedParams.difficulty;
    delete parsedParams.length;
    delete parsedParams.onlyAlphabets;
    delete parsedParams.exactLetters;
    delete parsedParams.minLetters;
    delete parsedParams.maxLetters;
    delete parsedParams.minMeanings;
    delete parsedParams.page; // Reset to page 1

    // Apply new filters
    if (startsWith) parsedParams.startsWith = startsWith.toLowerCase();
    if (difficulty) parsedParams.difficulty = difficulty;
    if (length) parsedParams.length = length;
    if (onlyAlphabets) parsedParams.onlyAlphabets = 'true';
    if (exactLetters) {
      parsedParams.exactLetters = exactLetters;
    } else {
      if (minLetters) parsedParams.minLetters = minLetters;
      if (maxLetters) parsedParams.maxLetters = maxLetters;
    }
    if (minMeanings) parsedParams.minMeanings = minMeanings;

    // Reset page to 1
    parsedParams.page = '1';

    const newUrl = qs.stringifyUrl({
      url: window.location.pathname,
      query: parsedParams,
    }, { skipNull: true });

    router.push(newUrl, { scroll: false });
    onClose();
  };

  const handleClearFilters = () => {
    const currentParams = searchParams.toString();
    const newUrl = removeKeysFromQuery({
      params: currentParams,
      KeysToRemove: ['startsWith', 'difficulty', 'length', 'onlyAlphabets', 'exactLetters', 'minLetters', 'maxLetters', 'minMeanings', 'page']
    });
    router.push(newUrl, { scroll: false });
    
    // Reset form
    setStartsWith('');
    setMinLetters('');
    setMaxLetters('');
    setExactLetters('');
    setOnlyAlphabets(false);
    setDifficulty('');
    setLength('');
    setMinMeanings('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border rounded-xl shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm">Go to Search</span>
            </button>
            <h2 className="text-2xl font-bold">Word Finder</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Basic Search Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b pb-2">Basic Search</h3>
            
            {/* Starting with - Letter Input */}
            <div className="space-y-2">
              <Label htmlFor="startsWith">Starting with</Label>
              <div className="flex items-center gap-3">
              <Input
                id="startsWith"
                type="text"
                placeholder="A-Z"
                maxLength={1}
                value={startsWith.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
                  setStartsWith(value);
                }}
                className="w-24 text-center text-xl font-bold uppercase tracking-wider"
              />
                <Button
                  onClick={handleApplyFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find Word
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Section */}
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b pb-2">Advanced Filters</h3>
            
            {/* Letter Count Section */}
            <div className="space-y-4">
              <Label>Number of Letters</Label>
              
              {/* Exact Count */}
              <div className="space-y-2">
                <Label htmlFor="exactLetters" className="text-sm font-normal text-muted-foreground">Exact count</Label>
                <Input
                  id="exactLetters"
                  type="number"
                  min="1"
                  placeholder="Enter exact number"
                  value={exactLetters}
                  onChange={(e) => {
                    setExactLetters(e.target.value);
                    if (e.target.value) {
                      setMinLetters('');
                      setMaxLetters('');
                    }
                  }}
                />
              </div>

              {/* Range - Between X and Y */}
              <div className="space-y-2">
                <Label className="text-sm font-normal text-muted-foreground">Between</Label>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                  <Input
                    id="minLetters"
                    type="number"
                    min="1"
                    placeholder="#"
                    value={minLetters}
                    onChange={(e) => {
                      setMinLetters(e.target.value);
                      if (e.target.value) setExactLetters('');
                    }}
                    disabled={!!exactLetters}
                  />
                  <span className="text-muted-foreground">and</span>
                  <Input
                    id="maxLetters"
                    type="number"
                    min="1"
                    placeholder="#"
                    value={maxLetters}
                    onChange={(e) => {
                      setMaxLetters(e.target.value);
                      if (e.target.value) setExactLetters('');
                    }}
                    disabled={!!exactLetters}
                  />
                </div>
              </div>
            </div>

            {/* Word Length Category */}
            <div className="space-y-2">
              <Label htmlFor="length">Word Length Category</Label>
              <select
                id="length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              >
                {LENGTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Only Alphabets Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="onlyAlphabets"
                checked={onlyAlphabets}
                onChange={(e) => setOnlyAlphabets(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
              />
              <Label htmlFor="onlyAlphabets" className="cursor-pointer text-sm">
                Only include words with alphabets (no numbers or special characters)
              </Label>
            </div>

            {/* Minimum Number of Meanings */}
            <div className="space-y-2">
              <Label htmlFor="minMeanings">Minimum Number of Meanings</Label>
              <Input
                id="minMeanings"
                type="number"
                min="1"
                placeholder="e.g., 2 (shows words with 2+ meanings)"
                value={minMeanings}
                onChange={(e) => setMinMeanings(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Show only words that have at least this many meanings
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t sticky bottom-0 bg-background rounded-b-xl">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="cursor-pointer"
          >
            Clear All
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <Search className="h-4 w-4 mr-2" />
              Find Word
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;

