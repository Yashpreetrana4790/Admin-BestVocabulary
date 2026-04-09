'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useState } from 'react';
import { createCategory, updateCategory } from '../service/categoryService';
import { useRouter } from 'next/navigation';
import ChipInput from '@/components/ChipInput';
import EmojiPickerComponent from '@/components/EmojiPicker';
import ColorPickerComponent from '@/components/ColorPicker';
import ImageUploadComponent from '@/components/ImageUpload';
import { Save, X, FileText, Palette, Image, Tag, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  description: Yup.string(),
  color: Yup.string(),
  icon: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});

type CategoryFormValues = {
  name: string;
  description?: string;
  color: string;
  icon: string;
  tags: string[];
  image?: string | File | null;
};

type Props = {
  initialData?: any;
  categoryId?: string;
};


export default function CategoryForm({ initialData, categoryId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!categoryId;

  const formInitialValues: CategoryFormValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#3b82f6',
    icon: initialData?.icon || '📚',
    tags: initialData?.tags || [],
    image: initialData?.image || null,
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    initialData?.image || null
  );
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('color', values.color);
      formData.append('icon', values.icon);
      formData.append('tags', JSON.stringify(values.tags));
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (shouldDeleteImage && existingImageUrl) {
        formData.append('imageAction', 'delete');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not defined');

      let response;
      if (isEditMode && categoryId) {
        response = await fetch(`${apiUrl}/category/${categoryId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch(`${apiUrl}/category`, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: 'Failed to save category',
          message: 'An unexpected error occurred. Please try again.'
        }));
        const errorMessage = errorData.message || errorData.error || 'Failed to save category';
        throw new Error(errorMessage);
      }

      toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
      router.push('/categories/word-categories');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error?.message || 'Failed to save category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={CategorySchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          {/* Basic Information */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Name and description for the category</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="e.g., Words Related to Biology"
                  className="h-11"
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Describe what this category contains..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Visual Customization */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-purple-500/10">
                <Palette className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Visual Customization</h2>
                <p className="text-sm text-muted-foreground">Customize how the category looks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <EmojiPickerComponent
                  value={values.icon}
                  onChange={(emoji) => setFieldValue('icon', emoji)}
                  label="Icon/Emoji"
                />
                <p className="text-xs text-muted-foreground">
                  Click the smile icon to search and pick any emoji
                </p>
              </div>

              <div className="space-y-2">
                <ColorPickerComponent
                  value={values.color}
                  onChange={(color) => setFieldValue('color', color)}
                  label="Theme Color"
                />
                <p className="text-xs text-muted-foreground">
                  Choose a color for the category card
                </p>
              </div>
            </div>
          </div>

          {/* Category Image */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <Image className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Category Image</h2>
                <p className="text-sm text-muted-foreground">Upload an optional image for the category</p>
              </div>
            </div>

            <ImageUploadComponent
              value={imageFile || existingImageUrl || null}
              onChange={(file) => {
                if (file) {
                  setImageFile(file);
                  setExistingImageUrl(null);
                  setShouldDeleteImage(false);
                } else {
                  setImageFile(null);
                  if (existingImageUrl) {
                    setShouldDeleteImage(true);
                  }
                }
                setFieldValue('image', file);
              }}
              label=""
            />
          </div>

          {/* Tags */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-amber-500/10">
                <Tag className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Tags</h2>
                <p className="text-sm text-muted-foreground">Add tags to help organize and search</p>
              </div>
            </div>

            <ChipInput
              name="tags"
              label=""
              placeholder="Type and press Enter to add tag"
              initialItems={values.tags || []}
            />
          </div>

          {/* Preview */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-pink-500/10">
                <Sparkles className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Preview</h2>
                <p className="text-sm text-muted-foreground">How the category card will look</p>
              </div>
            </div>

            <div className="max-w-sm">
              <div 
                className="rounded-2xl border p-5 hover:shadow-lg transition-all duration-300"
                style={{ 
                  background: `linear-gradient(to bottom right, ${values.color}10, ${values.color}05)`,
                  borderColor: `${values.color}30`
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  {imageFile ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={URL.createObjectURL(imageFile)} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : existingImageUrl ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={existingImageUrl} 
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${values.color}15` }}
                    >
                      {values.icon || '📚'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate">
                      {values.name || 'Category Name'}
                    </h3>
                    <p className="text-sm text-muted-foreground">0 words</p>
                  </div>
                </div>
                {values.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {values.description}
                  </p>
                )}
                {values.tags && values.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {values.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-background border">
                        #{tag.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              asChild
              className="gap-2"
            >
              <Link href="/categories/word-categories">
                <X className="h-4 w-4" />
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
