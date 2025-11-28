'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useState } from 'react';
import { createHomonym, updateHomonym } from '../../service/categoriesService';
import { useRouter } from 'next/navigation';
import ChipInput from '@/components/ChipInput';

const HomonymSchema = Yup.object().shape({
  word: Yup.string().required('Word is required'),
  meanings: Yup.array()
    .of(
      Yup.object().shape({
        meaning: Yup.string().required('Meaning is required'),
        partOfSpeech: Yup.string(),
        example: Yup.string(),
        context: Yup.string(),
      })
    )
    .min(1, 'At least one meaning is required'),
  pronunciation: Yup.string(),
  difficulty: Yup.string().oneOf(['easy', 'medium', 'hard']),
  tags: Yup.array().of(Yup.string()),
  etymology: Yup.string(),
});

type HomonymFormValues = {
  word: string;
  meanings: Array<{
    meaning: string;
    partOfSpeech?: string;
    example?: string;
    context?: string;
  }>;
  pronunciation?: string;
  difficulty?: string;
  tags: string[];
  etymology?: string;
};

type Props = {
  initialData?: any;
  homonymId?: string;
};

export default function HomonymForm({ initialData, homonymId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!homonymId;

  const formInitialValues: HomonymFormValues = {
    word: initialData?.word || '',
    meanings: initialData?.meanings && initialData.meanings.length > 0
      ? initialData.meanings
      : [{ meaning: '', partOfSpeech: '', example: '', context: '' }],
    pronunciation: initialData?.pronunciation || '',
    difficulty: initialData?.difficulty || 'medium',
    tags: initialData?.tags || [],
    etymology: initialData?.etymology || '',
  };

  const handleSubmit = async (values: HomonymFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && homonymId) {
        await updateHomonym(homonymId, values);
        toast.success('Homonym updated successfully!');
      } else {
        await createHomonym(values);
        toast.success('Homonym created successfully!');
      }
      router.push('/categories/homonyms');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving homonym:', error);
      toast.error(error?.message || 'Failed to save homonym. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={HomonymSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched }) => (
        <Form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                <div className="space-y-2">
                  <Label htmlFor="word">Word *</Label>
                  <Field
                    as={Input}
                    id="word"
                    name="word"
                    placeholder="e.g., 'bank'"
                    className="text-lg"
                  />
                  {touched.word && errors.word && (
                    <p className="text-sm text-red-500">{errors.word}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pronunciation">Pronunciation</Label>
                  <Field
                    as={Input}
                    id="pronunciation"
                    name="pronunciation"
                    placeholder="e.g., /bæŋk/"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Field
                    as="select"
                    id="difficulty"
                    name="difficulty"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Field>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="etymology">Etymology</Label>
                <Field
                  as={Textarea}
                  id="etymology"
                  name="etymology"
                  placeholder="Word origin and history..."
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meanings</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldArray name="meanings">
                {({ remove, push }) => (
                  <div className="space-y-4">
                    {values.meanings.map((meaning, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">Meaning {index + 1}</h3>
                          {values.meanings.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`meanings.${index}.partOfSpeech`}>Part of Speech</Label>
                            <Field
                              as={Input}
                              name={`meanings.${index}.partOfSpeech`}
                              placeholder="e.g., 'noun', 'verb'"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`meanings.${index}.context`}>Context</Label>
                            <Field
                              as={Input}
                              name={`meanings.${index}.context`}
                              placeholder="e.g., 'financial', 'geography'"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label htmlFor={`meanings.${index}.meaning`}>Meaning *</Label>
                          <Field
                            as={Textarea}
                            name={`meanings.${index}.meaning`}
                            placeholder="Enter the meaning"
                            className="min-h-[80px]"
                          />
                          {touched.meanings?.[index]?.meaning && errors.meanings?.[index] && (
                            <p className="text-sm text-red-500">
                              {typeof errors.meanings[index] === 'object' && errors.meanings[index]?.meaning}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label htmlFor={`meanings.${index}.example`}>Example Sentence</Label>
                          <Field
                            as={Textarea}
                            name={`meanings.${index}.example`}
                            placeholder="Enter an example sentence"
                            className="min-h-[60px]"
                          />
                        </div>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => push({ meaning: '', partOfSpeech: '', example: '', context: '' })}
                      className="gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Another Meaning
                    </Button>
                  </div>
                )}
              </FieldArray>
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
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Homonym' : 'Create Homonym'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

