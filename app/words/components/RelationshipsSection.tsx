'use client';

import { useState } from 'react';
import RelationshipsManager from './RelationshipsManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WordMeaning } from '@/types/word';

interface RelationshipsSectionProps {
  wordId: string;
  currentWord: string;
  meanings: WordMeaning[];
}

export default function RelationshipsSection({
  wordId,
  currentWord,
  meanings
}: RelationshipsSectionProps) {
  const [activeTab, setActiveTab] = useState('0');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Word Relationships</CardTitle>
      </CardHeader>
      <CardContent>
        {meanings.length > 0 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              {meanings.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  Meaning {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {meanings.map((meaning, index) => (
              <TabsContent key={meaning._id || index} value={index.toString()}>
                <RelationshipsManager
                  wordId={wordId}
                  currentWord={currentWord}
                  meaningId={meaning._id?.toString() || ''}
                  meaningIndex={index}
                  currentSynonyms={meaning.synonyms || []}
                  currentAntonyms={meaning.antonyms || []}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No meanings found. Please add meanings first.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

