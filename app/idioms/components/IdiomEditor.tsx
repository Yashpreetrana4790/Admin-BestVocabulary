'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Volume2 } from 'lucide-react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { ConfirmationPopup } from '@/components/AlertComponent';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deleteIdiom, updateIdiom } from '../service/getIdioms';
import ChipInput from '@/components/ChipInput';
import RelatedItemSearch, { RelatedItem } from '@/components/RelatedItemSearch';

const IdiomSchema = Yup.object().shape({
  idiom: Yup.string().required('Idiom is required'),
  meaning: Yup.string().required('Meaning is required'),
  difficulty: Yup.string().oneOf(['easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard', 'Beginner', 'Intermediate', 'Advanced', ''], 'Invalid difficulty level'),
  example_sentences: Yup.array()
    .of(Yup.string().required('Sentence cannot be empty')),
  relatedItems: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      type: Yup.string().oneOf(['word', 'expression', 'idiom', 'phrase']).required(),
      text: Yup.string().required(),
    })
  ),
  origin: Yup.string(),
  usage_notes: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});

type IdiomFormValues = {
  idiom: string;
  meaning: string;
  difficulty?: string;
  example_sentences: string[];
  relatedItems: RelatedItem[];
  origin?: string;
  usage_notes?: string;
  tags: string[];
};

type Props = {
  initialData?: any;
  idiomId?: string;
};

export default function IdiomEditor({ initialData, idiomId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isEditMode = !!idiomId;

  const getFormInitialValues = (): IdiomFormValues => {
    if (!initialData) {
      return {
        idiom: '',
        meaning: '',
        difficulty: 'medium',
        example_sentences: [''],
        relatedItems: [],
        origin: '',
        usage_notes: '',
        tags: [],
      };
    }

    let exampleSentences: string[] = [''];
    if (Array.isArray(initialData.example_sentences) && initialData.example_sentences.length > 0) {
      exampleSentences = initialData.example_sentences.filter((s: any) => s && s.trim() !== '');
      if (exampleSentences.length === 0) exampleSentences = [''];
    } else if (initialData.example && typeof initialData.example === 'string' && initialData.example.trim() !== '') {
      exampleSentences = [initialData.example];
    }

    // Convert relatedItems from backend format to frontend format
    let relatedItems: RelatedItem[] = [];
    if (Array.isArray(initialData.relatedItems)) {
      // If relatedItems are populated objects, convert them
      relatedItems = initialData.relatedItems.map((item: any) => {
        if (typeof item === 'object' && item.itemId) {
          // Backend format: { type, itemId, ... }
          return {
            id: item.itemId._id || item.itemId.toString(),
            type: item.type as RelatedItem['type'],
            text: item.itemId.word || item.itemId.idiom || item.itemId.phrase || item.itemId.expression || '',
            meaning: item.itemId.meaning || item.itemId.meanings?.[0]?.meaning,
            pronunciation: item.itemId.pronunciation
          };
        }
        return null;
      }).filter((item: RelatedItem | null) => item !== null) as RelatedItem[];
    }

    return {
      idiom: initialData.idiom || '',
      meaning: initialData.meaning || '',
      difficulty: initialData.difficulty || 'medium',
      example_sentences: exampleSentences,
      relatedItems: relatedItems,
      origin: initialData.origin || '',
      usage_notes: initialData.usage_notes || '',
      tags: Array.isArray(initialData.tags) ? initialData.tags.filter((t: any) => t) : [],
    };
  };

  const formInitialValues = getFormInitialValues();

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      }
    };
  }, []);

  const playPronunciation = (idiom: string) => {
    if (!idiom) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Speech synthesis is not supported in your browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(idiom);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
    }
  };

  const handleSubmit = async (values: IdiomFormValues) => {
    setIsSubmitting(true);
    try {
      // Transform relatedItems to backend format
      const submitData = {
        ...values,
        relatedItems: values.relatedItems.map(item => ({
          type: item.type,
          itemId: item.id
        }))
      };

      if (isEditMode && idiomId) {
        await updateIdiom(idiomId, submitData);
        toast.success('Idiom updated successfully!');
        router.refresh();
      } else {
        const { createIdiom } = await import('../service/getIdioms');
        await createIdiom(submitData);
        toast.success('Idiom created successfully!');
        router.push('/idioms');
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} idiom:`, error);
      toast.error(error?.message || `Failed to ${isEditMode ? 'update' : 'create'} idiom. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!idiomId) return;
    setIsSubmitting(true);
    try {
      await deleteIdiom(idiomId);
      toast.success('Idiom deleted successfully');
      router.push('/idioms');
    } catch (error: any) {
      console.error('Error deleting idiom:', error);
      toast.error(error?.message || 'Failed to delete idiom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={IdiomSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{isEditMode ? 'Edit Idiom' : 'Create New Idiom'}</span>
                {isEditMode && (
                  <ConfirmationPopup
                    onConfirm={handleDelete}
                    confirmText="Delete"
                    variant="destructive"
                    size="sm"
                    icon={false}
                    disabled={isSubmitting}
                    title="Delete Idiom"
                    description={`Are you sure you want to delete "${values.idiom}"? This action cannot be undone.`}
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Idiom Field */}
              <div className="space-y-2">
                <Label htmlFor="idiom">Idiom *</Label>
                <div className="flex items-center gap-2">
                  <Field
                    as={Input}
                    id="idiom"
                    name="idiom"
                    placeholder="e.g., 'break the ice'"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => playPronunciation(values.idiom)}
                    disabled={isPlaying || !values.idiom}
                  >
                    <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-blue-600 animate-pulse' : ''}`} />
                  </Button>
                </div>
                {touched.idiom && errors.idiom && (
                  <p className="text-sm text-red-500">{errors.idiom}</p>
                )}
              </div>

              {/* Meaning Field */}
              <div className="space-y-2">
                <Label htmlFor="meaning">Meaning *</Label>
                <Field
                  as={Textarea}
                  id="meaning"
                  name="meaning"
                  placeholder="Explain the meaning..."
                  className="min-h-[100px]"
                />
                {touched.meaning && errors.meaning && (
                  <p className="text-sm text-red-500">{errors.meaning}</p>
                )}
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Field
                  as="select"
                  id="difficulty"
                  name="difficulty"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Field>
              </div>

              {/* Example Sentences */}
              <div className="space-y-2">
                <Label>Example Sentences</Label>
                <FieldArray name="example_sentences">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.example_sentences.map((sentence, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Field
                            as={Textarea}
                            name={`example_sentences[${index}]`}
                            placeholder={`Example sentence #${index + 1}`}
                            className="flex-1"
                          />
                          {values.example_sentences.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => push('')}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Example Sentence
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Related Items */}
              <div className="space-y-2">
                <Label>Related Items</Label>
                <RelatedItemSearch
                  value={values.relatedItems || []}
                  onChange={(items) => setFieldValue('relatedItems', items)}
                  placeholder="Search for words, expressions, idioms, or phrases..."
                />
              </div>

              {/* Origin */}
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Field
                  as={Textarea}
                  id="origin"
                  name="origin"
                  placeholder="Explain the origin of this idiom..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Usage Notes */}
              <div className="space-y-2">
                <Label htmlFor="usage_notes">Usage Notes</Label>
                <Field
                  as={Textarea}
                  id="usage_notes"
                  name="usage_notes"
                  placeholder="Add any usage notes or tips..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <ChipInput
                  name="tags"
                  placeholder="Add tags..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Idiom' : 'Create Idiom'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

