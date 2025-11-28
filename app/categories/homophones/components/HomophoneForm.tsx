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
import { createHomophone, updateHomophone } from '../../service/categoriesService';
import { useRouter } from 'next/navigation';
import ChipInput from '@/components/ChipInput';

const HomophoneSchema = Yup.object().shape({
  words: Yup.array()
    .of(
      Yup.object().shape({
        word: Yup.string().required('Word is required'),
        meaning: Yup.string().required('Meaning is required'),
        example: Yup.string(),
        pronunciation: Yup.string(),
      })
    )
    .min(2, 'At least 2 words are required for a homophone group'),
  difficulty: Yup.string().oneOf(['easy', 'medium', 'hard']),
  tags: Yup.array().of(Yup.string()),
  notes: Yup.string(),
});

type HomophoneFormValues = {
  words: Array<{
    word: string;
    meaning: string;
    example?: string;
    pronunciation?: string;
  }>;
  difficulty?: string;
  tags: string[];
  notes?: string;
};

type Props = {
  initialData?: any;
  homophoneId?: string;
};

export default function HomophoneForm({ initialData, homophoneId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!homophoneId;

  const formInitialValues: HomophoneFormValues = {
    words: initialData?.words && initialData.words.length > 0
      ? initialData.words
      : [
          { word: '', meaning: '', example: '', pronunciation: '' },
          { word: '', meaning: '', example: '', pronunciation: '' },
        ],
    difficulty: initialData?.difficulty || 'medium',
    tags: initialData?.tags || [],
    notes: initialData?.notes || '',
  };

  const handleSubmit = async (values: HomophoneFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && homophoneId) {
        await updateHomophone(homophoneId, values);
        toast.success('Homophone group updated successfully!');
      } else {
        await createHomophone(values);
        toast.success('Homophone group created successfully!');
      }
      router.push('/categories/homophones');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving homophone:', error);
      toast.error(error?.message || 'Failed to save homophone group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={HomophoneSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched }) => (
        <Form className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Homophone Words</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldArray name="words">
                {({ remove, push }) => (
                  <div className="space-y-4">
                    {values.words.map((word, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">Word {index + 1}</h3>
                          {values.words.length > 2 && (
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
                            <Label htmlFor={`words.${index}.word`}>Word *</Label>
                            <Field
                              as={Input}
                              name={`words.${index}.word`}
                              placeholder="e.g., 'flower'"
                            />
                            {touched.words?.[index]?.word && errors.words?.[index] && (
                              <p className="text-sm text-red-500">
                                {typeof errors.words[index] === 'object' && errors.words[index]?.word}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`words.${index}.pronunciation`}>Pronunciation</Label>
                            <Field
                              as={Input}
                              name={`words.${index}.pronunciation`}
                              placeholder="e.g., /flaʊər/"
                            />
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label htmlFor={`words.${index}.meaning`}>Meaning *</Label>
                          <Field
                            as={Textarea}
                            name={`words.${index}.meaning`}
                            placeholder="Enter the meaning of this word"
                            className="min-h-[80px]"
                          />
                          {touched.words?.[index]?.meaning && errors.words?.[index] && (
                            <p className="text-sm text-red-500">
                              {typeof errors.words[index] === 'object' && errors.words[index]?.meaning}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2 mt-4">
                          <Label htmlFor={`words.${index}.example`}>Example Sentence</Label>
                          <Field
                            as={Textarea}
                            name={`words.${index}.example`}
                            placeholder="Enter an example sentence"
                            className="min-h-[60px]"
                          />
                        </div>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => push({ word: '', meaning: '', example: '', pronunciation: '' })}
                      className="gap-2"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add Another Word
                    </Button>
                    {errors.words && typeof errors.words === 'string' && (
                      <p className="text-sm text-red-500">{errors.words}</p>
                    )}
                  </div>
                )}
              </FieldArray>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Field
                    as="select"
                    id="difficulty"
                    name="difficulty"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
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
                <Label htmlFor="notes">Notes</Label>
                <Field
                  as={Textarea}
                  id="notes"
                  name="notes"
                  placeholder="Additional notes about this homophone group..."
                  className="min-h-[100px]"
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
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Homophone Group' : 'Create Homophone Group'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

