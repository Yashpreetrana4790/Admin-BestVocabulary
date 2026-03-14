'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type RelatedItemType = 'word' | 'expression' | 'idiom' | 'phrase';

export interface RelatedItem {
  id: string;
  type: RelatedItemType;
  text: string; // word, phrase, idiom, or expression text
  meaning?: string;
  pronunciation?: string;
}

interface RelatedItemSearchProps {
  value: RelatedItem[];
  onChange: (items: RelatedItem[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function RelatedItemSearch({ 
  value = [], 
  onChange, 
  placeholder = "Search for words, expressions, idioms, or phrases...", 
  label,
  className
}: RelatedItemSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<RelatedItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedType, setSelectedType] = useState<RelatedItemType>('word');
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const typeLabels = {
    word: 'Words',
    expression: 'Expressions',
    idiom: 'Idioms',
    phrase: 'Phrasal Verbs'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (term: string, type: RelatedItemType) => {
    if (!term || term.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
      }

      const searchTerm = term.trim();
      let items: RelatedItem[] = [];

      // Search based on selected type
      switch (type) {
        case 'word': {
          const query = new URLSearchParams({
            search: searchTerm,
            limit: '10',
            page: '1'
          });
          const response = await fetch(`${apiUrl}/words/words?${query.toString()}`);
          if (response.ok) {
            const data = await response.json();
            items = (data.words || []).map((w: any) => ({
              id: w._id,
              type: 'word' as RelatedItemType,
              text: w.word,
              meaning: w.meanings?.[0]?.meaning,
              pronunciation: w.pronunciation
            }));
          }
          break;
        }
        case 'expression': {
          // Expressions might be stored in words or need a separate endpoint
          // For now, search in words that might be expressions
          const query = new URLSearchParams({
            search: searchTerm,
            limit: '10',
            page: '1'
          });
          try {
            const response = await fetch(`${apiUrl}/words/words?${query.toString()}`);
            if (response.ok) {
              const data = await response.json();
              // Filter or map words that could be expressions
              items = (data.words || []).map((w: any) => ({
                id: w._id,
                type: 'expression' as RelatedItemType,
                text: w.word,
                meaning: w.meanings?.[0]?.meaning,
                pronunciation: w.pronunciation
              }));
            }
          } catch (error) {
            console.warn('Expression search not available:', error);
          }
          break;
        }
        case 'idiom': {
          const query = new URLSearchParams({
            search: searchTerm,
            limit: '10'
          });
          const response = await fetch(`${apiUrl}/idioms/allidioms?${query.toString()}`);
          if (response.ok) {
            const data = await response.json();
            items = (data.data || []).map((i: any) => ({
              id: i._id,
              type: 'idiom' as RelatedItemType,
              text: i.idiom,
              meaning: i.meaning
            }));
          }
          break;
        }
        case 'phrase': {
          const query = new URLSearchParams({
            search: searchTerm,
            limit: '10'
          });
          const response = await fetch(`${apiUrl}/phrase/allphrases?${query.toString()}`);
          if (response.ok) {
            const data = await response.json();
            items = (data.data || []).map((p: any) => ({
              id: p._id,
              type: 'phrase' as RelatedItemType,
              text: p.phrase,
              meaning: p.meaning
            }));
          }
          break;
        }
      }

      setResults(items);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (term.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(term, selectedType);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelectItem = (item: RelatedItem) => {
    // Check if item already exists
    const exists = value.some(v => v.id === item.id && v.type === item.type);
    if (!exists) {
      onChange([...value, item]);
    }
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = value.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleTypeChange = (type: RelatedItemType) => {
    setSelectedType(type);
    if (searchTerm.length >= 2) {
      handleSearch(searchTerm, type);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      
      {/* Type Selector */}
      <div className="flex gap-2 mb-2 flex-wrap">
        {(Object.keys(typeLabels) as RelatedItemType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
              selectedType === type
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border hover:bg-muted'
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (results.length > 0 || isSearching) && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching {typeLabels[selectedType]}...
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((item, index) => {
                const exists = value.some(v => v.id === item.id && v.type === item.type);
                return (
                  <button
                    key={`${item.id}-${index}`}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    disabled={exists}
                    className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center justify-between ${
                      exists ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {typeLabels[item.type]}
                        </Badge>
                        <div className="font-semibold truncate">{item.text}</div>
                      </div>
                      {item.pronunciation && (
                        <div className="text-xs text-muted-foreground mt-1">{item.pronunciation}</div>
                      )}
                      {item.meaning && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {item.meaning}
                        </div>
                      )}
                    </div>
                    {exists ? (
                      <Check className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                    ) : (
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">Click to add</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No {typeLabels[selectedType].toLowerCase()} found
            </div>
          ) : null}
        </div>
      )}

      {/* Selected Items */}
      {value.length > 0 && (
        <div className="mt-3 space-y-2">
          {value.map((item, index) => (
            <div
              key={`${item.id}-${item.type}-${index}`}
              className="flex items-center justify-between p-2 bg-muted rounded-md text-sm border"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[item.type]}
                  </Badge>
                  <span className="font-semibold truncate">{item.text}</span>
                </div>
                {item.meaning && (
                  <div className="text-xs text-muted-foreground truncate mt-1">
                    {item.meaning}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="ml-2 text-red-500 hover:text-red-700 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

