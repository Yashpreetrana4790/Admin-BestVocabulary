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
import { deletePhrase, updatePhrase } from '../service/updatePhrase';
import { useRouter } from 'next/navigation';
import ChipInput from '@/components/ChipInput';

const PhrasalVerbSchema = Yup.object().shape({
  phrase: Yup.string().required('Phrase is required'),
  meaning: Yup.string().required('Meaning is required'),
  difficulty: Yup.string().oneOf(['easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard', 'Beginner', 'Intermediate', 'Advanced', ''], 'Invalid difficulty level'),
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
  difficulty?: string;
  example_sentences: string[];
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
};

type Props = {
  initialData: any;
  phraseId: string;
};

export default function PhrasalVerbEditor({ initialData, phraseId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Safely transform initialData to match form structure
  const getFormInitialValues = (): PhrasalVerbFormValues => {
    if (!initialData) {
      return {
        phrase: '',
        meaning: '',
        difficulty: 'medium',
        example_sentences: [''],
        synonyms: [],
        antonyms: [],
        relatedWords: [],
      };
    }

    // Handle example_sentences
    let exampleSentences: string[] = [''];
    if (Array.isArray(initialData.example_sentences) && initialData.example_sentences.length > 0) {
      exampleSentences = initialData.example_sentences.filter((s: any) => s && s.trim() !== '');
      if (exampleSentences.length === 0) exampleSentences = [''];
    } else if (initialData.example && typeof initialData.example === 'string' && initialData.example.trim() !== '') {
      exampleSentences = [initialData.example];
    }

    return {
      phrase: initialData.phrase || '',
      meaning: initialData.meaning || '',
      difficulty: initialData.difficulty || 'medium',
      example_sentences: exampleSentences,
      synonyms: Array.isArray(initialData.synonyms) ? initialData.synonyms.filter((s: any) => s) : [],
      antonyms: Array.isArray(initialData.antonyms) ? initialData.antonyms.filter((a: any) => a) : [],
      relatedWords: Array.isArray(initialData.relatedWords) ? initialData.relatedWords.filter((w: any) => w) : [],
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

  const playPronunciation = (phrase: string) => {
    if (!phrase) return;

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Speech synthesis is not supported in your browser.');
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);

    const utterance = new SpeechSynthesisUtterance(phrase);
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

  const handleSubmit = async (values: PhrasalVerbFormValues) => {
    setIsSubmitting(true);
    try {
      await updatePhrase(phraseId, values);
      toast.success('Phrasal verb updated successfully!');
      router.refresh();
    } catch (error: any) {
      console.error('Error updating phrasal verb:', error);
      toast.error(error?.message || 'Failed to update phrasal verb. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deletePhrase(phraseId);
      toast.success('Phrasal verb deleted successfully');
      router.push('/phrasal-verbs');
    } catch (error: any) {
      console.error('Error deleting phrasal verb:', error);
      toast.error(error?.message || 'Failed to delete phrasal verb. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Formik
        initialValues={formInitialValues}
        validationSchema={PhrasalVerbSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting: formikSubmitting }) => (
          <Form className="space-y-6">
            {/* Basic Information Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phrase and Difficulty Row */}
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phrase">Phrasal Verb *</Label>
                    <div className="flex items-center gap-2">
                      <Field
                        as={Input}
                        id="phrase"
                        name="phrase"
                        placeholder="E.g., 'look up to'"
                        className="text-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => playPronunciation(values.phrase)}
                        disabled={!values.phrase || isPlaying}
                        title="Play pronunciation"
                      >
                        <Volume2 className={`h-4 w-4 ${isPlaying ? 'text-blue-600 animate-pulse' : ''}`} />
                      </Button>
                    </div>
                    {touched.phrase && errors.phrase && (
                      <p className="text-sm text-red-500">{errors.phrase}</p>
                    )}
                  </div>

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
                    {touched.difficulty && errors.difficulty && (
                      <p className="text-sm text-red-500">{errors.difficulty}</p>
                    )}
                  </div>
                </div>

                {/* Meaning */}
                <div className="space-y-2">
                  <Label htmlFor="meaning">Meaning *</Label>
                  <Field
                    as={Textarea}
                    id="meaning"
                    name="meaning"
                    placeholder="Explain what this phrasal verb means..."
                    className="min-h-[120px] resize-none"
                  />
                  {touched.meaning && errors.meaning && (
                    <p className="text-sm text-red-500">{errors.meaning}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Example Sentences Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Example Sentences</CardTitle>
              </CardHeader>
              <CardContent>
                <FieldArray name="example_sentences">
                  {({ remove, push }) => (
                    <div className="space-y-3">
                      {values.example_sentences.map((sentence, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Field
                            as={Textarea}
                            name={`example_sentences.${index}`}
                            placeholder={`Example sentence ${index + 1}...`}
                            className="min-h-[90px] resize-none flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (values.example_sentences.length > 1) {
                                remove(index);
                                toast.success('Example sentence removed');
                              } else {
                                toast.error('At least one example sentence is required');
                              }
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 mt-2"
                            disabled={values.example_sentences.length <= 1}
                            title="Remove sentence"
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
                        Add Example Sentence
                      </Button>
                      {errors.example_sentences && typeof errors.example_sentences === 'string' && (
                        <p className="text-sm text-red-500">{errors.example_sentences}</p>
                      )}
                    </div>
                  )}
                </FieldArray>
              </CardContent>
            </Card>

            {/* Relationships Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Synonyms and Antonyms in Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Synonyms</Label>
                    <ChipInput
                      name="synonyms"
                      label=""
                      placeholder="Type and press Enter to add synonym"
                      initialItems={values.synonyms || []}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Antonyms</Label>
                    <ChipInput
                      name="antonyms"
                      label=""
                      placeholder="Type and press Enter to add antonym"
                      initialItems={values.antonyms || []}
                    />
                  </div>
                </div>

                {/* Related Words */}
                <div className="space-y-2">
                  <Label>Related Words</Label>
                  <ChipInput
                    name="relatedWords"
                    label=""
                    placeholder="Type and press Enter to add related word"
                    initialItems={values.relatedWords || []}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons Card */}
            <Card className="w-full">
              <CardContent className="pt-6">
                <div className="flex justify-end items-center gap-4">
                  <ConfirmationPopup
                    onConfirm={handleDelete}
                    confirmText="Delete Phrasal Verb"
                    variant="destructive"
                    disabled={formikSubmitting || isSubmitting}
                    title="Delete Phrasal Verb"
                    description={`Are you sure you want to delete "${values.phrase || 'this phrasal verb'}"? This action cannot be undone.`}
                  />
                  <Button type="submit" disabled={formikSubmitting || isSubmitting} size="lg">
                    {formikSubmitting || isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
}
