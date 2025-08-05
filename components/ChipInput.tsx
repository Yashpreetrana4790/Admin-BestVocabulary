// components/ChipInput.tsx
'use client';

import { useState, useEffect } from 'react';
import { useField } from 'formik';
import { Input } from './ui/input';
import { X } from 'lucide-react';

interface ChipInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  initialItems?: string[];
}

export default function ChipInput({ 
  name, 
  label, 
  placeholder = "Type and press Enter",
  initialItems = [] 
}: ChipInputProps) {
  const [field, meta, helpers] = useField<string[]>(name);
  const [inputValue, setInputValue] = useState('');

  // Initialize with initialItems if field value is empty
  useEffect(() => {
    if (field.value.length === 0 && initialItems.length > 0) {
      helpers.setValue(initialItems);
    }
  }, [initialItems]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ','].includes(e.key) && inputValue.trim() !== '') {
      e.preventDefault();
      addChip(inputValue.trim());
    } else if (e.key === 'Backspace' && inputValue === '' && field.value.length > 0) {
      // Remove last chip when backspace is pressed on empty input
      e.preventDefault();
      removeChip(field.value.length - 1);
    }
  };

  const addChip = (value: string) => {
    if (!field.value.includes(value)) { // Prevent duplicates
      const newChips = [...field.value, value];
      helpers.setValue(newChips);
    }
    setInputValue('');
  };

  const removeChip = (index: number) => {
    const updated = field.value.filter((_, i) => i !== index);
    helpers.setValue(updated);
  };

  const handleBlur = () => {
    if (inputValue.trim() !== '') {
      addChip(inputValue.trim());
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      
      <div className="flex flex-wrap gap-2 mt-2 min-h-8">
        {field.value.map((chip, idx) => (
          <div key={`${chip}-${idx}`} className="flex items-center bg-gray-100 rounded-sm px-3 py-1 text-sm">
            {chip}
            <button 
              type="button" 
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removeChip(idx)}
              aria-label={`Remove ${chip}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  );
}