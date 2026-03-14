'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string | File | null; // URL string (existing) or File (new upload)
  onChange: (file: File | null) => void;
  label?: string;
  maxSize?: number; // in bytes
}

export default function ImageUploadComponent({ 
  value, 
  onChange, 
  label,
  maxSize = 5 * 1024 * 1024 // 5MB default
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Update preview when value changes
  useEffect(() => {
    if (typeof value === 'string' && value) {
      // Existing image URL
      setPreview(value);
      setUploadedFile(null);
    } else if (value instanceof File) {
      // New file selected
      setUploadedFile(value);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      // No image
      setPreview(null);
      setUploadedFile(null);
    }
  }, [value]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      onChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: maxSize,
    multiple: false
  });

  const handleRemove = () => {
    setPreview(null);
    setUploadedFile(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      {preview ? (
        <div className="relative w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          {uploadedFile && (
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {uploadedFile.name}
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center gap-4 ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to select
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF, WEBP up to {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          </div>
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
}
