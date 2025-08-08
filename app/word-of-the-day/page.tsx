'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Word {
  _id: string;
  term: string;
  definition: string;
  example?: string;
  // Add other word properties as needed
}

const WodPage = () => {
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWordOfTheDay = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/word-of-the-day/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch word of the day');
      }

      if (data.success) {
        setWord(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWordOfTheDay();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Word of the Day</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Word of the Day</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-red-500">{error}</p>
            <Button
              onClick={fetchWordOfTheDay}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Word of the Day</CardTitle>
            <Button
              onClick={fetchWordOfTheDay}
              variant="ghost"
              size="icon"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {word ? (
            <>
              <div>
                <h2 className="text-2xl font-bold">{word.term}</h2>
                <p className="text-muted-foreground">Today's featured word</p>
              </div>

              <div>
                <h3 className="font-semibold">Definition</h3>
                <p>{word.definition}</p>
              </div>

              {word.example && (
                <div>
                  <h3 className="font-semibold">Example</h3>
                  <p className="italic">"{word.example}"</p>
                </div>
              )}
            </>
          ) : (
            <p>No word of the day has been set yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WodPage;