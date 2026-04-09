'use client';

import { Formik, Form, Field } from 'formik';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import * as Yup from 'yup';
import { updateBaseWordInfo } from '../service/updateWord';
import { createWord } from '../service/createWord';
import { useRouter } from 'next/navigation';
import ChipInput from '@/components/ChipInput';
import {
  WORD_OVERALL_TONE_VALUES,
  WORD_OVERALL_TONE_LABELS,
  normalizeOverallToneForForm,
} from '@/lib/wordOverallTone';

interface WordFormProps {
  wordId?: string;
  word: string;
  pronunciation: string;
  frequency: string;
  /** Legacy API key; initial value can also come from `overallTone` prop */
  overall_tone: string;
  /** Canonical API key (optional); merged into form initial overall_tone */
  overallTone?: string;
  etymology: string;
  note: string;
  misspellings: string[];
}

const validationSchema = Yup.object({
  word: Yup.string().required("Word is required"),
  pronunciation: Yup.string().required("Pronunciation is required"),
  frequency: Yup.string().oneOf(['high', 'medium', 'low']).required("Frequency is required"),
  overall_tone: Yup.string().oneOf([...WORD_OVERALL_TONE_VALUES, ''], 'Select a valid tone or leave blank'),
  note: Yup.string().max(200, "Note must be 200 characters or less"),
  etymology: Yup.string(),
  misspellings: Yup.array().of(Yup.string())
});

export default function BaseEditForm({
  wordId,
  word,
  pronunciation,
  frequency,
  overall_tone,
  overallTone,
  etymology,
  note,
  misspellings
}: WordFormProps) {
  const router = useRouter();
  const isCreateMode = !wordId || wordId === '';

  const initialTone = normalizeOverallToneForForm(overall_tone || overallTone);

  const handleSubmit = async (values: WordFormProps) => {
    const tone = values.overall_tone?.trim() || undefined;
    try {
      if (isCreateMode) {
        // Create new word
        const res = await createWord({
          word: values.word,
          pronunciation: values.pronunciation,
          frequency: values.frequency,
          overall_tone: tone,
          overallTone: tone,
          etymology: values.etymology,
          misspellings: values.misspellings || [],
          note: values.note || undefined,
        });

        if (res?.success === true && res?.data?.word) {
          // Redirect to edit page with the word text (as per the route structure)
          router.push(`/words/${res.data.word}`);
        }
      } else {
        // Update existing word
        const res = await updateBaseWordInfo({ 
          wordId, 
          word: values.word, 
          pronunciation: values.pronunciation, 
          frequency: values.frequency, 
          overall_tone: tone,
          overallTone: tone,
          etymology: values.etymology, 
          misspellings: values.misspellings,
          note: values.note
        });

        if (res?.success === true) {
          router.push('/words');
        }
      }
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{isCreateMode ? 'Create New Word' : 'Edit Basic Details of Word'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{
            wordId: wordId || "",
            word: word || "",
            pronunciation: pronunciation || "",
            frequency: String(frequency ?? "medium"),
            overall_tone: initialTone,
            etymology: etymology || "",
            note: note || "",
            misspellings: misspellings || []
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">Word</label>
                <Field as={Input} id="word" name="word" placeholder="Enter word" />
                {touched.word && errors.word && <p className="text-red-500 text-sm">{errors.word}</p>}
              </div>

              <div>
                <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700 mb-1">Pronunciation</label>
                <Field as={Input} id="pronunciation" name="pronunciation" placeholder="Enter pronunciation" />
                {touched.pronunciation && errors.pronunciation && <p className="text-red-500 text-sm">{errors.pronunciation}</p>}
              </div>

              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <Field as="select" id="frequency" name="frequency" className="w-full p-2 border rounded">
                  <option value="">Select frequency</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Field>

                {touched.frequency && errors.frequency && <p className="text-red-500 text-sm">{errors.frequency}</p>}
              </div>
              <div>
                <label htmlFor="etymology" className="block text-sm font-medium text-gray-700 mb-1">Etymology</label>
                <Field as={Input} id="etymology" name="etymology" placeholder="Enter etymology" />
                {touched.etymology && errors.etymology && <p className="text-red-500 text-sm">{errors.etymology}</p>}
              </div>
              <div>
                <label htmlFor="overall_tone" className="block text-sm font-medium text-gray-700 mb-1">
                  Overall tone
                </label>
                <Field
                  as="select"
                  id="overall_tone"
                  name="overall_tone"
                  className="w-full p-2 border rounded-md bg-background text-foreground"
                >
                  <option value="">Not set</option>
                  {WORD_OVERALL_TONE_VALUES.map((value) => (
                    <option key={value} value={value}>
                      {WORD_OVERALL_TONE_LABELS[value]}
                    </option>
                  ))}
                </Field>
                <p className="text-xs text-muted-foreground mt-1">
                  Matches dictionary schema: formal, informal, neutral, academic, technical, colloquial, literary.
                </p>
                {touched.overall_tone && errors.overall_tone && (
                  <p className="text-red-500 text-sm">{errors.overall_tone}</p>
                )}
              </div>
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">note</label>
                <Field as={Input} id="note" name="note" placeholder="Enter note" />
                {touched.note && errors.note && <p className="text-red-500 text-sm">{errors.note}</p>}
              </div>

              <div>
                <ChipInput
                  name="misspellings"
                  label="Misspellings"
                  initialItems={misspellings}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isCreateMode ? 'Create Word' : 'Save Changes'}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}
