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

interface WordFormProps {
  wordId?: string;
  word: string;
  pronunciation: string;
  frequency: string;
  overall_tone: string;
  etymology: string;
  misspellings: string[]
}

const validationSchema = Yup.object({
  word: Yup.string().required("Word is required"),
  pronunciation: Yup.string().required("Pronunciation is required"),
  frequency: Yup.string().oneOf(['high', 'medium', 'low']).required("Frequency is required"),
  overall_tone: Yup.string(),
  etymology: Yup.string(),
  misspellings: Yup.array().of(Yup.string())
});





export default function BaseEditForm({
  wordId,
  word,
  pronunciation,
  frequency,
  overall_tone,
  etymology,
  misspellings
}: WordFormProps) {
  const router = useRouter();
  const isCreateMode = !wordId || wordId === '';

  const handleSubmit = async (values: WordFormProps) => {
    try {
      if (isCreateMode) {
        // Create new word
        const res = await createWord({
          word: values.word,
          pronunciation: values.pronunciation,
          frequency: values.frequency,
          overall_tone: values.overall_tone,
          etymology: values.etymology,
          misspellings: values.misspellings || []
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
          overall_tone: values.overall_tone, 
          etymology: values.etymology, 
          misspellings: values.misspellings 
        });

        if (res?.success === true) {
          router.push('/words');
        }
      }
    } catch (error) {
      console.error('Error saving word:', error);
      // Error handling could be improved with toast notifications
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
            overall_tone: overall_tone || "",
            etymology: etymology || "",
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
                <label htmlFor="overall_tone" className="block text-sm font-medium text-gray-700 mb-1">Overall Tone</label>
                <Field as={Input} id="overall_tone" name="overall_tone" placeholder="Enter overall tone" />
                {touched.overall_tone && errors.overall_tone && <p className="text-red-500 text-sm">{errors.overall_tone}</p>}
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
