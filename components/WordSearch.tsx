'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Check } from 'lucide-react';

interface WordOption {
  word: string;
  _id?: string;
  pronunciation?: string;
  meanings?: Array<{
    meaning: string;
    pos?: string;
  }>;
}

interface WordSearchProps {
  value: string;
  onChange: (word: WordOption | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function WordSearch({ 
  value, 
  onChange, 
  placeholder = "Search for a word...", 
  label,
  className 
}: WordSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<WordOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordOption | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync searchTerm with value prop
  useEffect(() => {
    if (value && value !== searchTerm) {
      setSearchTerm(value);
      // Try to fetch word details if we have just the word string
      if (!selectedWord || selectedWord.word !== value) {
        fetchWordDetails(value);
      }
    } else if (!value && searchTerm) {
      setSearchTerm('');
      setSelectedWord(null);
    }
  }, [value]);

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

  const fetchWordDetails = async (word: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) return;

      const encodedWord = encodeURIComponent(word);
      const res = await fetch(`${apiUrl}/words/words/${encodedWord}`);
      if (res.ok) {
        const wordData = await res.json();
        setSelectedWord({
          word: wordData.word,
          _id: wordData._id,
          pronunciation: wordData.pronunciation,
          meanings: wordData.meanings
        });
        setSearchTerm(wordData.word);
      }
    } catch (error) {
      console.error('Error fetching word details:', error);
    }
  };

  const handleSearch = async (term: string) => {
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

      const query = new URLSearchParams({
        search: term.trim(),
        limit: '10',
        page: '1'
      });

      const response = await fetch(`${apiUrl}/words/words?${query.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Client-side fetch
      });

      if (!response.ok) {
        throw new Error('Failed to fetch words');
      }

      const data = await response.json();

      if (data?.words) {
        const wordOptions: WordOption[] = data.words.map((w: any) => ({
          word: w.word,
          _id: w._id,
          pronunciation: w.pronunciation,
          meanings: w.meanings?.slice(0, 1) || []
        }));
        setResults(wordOptions);
      }
    } catch (error) {
      console.error('Error searching words:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Allow manual entry - pass the word even if not selected from dropdown
    if (term && (!selectedWord || selectedWord.word !== term)) {
      onChange({
        word: term,
        _id: selectedWord?._id,
        pronunciation: selectedWord?.pronunciation,
        meanings: selectedWord?.meanings
      });
    }

    // Clear selection if user is typing something different
    if (selectedWord && selectedWord.word !== term) {
      setSelectedWord(null);
    }

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (term.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(term);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleBlur = () => {
    // Allow a moment for click events on dropdown items
    setTimeout(() => {
      setShowResults(false);
      // If user typed something but didn't select from dropdown, use the typed value
      if (searchTerm && searchTerm.trim()) {
        onChange({
          word: searchTerm.trim(),
          _id: selectedWord?._id,
          pronunciation: selectedWord?.pronunciation,
          meanings: selectedWord?.meanings
        });
      }
    }, 200);
  };

  const handleSelectWord = (word: WordOption) => {
    setSelectedWord(word);
    setSearchTerm(word.word);
    setShowResults(false);
    onChange(word);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedWord(null);
    setShowResults(false);
    onChange(null);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          {selectedWord && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (results.length > 0 || isSearching) && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="py-1">
                {results.map((word, index) => (
                  <button
                    key={word._id || index}
                    type="button"
                    onClick={() => handleSelectWord(word)}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{word.word}</div>
                      {word.pronunciation && (
                        <div className="text-xs text-muted-foreground">{word.pronunciation}</div>
                      )}
                      {word.meanings && word.meanings.length > 0 && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {word.meanings[0].meaning}
                        </div>
                      )}
                    </div>
                    {selectedWord?.word === word.word && (
                      <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            ) : searchTerm.length >= 2 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <div>No words found</div>
                <div className="text-xs mt-1">You can still use "{searchTerm}" manually</div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Selected Word Info */}
      {selectedWord && (
        <div className="mt-2 p-3 bg-muted rounded-md text-sm">
          <div className="font-semibold">{selectedWord.word}</div>
          {selectedWord.pronunciation && (
            <div className="text-muted-foreground">{selectedWord.pronunciation}</div>
          )}
          {selectedWord.meanings && selectedWord.meanings.length > 0 && (
            <div className="text-muted-foreground mt-1">
              {selectedWord.meanings[0].meaning}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

