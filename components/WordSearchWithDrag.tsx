'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Check, GripVertical } from 'lucide-react';

interface WordOption {
  word: string;
  _id?: string;
  pronunciation?: string;
  meanings?: Array<{
    meaning: string;
    pos?: string;
  }>;
}

interface WordSearchWithDragProps {
  value: string;
  onChange: (word: WordOption | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  cardId: 'word1' | 'word2';
  onDragStart?: (word: WordOption, cardId: 'word1' | 'word2') => void;
  onDrop?: (word: WordOption, targetCardId: 'word1' | 'word2') => void;
  onDragOver?: (cardId: 'word1' | 'word2') => void;
  onDragLeave?: () => void;
  isDragging?: boolean;
  dragOver?: boolean;
}

export default function WordSearchWithDrag({ 
  value, 
  onChange, 
  placeholder = "Search for a word...", 
  label,
  className,
  cardId,
  onDragStart,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragging = false,
  dragOver = false
}: WordSearchWithDragProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<WordOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordOption | null>(null);
  const [isDraggingFromHere, setIsDraggingFromHere] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync searchTerm with value prop
  useEffect(() => {
    if (value && value !== searchTerm) {
      setSearchTerm(value);
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
        cache: 'no-store'
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

    if (term && (!selectedWord || selectedWord.word !== term)) {
      onChange({
        word: term,
        _id: selectedWord?._id,
        pronunciation: selectedWord?.pronunciation,
        meanings: selectedWord?.meanings
      });
    }

    if (selectedWord && selectedWord.word !== term) {
      setSelectedWord(null);
    }

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

  const handleDragStart = (e: React.DragEvent, word: WordOption) => {
    if (!word.word) return;
    
    setIsDraggingFromHere(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ word, cardId }));
    
    if (onDragStart) {
      onDragStart(word, cardId);
    }

    // Create a drag image
    const dragImage = document.createElement('div');
    dragImage.textContent = word.word;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.cardId !== cardId) {
        // Only highlight if dragging from the other card
      }
    } catch (error) {
      // Ignore parse errors during drag over
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDragOver) {
      onDragOver(cardId);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const { word, cardId: sourceCardId } = data;

      if (sourceCardId && sourceCardId !== cardId && word) {
        handleSelectWord(word);
        if (onDrop) {
          onDrop(word, cardId);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    
    setIsDraggingFromHere(false);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only trigger leave if we're actually leaving the component
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      if (onDragLeave) {
        onDragLeave();
      }
    }
  };

  const handleDragEnd = () => {
    setIsDraggingFromHere(false);
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className} ${dragOver ? 'ring-2 ring-primary rounded-md p-2' : ''}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
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
                  <div
                    key={word._id || index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word)}
                    onDragEnd={handleDragEnd}
                    className="cursor-move"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectWord(word)}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
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
                      </div>
                      {selectedWord?.word === word.word && (
                        <Check className="h-4 w-4 text-primary shrink-0 ml-2" />
                      )}
                    </button>
                  </div>
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

      {/* Selected Word Card - Draggable */}
      {selectedWord && (
        <div
          ref={cardRef}
          draggable
          onDragStart={(e) => handleDragStart(e, selectedWord)}
          onDragEnd={handleDragEnd}
          className={`mt-3 p-3 bg-muted rounded-md text-sm border-2 transition-all cursor-move ${
            dragOver ? 'border-primary bg-primary/10' : 'border-transparent'
          } ${isDraggingFromHere ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <div className="font-semibold flex-1">{selectedWord.word}</div>
          </div>
          {selectedWord.pronunciation && (
            <div className="text-muted-foreground text-xs mb-1">{selectedWord.pronunciation}</div>
          )}
          {selectedWord.meanings && selectedWord.meanings.length > 0 && (
            <div className="text-muted-foreground text-xs">
              {selectedWord.meanings[0].meaning}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2 italic">
            💡 Drag this card to swap with the other word
          </div>
        </div>
      )}

      {/* Drop Zone Indicator for empty card */}
      {dragOver && !selectedWord && (
        <div className="mt-3 p-6 border-2 border-dashed border-primary bg-primary/5 rounded-md text-center text-sm text-muted-foreground">
          Drop word here to swap
        </div>
      )}
    </div>
  );
}

