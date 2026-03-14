'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Volume2, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ComparisonWord {
  id: string;
  word: string;
  meaning: string;
  differences: string[];
}

interface JuxtaposeViewProps {
  mainPhrase: string;
  mainMeaning: string;
  comparisons: ComparisonWord[];
  onComparisonsChange: (comparisons: ComparisonWord[]) => void;
}

export default function JuxtaposeView({ 
  mainPhrase, 
  mainMeaning, 
  comparisons, 
  onComparisonsChange 
}: JuxtaposeViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newComparison, setNewComparison] = useState({
    word: '',
    meaning: '',
    differences: ['']
  });
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const playPronunciation = (word: string) => {
    if (!word) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Speech synthesis is not supported in your browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setPlayingWord(word);

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setPlayingWord(null);
    }
  };

  const handleAddComparison = () => {
    if (!newComparison.word.trim() || !newComparison.meaning.trim()) {
      toast.error('Word and meaning are required');
      return;
    }

    const newItem: ComparisonWord = {
      id: `comparison-${Date.now()}`,
      word: newComparison.word.trim(),
      meaning: newComparison.meaning.trim(),
      differences: newComparison.differences.filter(d => d.trim() !== '')
    };

    onComparisonsChange([...comparisons, newItem]);
    setNewComparison({ word: '', meaning: '', differences: [''] });
    setIsAdding(false);
  };

  const handleRemoveComparison = (id: string) => {
    onComparisonsChange(comparisons.filter(c => c.id !== id));
  };

  const handleAddDifference = (comparisonId: string) => {
    const updated = comparisons.map(c =>
      c.id === comparisonId
        ? { ...c, differences: [...c.differences, ''] }
        : c
    );
    onComparisonsChange(updated);
  };

  const handleUpdateDifference = (comparisonId: string, index: number, value: string) => {
    const updated = comparisons.map(c =>
      c.id === comparisonId
        ? {
            ...c,
            differences: c.differences.map((d, i) => i === index ? value : d)
          }
        : c
    );
    onComparisonsChange(updated);
  };

  const handleRemoveDifference = (comparisonId: string, index: number) => {
    const updated = comparisons.map(c =>
      c.id === comparisonId
        ? {
            ...c,
            differences: c.differences.filter((_, i) => i !== index)
          }
        : c
    );
    onComparisonsChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Main Phrase Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Main Phrase</span>
            <Badge variant="outline">{mainPhrase || 'Not set'}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Meaning</Label>
            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              {mainMeaning || 'No meaning set'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Words */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Comparison Words</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Comparison
          </Button>
        </div>

        {/* Comparisons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisons.map((comparison) => (
            <Card key={comparison.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <span>{comparison.word}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => playPronunciation(comparison.word)}
                        disabled={playingWord === comparison.word}
                      >
                        <Volume2 className={`h-4 w-4 ${playingWord === comparison.word ? 'text-blue-600 animate-pulse' : ''}`} />
                      </Button>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{comparison.meaning}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveComparison(comparison.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-xs">Key Differences</Label>
                  {comparison.differences.map((diff, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Input
                        value={diff}
                        onChange={(e) => handleUpdateDifference(comparison.id, index, e.target.value)}
                        placeholder={`Difference ${index + 1}`}
                        className="text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDifference(comparison.id, index)}
                        className="text-red-500 hover:text-red-700 shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddDifference(comparison.id)}
                    className="w-full mt-2"
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    Add Difference
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Comparison Form */}
        {isAdding && (
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Add New Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Word *</Label>
                <Input
                  value={newComparison.word}
                  onChange={(e) => setNewComparison({ ...newComparison, word: e.target.value })}
                  placeholder="Enter comparison word"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Meaning *</Label>
                <Input
                  value={newComparison.meaning}
                  onChange={(e) => setNewComparison({ ...newComparison, meaning: e.target.value })}
                  placeholder="Enter meaning"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleAddComparison}
                  disabled={!newComparison.word.trim() || !newComparison.meaning.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setNewComparison({ word: '', meaning: '', differences: [''] });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

