'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, GripVertical, Search, Plus, Loader2, BookOpen, Shuffle } from 'lucide-react';
import { searchWords, WordSearchResult } from '../service/searchWords';
import { toast } from 'sonner';

interface RelationItem {
  wordId: string;
  word: string;
  pronunciation?: string;
  meaning?: string;
}

interface RelationsManagerProps {
  synonyms: RelationItem[];
  antonyms: RelationItem[];
  onSynonymsChange: (synonyms: RelationItem[]) => void;
  onAntonymsChange: (antonyms: RelationItem[]) => void;
  label?: string;
}

const SortableRelationItem = ({
  item,
  onRemove,
  relationType,
}: {
  item: RelationItem;
  onRemove: () => void;
  relationType: 'synonym' | 'antonym';
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item?.wordId || '',
    data: {
      type: relationType,
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const colorClass = relationType === 'synonym' 
    ? 'border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700'
    : 'border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border rounded-lg group transition-all ${colorClass} ${isDragging ? 'shadow-lg z-50' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {item?.word || ''}
        </div>
        {item?.pronunciation && (
          <div className="text-sm text-gray-500 dark:text-gray-400 italic">
            {item.pronunciation}
          </div>
        )}
        {item?.meaning && (
          <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
            {item.meaning}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Draggable Search Result Card Component
const DraggableSearchCard = ({
  word,
  isAlreadyAdded,
  onAdd,
}: {
  word: WordSearchResult;
  isAlreadyAdded: boolean;
  onAdd: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `search-${word?._id || ''}`,
    data: {
      type: 'search-result',
      word,
    },
    disabled: isAlreadyAdded,
  });

  const style = transform ? {
    transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
  } : undefined;

  const difficultyColors = {
    Beginner: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-lg border-2 ${
        isAlreadyAdded
          ? 'border-gray-300 dark:border-gray-700 opacity-50 cursor-not-allowed'
          : isDragging
            ? 'border-purple-500 shadow-xl z-50'
            : 'border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-600 cursor-grab active:cursor-grabbing'
      } bg-white dark:bg-gray-900 transition-all duration-200`}
      {...(!isAlreadyAdded ? { ...listeners, ...attributes } : {})}
    >
      <Card className="border-0 shadow-none h-full">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 capitalize">
                {word?.word || ''}
              </h4>
              {word?.pronunciation && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                  /{word.pronunciation}/
                </p>
              )}
            </div>
            {!isAlreadyAdded && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <Plus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </Button>
            )}
          </div>

          {/* All Meanings */}
          {word?.meanings && (word?.meanings?.length ?? 0) > 0 && (
            <div className="space-y-2 mt-3">
              {word.meanings?.slice(0, 3).map((meaning, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {meaning?.pos && (
                      <Badge variant="outline" className="text-xs border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                        {meaning.pos}
                      </Badge>
                    )}
                    {meaning?.difficulty && (
                      <Badge className={`text-xs ${difficultyColors[meaning.difficulty as keyof typeof difficultyColors] || ''}`}>
                        {meaning.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {meaning?.meaning || meaning?.subtitle || 'No meaning available'}
                  </p>
                </div>
              ))}
              {(word?.meanings?.length ?? 0) > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(word?.meanings?.length ?? 0) - 3} more meanings
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <BookOpen className="h-3 w-3" />
              <span>{word?.meanings?.length || 0} meanings</span>
            </div>
            {isAlreadyAdded && (
              <Badge variant="outline" className="text-xs">
                Added
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Droppable Relations Box Component
const DroppableRelationsBox = ({
  relations,
  onRemove,
  relationType,
}: {
  relations: RelationItem[];
  onRemove: (wordId: string) => void;
  relationType: 'synonym' | 'antonym';
}) => {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `${relationType}-box`,
  });

  const colorClass = relationType === 'synonym'
    ? 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/20'
    : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20';

  const emptyColorClass = relationType === 'synonym'
    ? 'border-purple-300 dark:border-purple-700'
    : 'border-red-300 dark:border-red-700';

  return (
    <div
      ref={setDroppableRef}
      className={`min-h-[150px] rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver ? colorClass : emptyColorClass
      }`}
    >
      {relations && relations.length > 0 ? (
        <SortableContext
          items={relations.map((r) => r?.wordId).filter(Boolean) as string[]}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {relations.map((relation) => (
              <SortableRelationItem
                key={relation?.wordId || Math.random()}
                item={relation}
                onRemove={() => onRemove(relation?.wordId || '')}
                relationType={relationType}
              />
            ))}
          </div>
        </SortableContext>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
          <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isOver 
              ? `Drop word here to add as ${relationType}` 
              : `No ${relationType}s added yet. Drag words from search results to add them.`}
          </p>
        </div>
      )}
    </div>
  );
};

export const RelationsManager: React.FC<RelationsManagerProps> = ({
  synonyms,
  antonyms,
  onSynonymsChange,
  onAntonymsChange,
  label = 'Relations',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WordSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedWord, setDraggedWord] = useState<WordSearchResult | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'synonyms' | 'antonyms'>('synonyms');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event?.active?.data?.current?.type === 'search-result') {
      setActiveId(event.active?.id as string);
      setDraggedWord(event.active?.data?.current?.word as WordSearchResult);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event || { active: null, over: null };

    // Handle dropping search result into relations box
    if (active?.data?.current?.type === 'search-result' && over?.id) {
      const word = active?.data?.current?.word as WordSearchResult;
      const targetBox = over.id as string;
      
      if (targetBox === 'synonyms-box' || targetBox === 'antonyms-box') {
        const relationType = targetBox === 'synonyms-box' ? 'synonym' : 'antonym';
        const currentRelations = relationType === 'synonym' ? synonyms : antonyms;
        const isAlreadyAdded = currentRelations?.some((r) => r?.wordId === word?._id) ?? false;
        
        if (!isAlreadyAdded && word) {
          handleAddRelation(word, relationType);
        } else if (word?.word) {
          toast.info(`"${word.word}" is already added as ${relationType}`);
        }
        setActiveId(null);
        setDraggedWord(null);
        return;
      }
    }

    // Handle reordering existing relations
    if (over && active?.id !== over?.id && (active?.data?.current?.type === 'synonym' || active?.data?.current?.type === 'antonym')) {
      const relationType = active?.data?.current?.type as 'synonym' | 'antonym';
      const currentRelations = relationType === 'synonym' ? synonyms : antonyms;
      const onChange = relationType === 'synonym' ? onSynonymsChange : onAntonymsChange;
      
      const oldIndex = currentRelations?.findIndex((r) => r?.wordId === active?.id) ?? -1;
      const newIndex = currentRelations?.findIndex((r) => r?.wordId === over?.id) ?? -1;
      
      if (oldIndex !== -1 && newIndex !== -1 && currentRelations) {
        onChange(arrayMove(currentRelations, oldIndex, newIndex));
      }
    }

    setActiveId(null);
    setDraggedWord(null);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query?.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchWords(query);
      // Filter out words that are already added as synonyms or antonyms
      const existingWordIds = [
        ...(synonyms?.map((s) => s?.wordId).filter(Boolean) ?? []),
        ...(antonyms?.map((a) => a?.wordId).filter(Boolean) ?? [])
      ];
      const filteredResults = results?.filter((r) => r?._id && !existingWordIds.includes(r._id)) ?? [];
      setSearchResults(filteredResults);
      if (!showSidebar && filteredResults?.length > 0) {
        setShowSidebar(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search words');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddRelation = (word: WordSearchResult, relationType: 'synonym' | 'antonym') => {
    if (!word?._id || !word?.word) {
      console.error('Invalid word data:', word);
      return;
    }

    const primaryMeaning = word?.meanings?.[0];
    const newRelation: RelationItem = {
      wordId: word._id,
      word: word.word,
      pronunciation: word?.pronunciation,
      meaning: primaryMeaning?.meaning || primaryMeaning?.subtitle,
    };

    if (relationType === 'synonym') {
      onSynonymsChange([...(synonyms || []), newRelation]);
      toast.success(`Added "${word.word}" as a synonym`);
    } else {
      onAntonymsChange([...(antonyms || []), newRelation]);
      toast.success(`Added "${word.word}" as an antonym`);
    }
  };

  const handleRemoveRelation = (wordId: string, relationType: 'synonym' | 'antonym') => {
    if (!wordId) return;
    
    if (relationType === 'synonym') {
      onSynonymsChange((synonyms || []).filter((s) => s?.wordId !== wordId));
      toast.success('Synonym removed');
    } else {
      onAntonymsChange((antonyms || []).filter((a) => a?.wordId !== wordId));
      toast.success('Antonym removed');
    }
  };

  const currentRelations = activeTab === 'synonyms' ? synonyms : antonyms;
  const allRelations = [...(synonyms || []), ...(antonyms || [])];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <Badge variant="outline" className="text-xs">
              {synonyms?.length || 0} synonyms, {antonyms?.length || 0} antonyms
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-xs"
          >
            {showSidebar ? (
              <>
                <X className="h-3 w-3 mr-1" />
                Hide Search
              </>
            ) : (
              <>
                <Search className="h-3 w-3 mr-1" />
                Show Search
              </>
            )}
          </Button>
        </div>

        {/* Main Layout: Sidebar + Main Area */}
        <div className="flex gap-4 h-[600px]">
          {/* Left Sidebar - Search Results */}
          {showSidebar && (
            <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 pr-4">
              <Card className="h-full flex flex-col">
                <CardContent className="p-4 flex flex-col h-full">
                  {/* Search Input */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search words..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>

                  {/* Search Results Title */}
                  {searchResults && searchResults.length > 0 && (
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Search Results
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {searchResults.length}
                      </Badge>
                    </div>
                  )}

                  {/* Search Results Cards - Scrollable */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {searchResults && searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <DraggableSearchCard
                          key={result?._id || Math.random()}
                          word={result}
                          isAlreadyAdded={allRelations.some((r) => r?.wordId === result?._id)}
                          onAdd={() => handleAddRelation(result, activeTab)}
                        />
                      ))
                    ) : searchQuery?.length >= 2 && !isSearching ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <BookOpen className="h-8 w-8 text-gray-400 dark:text-gray-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No words found
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Search className="h-8 w-8 text-gray-400 dark:text-gray-600 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Search for words to add as relations
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Type at least 2 characters
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Right Main Area - Relations Tabs */}
          <div className="flex-1 min-w-0">
            <Card className="h-full">
              <CardContent className="p-4 h-full flex flex-col">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'synonyms' | 'antonyms')} className="h-full flex flex-col">
                  <TabsList className="mb-4">
                    <TabsTrigger value="synonyms" className="flex items-center gap-2">
                      <Shuffle className="h-4 w-4" />
                      Synonyms
                      <Badge variant="secondary" className="ml-2">
                        {synonyms?.length || 0}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="antonyms" className="flex items-center gap-2">
                      <Shuffle className="h-4 w-4 rotate-180" />
                      Antonyms
                      <Badge variant="secondary" className="ml-2">
                        {antonyms?.length || 0}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="synonyms" className="flex-1 flex flex-col mt-0">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Your Synonyms
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Drag words from the sidebar or use the search to add synonyms
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <DroppableRelationsBox
                        relations={synonyms || []}
                        onRemove={(wordId) => handleRemoveRelation(wordId, 'synonym')}
                        relationType="synonym"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="antonyms" className="flex-1 flex flex-col mt-0">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Your Antonyms
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Drag words from the sidebar or use the search to add antonyms
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <DroppableRelationsBox
                        relations={antonyms || []}
                        onRemove={(wordId) => handleRemoveRelation(wordId, 'antonym')}
                        relationType="antonym"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && draggedWord && (
          <div className="opacity-80 rotate-3 scale-105">
            <DraggableSearchCard
              word={draggedWord}
              isAlreadyAdded={false}
              onAdd={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};


