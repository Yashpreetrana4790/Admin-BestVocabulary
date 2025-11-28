'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description || '');
      formData.append('color', values.color);
      formData.append('icon', values.icon);
      formData.append('tags', JSON.stringify(values.tags));
      
      // Handle image upload/deletion
      if (imageFile) {
        // New image uploaded
        formData.append('image', imageFile);
      } else if (shouldDeleteImage && existingImageUrl) {
        // User wants to delete existing image
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
        // Use message field if available (more user-friendly), otherwise use error field
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
          <Card>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="e.g., Words Related to Biology"
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Field
                  as={Textarea}
                  id="description"
                  name="description"
                  placeholder="Describe this category..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2 relative">
                <ImageUploadComponent
                  value={imageFile || existingImageUrl || null}
                  onChange={(file) => {
                    if (file) {
                      setImageFile(file);
                      setExistingImageUrl(null);
                      setShouldDeleteImage(false);
                    } else {
                      setImageFile(null);
                      // Mark for deletion if there was an existing image
                      if (existingImageUrl) {
                        setShouldDeleteImage(true);
                      }
                    }
                    setFieldValue('image', file);
                  }}
                  label="Category Image"
                />
                <p className="text-xs text-muted-foreground">
                  Upload an image to represent this category (optional). Drag & drop or click to select.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    label="Color"
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose a color or use the color picker for custom colors
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <ChipInput
                  name="tags"
                  label=""
                  placeholder="Type and press Enter to add tag"
                  initialItems={values.tags || []}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

