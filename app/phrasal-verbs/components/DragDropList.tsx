'use client';

import { useState } from 'react';
import { GripVertical, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DragDropItem {
  id: string;
  word: string;
  meaning?: string;
  explanation?: string;
  order: number;
}

interface DragDropListProps {
  items: DragDropItem[];
  onItemsChange: (items: DragDropItem[]) => void;
  type: 'homonyms' | 'confusedWords';
  placeholder?: string;
}

export default function DragDropList({ items, onItemsChange, type }: DragDropListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ word: '', meaning: '', explanation: '' });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', id);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = items.findIndex(item => item.id === draggedItem);
    const targetIndex = items.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);

    // Update order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));

    onItemsChange(updatedItems);
    setDraggedItem(null);
  };

  const handleAddItem = () => {
    if (!newItem.word.trim()) return;

    const newItemObj: DragDropItem = {
      id: `new-${Date.now()}`,
      word: newItem.word.trim(),
      meaning: type === 'homonyms' ? newItem.meaning.trim() : undefined,
      explanation: type === 'confusedWords' ? newItem.explanation.trim() : undefined,
      order: items.length
    };

    onItemsChange([...items, newItemObj]);
    setNewItem({ word: '', meaning: '', explanation: '' });
    setIsAdding(false);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = items
      .filter(item => item.id !== id)
      .map((item, index) => ({ ...item, order: index }));
    onItemsChange(updatedItems);
  };

  const handleUpdateItem = (id: string, field: string, value: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onItemsChange(updatedItems);
  };

  return (
    <div className="space-y-4">
      {/* Items List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, item.id)}
            className={`flex items-start gap-3 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-move ${
              draggedItem === item.id ? 'opacity-50' : ''
            }`}
          >
            {/* Drag Handle */}
            <div className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
              <GripVertical className="h-5 w-5" />
            </div>

            {/* Order Badge */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0 mt-1">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Word</Label>
                <Input
                  value={item.word}
                  onChange={(e) => handleUpdateItem(item.id, 'word', e.target.value)}
                  placeholder="Enter word"
                  className="mt-1"
                />
              </div>

              {type === 'homonyms' && (
                <div>
                  <Label className="text-xs text-muted-foreground">Meaning</Label>
                  <Textarea
                    value={item.meaning || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'meaning', e.target.value)}
                    placeholder="Enter meaning"
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              )}

              {type === 'confusedWords' && (
                <div>
                  <Label className="text-xs text-muted-foreground">Explanation</Label>
                  <Textarea
                    value={item.explanation || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'explanation', e.target.value)}
                    placeholder="Explain why this word is confused"
                    className="mt-1 min-h-[60px]"
                  />
                </div>
              )}
            </div>

            {/* Remove Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add New Item */}
      {isAdding ? (
        <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
          <div>
            <Label>Word *</Label>
            <Input
              value={newItem.word}
              onChange={(e) => setNewItem({ ...newItem, word: e.target.value })}
              placeholder="Enter word"
              className="mt-1"
            />
          </div>

          {type === 'homonyms' && (
            <div>
              <Label>Meaning</Label>
              <Textarea
                value={newItem.meaning}
                onChange={(e) => setNewItem({ ...newItem, meaning: e.target.value })}
                placeholder="Enter meaning"
                className="mt-1 min-h-[60px]"
              />
            </div>
          )}

          {type === 'confusedWords' && (
            <div>
              <Label>Explanation</Label>
              <Textarea
                value={newItem.explanation}
                onChange={(e) => setNewItem({ ...newItem, explanation: e.target.value })}
                placeholder="Explain why this word is confused"
                className="mt-1 min-h-[60px]"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleAddItem}
              disabled={!newItem.word.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewItem({ word: '', meaning: '', explanation: '' });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {type === 'homonyms' ? 'Homonym' : 'Confused Word'}
        </Button>
      )}
    </div>
  );
}

