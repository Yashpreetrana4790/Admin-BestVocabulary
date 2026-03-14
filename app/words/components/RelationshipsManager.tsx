'use client';

import { useState, useEffect } from 'react';
import { Search, X, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getWords } from '../service/getWords';
import { WordData } from '@/types/word';
import { updateWordRelationships } from '../service/updateRelationships';

interface RelationshipsManagerProps {
  wordId: string;
  currentWord: string;
  meaningId: string;
  meaningIndex: number;
  currentSynonyms?: Array<{ _id: string; word: string } | string>;
  currentAntonyms?: Array<{ _id: string; word: string } | string>;
}

export default function RelationshipsManager({
  wordId,
  currentWord,
  meaningId,
  meaningIndex,
  currentSynonyms = [],
  currentAntonyms = []
}: RelationshipsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WordData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Parse current synonyms/antonyms - handle both object and string formats
  const parseIds = (items: Array<{ _id: string; word: string } | string>) => {
    return items.map(item => typeof item === 'string' ? item : item._id);
  };
  
  const parseWords = (items: Array<{ _id: string; word: string } | string>) => {
    return items.reduce((acc: Record<string, string>, item) => {
      if (typeof item === 'string') {
        acc[item] = 'Loading...';
      } else {
        acc[item._id] = item.word;
      }
      return acc;
    }, {});
  };
  
  const [synonyms, setSynonyms] = useState<string[]>(parseIds(currentSynonyms));
  const [antonyms, setAntonyms] = useState<string[]>(parseIds(currentAntonyms));
  const [synonymWords, setSynonymWords] = useState<Record<string, string>>(parseWords(currentSynonyms));
  const [antonymWords, setAntonymWords] = useState<Record<string, string>>(parseWords(currentAntonyms));
  const [draggedWord, setDraggedWord] = useState<WordData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Search for words
  useEffect(() => {
    const searchWords = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await getWords({
          search: searchQuery,
          limit: 10,
          page: 1
        });
        // Filter out the current word and already added words
        const filtered = results.words.filter(
          (w: WordData) =>
            w.word.toLowerCase() !== currentWord.toLowerCase() &&
            !synonyms.includes(w._id) &&
            !antonyms.includes(w._id)
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchWords, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, currentWord, synonyms, antonyms]);

  // Handle drag start
  const handleDragStart = (word: WordData) => {
    setDraggedWord(word);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, relationType: 'synonym' | 'antonym') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, relationType: 'synonym' | 'antonym') => {
    e.preventDefault();
    if (!draggedWord) return;

    const wordId = draggedWord._id;
    const word = draggedWord.word;

    if (relationType === 'synonym') {
      if (!synonyms.includes(wordId)) {
        setSynonyms([...synonyms, wordId]);
        setSynonymWords({ ...synonymWords, [wordId]: word });
      }
    } else {
      if (!antonyms.includes(wordId)) {
        setAntonyms([...antonyms, wordId]);
        setAntonymWords({ ...antonymWords, [wordId]: word });
      }
    }

    // Remove from search results
    setSearchResults(searchResults.filter(w => w._id !== wordId));
    setDraggedWord(null);
  };

  // Remove relationship
  const handleRemove = (wordId: string, relationType: 'synonym' | 'antonym') => {
    if (relationType === 'synonym') {
      setSynonyms(synonyms.filter(id => id !== wordId));
      const { [wordId]: removed, ...rest } = synonymWords;
      setSynonymWords(rest);
    } else {
      setAntonyms(antonyms.filter(id => id !== wordId));
      const { [wordId]: removed, ...rest } = antonymWords;
      setAntonymWords(rest);
    }
  };

  // Load word names for IDs that don't have them
  useEffect(() => {
    const loadMissingWordNames = async () => {
      const allIds = [...synonyms, ...antonyms];
      const missingIds = allIds.filter(id => !synonymWords[id] && !antonymWords[id]);
      
      if (missingIds.length === 0) return;

      // Fetch words to get their names
      try {
        const wordPromises = missingIds.map(async (id) => {
          // Try to find in search results first
          const found = searchResults.find(w => w._id === id);
          if (found) {
            return { id, word: found.word };
          }
          return null;
        });

        const results = await Promise.all(wordPromises);
        const updates: Record<string, string> = {};
        
        results.forEach(result => {
          if (result) {
            updates[result.id] = result.word;
          }
        });

        if (synonyms.some(id => updates[id])) {
          setSynonymWords({ ...synonymWords, ...updates });
        }
        if (antonyms.some(id => updates[id])) {
          setAntonymWords({ ...antonymWords, ...updates });
        }
      } catch (error) {
        console.error('Error loading word names:', error);
      }
    };

    loadMissingWordNames();
  }, [synonyms, antonyms, searchResults]);

  // Save relationships
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateWordRelationships({
        wordId,
        meaningId,
        synonyms,
        antonyms
      });
      alert('Relationships saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save relationships. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Relationships - Meaning #{meaningIndex + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Search for Words</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type to search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Search Results</p>
              {searchResults.map((word) => (
                <div
                  key={word._id}
                  draggable
                  onDragStart={() => handleDragStart(word)}
                  className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-muted transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 font-medium">{word.word}</span>
                  <Badge variant="outline" className="text-xs">
                    {word.meanings?.[0]?.pos || 'N/A'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drop Zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Synonyms Drop Zone */}
          <div
            onDragOver={(e) => handleDragOver(e, 'synonym')}
            onDrop={(e) => handleDrop(e, 'synonym')}
            className="border-2 border-dashed rounded-lg p-4 min-h-[200px] transition-colors hover:border-primary"
          >
            <h3 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-400">
              Synonyms
            </h3>
            <div className="space-y-2">
              {synonyms.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950 rounded border border-emerald-200 dark:border-emerald-800"
                >
                  <span className="font-medium">{synonymWords[id] || 'Loading...'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(id, 'synonym')}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {synonyms.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Drag words here or drop synonym words
                </p>
              )}
            </div>
          </div>

          {/* Antonyms Drop Zone */}
          <div
            onDragOver={(e) => handleDragOver(e, 'antonym')}
            onDrop={(e) => handleDrop(e, 'antonym')}
            className="border-2 border-dashed rounded-lg p-4 min-h-[200px] transition-colors hover:border-primary"
          >
            <h3 className="font-semibold mb-3 text-red-700 dark:text-red-400">
              Antonyms
            </h3>
            <div className="space-y-2">
              {antonyms.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800"
                >
                  <span className="font-medium">{antonymWords[id] || 'Loading...'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(id, 'antonym')}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {antonyms.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Drag words here or drop antonym words
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Relationships'}
        </Button>
      </CardContent>
    </Card>
  );
}

