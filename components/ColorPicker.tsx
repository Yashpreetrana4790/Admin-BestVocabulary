'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette, X } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  presetColors?: string[];
}

const DEFAULT_PRESET_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
  '#6366f1', // Indigo
];

export default function ColorPickerComponent({ 
  value, 
  onChange, 
  label,
  presetColors = DEFAULT_PRESET_COLORS 
}: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="space-y-2 relative">
      {label && <Label>{label}</Label>}
      
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#3b82f6"
          className="flex-1"
        />
        <div
          className="w-12 h-10 rounded-md border-2 border-gray-200 cursor-pointer shrink-0"
          style={{ backgroundColor: value || '#3b82f6' }}
          onClick={() => setShowPicker(!showPicker)}
          title="Click to open color picker"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowPicker(!showPicker)}
          className="shrink-0"
        >
          <Palette className="h-4 w-4" />
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange('#3b82f6')}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preset Colors */}
      <div className="flex flex-wrap gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-10 h-10 rounded-md border-2 transition-all hover:scale-110 ${
              value === color ? 'border-gray-900 scale-110' : 'border-gray-200'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      {/* Color Picker Popup */}
      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute z-50 mt-2 p-4 bg-background border rounded-lg shadow-lg">
            <HexColorPicker color={value || '#3b82f6'} onChange={onChange} />
            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPicker(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

