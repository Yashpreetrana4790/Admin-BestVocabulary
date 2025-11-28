'use client';

import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, X } from 'lucide-react';

interface EmojiPickerComponentProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export default function EmojiPickerComponent({ value, onChange, label }: EmojiPickerComponentProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPicker]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setShowPicker(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-2 relative">
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Select an emoji or type one..."
          className="flex-1"
        />
        {value && (
          <div className="text-2xl px-3 py-2 border rounded-md bg-muted min-w-[60px] text-center">
            {value}
          </div>
        )}
        <Button
          ref={buttonRef}
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowPicker(!showPicker)}
          className="shrink-0"
        >
          <Smile className="h-4 w-4" />
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange('')}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showPicker && (
        <div ref={pickerRef} className="absolute z-50 mt-2">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.NATIVE}
            theme={Theme.AUTO}
            searchPlaceHolder="Search emoji..."
            width={350}
            height={400}
            previewConfig={{
              showPreview: true
            }}
            skinTonesDisabled
          />
        </div>
      )}
    </div>
  );
}

