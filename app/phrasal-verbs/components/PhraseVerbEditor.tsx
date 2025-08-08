'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { ConfirmationPopup } from '@/components/AlertComponent';
import { useState } from 'react';
import { deletePhrase } from '../service/updatePhrase';
import { useRouter } from 'next/navigation';

const PhrasalVerbSchema = Yup.object().shape({
  phrase: Yup.string().required('Phrase is required'),
  meaning: Yup.string().required('Meaning is required'),
  example_sentences: Yup.array()
    .of(Yup.string().required('Sentence cannot be empty'))
    .min(1, 'At least one example sentence is required'),
  synonyms: Yup.array().of(Yup.string()),
  antonyms: Yup.array().of(Yup.string()),
  relatedWords: Yup.array().of(Yup.string()),
});

type PhrasalVerbFormValues = {
  phrase: string;
  meaning: string;
  example_sentences: string[];
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
};

type Props = {
  initialData: PhrasalVerbFormValues;
  phraseId: string;
};

export default function PhrasalVerbEditor({ initialData, phraseId }: Props) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (values: PhrasalVerbFormValues) => {
    try {
      // await onSubmit(values);
      toast('Phrasal verb updated successfully', {
        description: "Sunday, December 03, 2023 at 9:00 AM",
      });
    } catch (error) {
      toast('Failed to update phrasal verb');
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      const res = await deletePhrase(phraseId);
      toast('Phrasal verb deleted successfully');
      router.push('/phrasal-verbs');

    } catch (error) {
      toast('Failed to delete phrasal verb');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Phrasal Verb</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialData}
          validationSchema={PhrasalVerbSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phrase">Phrase *</Label>
                <Field
                  as={Input}
                  id="phrase"
                  name="phrase"
                  placeholder="E.g., 'look up to'"
                />
                {touched.phrase && errors.phrase && (
                  <p className="text-sm text-red-500">{errors.phrase}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meaning">Meaning *</Label>
                <Field
                  as={Input}
                  id="meaning"
                  name="meaning"
                  placeholder="E.g., 'to admire someone'"
                />
                {touched.meaning && errors.meaning && (
                  <p className="text-sm text-red-500">{errors.meaning}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Example Sentences *</Label>
                <FieldArray name="example_sentences">
                  {({ remove, push }) => (
                    <div className="space-y-3">
                      {values.example_sentences.map((sentence, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Field
                            as={Input}
                            name={`example_sentences.${index}`}
                            placeholder={`Example sentence ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => push('')}
                        className="gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add Sentence
                      </Button>
                      {errors.example_sentences && typeof errors.example_sentences === 'string' && (
                        <p className="text-sm text-red-500">{errors.example_sentences}</p>
                      )}
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Synonyms</Label>
                  <FieldArray name="synonyms">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.synonyms.map((synonym, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Field
                              as={Input}
                              name={`synonyms.${index}`}
                              placeholder="Synonym"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => push('')}
                          className="gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Synonym
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <div className="space-y-2">
                  <Label>Antonyms</Label>
                  <FieldArray name="antonyms">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.antonyms.map((antonym, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Field
                              as={Input}
                              name={`antonyms.${index}`}
                              placeholder="Antonym"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => push('')}
                          className="gap-2"
                        >
                          <PlusCircle className="h-4 w-4" />
                          Add Antonym
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Related Words</Label>
                <FieldArray name="relatedWords">
                  {({ remove, push }) => (
                    <div className="space-y-3">
                      {values.relatedWords.map((word, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Field
                            as={Input}
                            name={`relatedWords.${index}`}
                            placeholder="Related word"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => push('')}
                        className="gap-2"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add Related Word
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
              <div className="w-full gap-4 mt-8">
                <ConfirmationPopup
                  onConfirm={handleDelete}
                  confirmText="Delete"
                  variant="destructive"
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}