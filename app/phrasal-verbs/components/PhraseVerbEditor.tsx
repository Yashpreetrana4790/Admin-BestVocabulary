'use client';

import { Button } from '@/components/ui/button';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

// Define validation schema
const PhrasalVerbSchema = Yup.object().shape({
  phrase: Yup.string().required('Required'),
  meaning: Yup.string().required('Required'),
  example_sentences: Yup.array().of(Yup.string()),
  synonyms: Yup.array().of(Yup.string()),
  antonyms: Yup.array().of(Yup.string()),
  relatedWords: Yup.array().of(Yup.string()),
});

type Props = {
  initialData: {
    phrase: string;
    meaning: string;
    example_sentences: string[];
    synonyms: string[];
    antonyms: string[];
    relatedWords: string[];
  };
};

export default function PhrasalVerbEditor({ initialData }: Props) {

    const handleSubmit = async (values: any) => {
      console.log(values,"values")
      }

  return (
    <Formik
      initialValues={initialData}
      validationSchema={PhrasalVerbSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <Form className="space-y-4 p-4">
          <div>
            <label>Phrase *</label>
            <Field name="phrase" className="input" />
            {touched.phrase && errors.phrase && <div className="text-red-500">{errors.phrase}</div>}
          </div>

          <div>
            <label>Meaning *</label>
            <Field name="meaning" className="input" />
            {touched.meaning && errors.meaning && <div className="text-red-500">{errors.meaning}</div>}
          </div>

          {/* Repeatable Fields: Example Sentences */}
          <FieldArray name="example_sentences">
            {({ remove, push }) => (
              <div>
                <label>Example Sentences</label>
                {values.example_sentences.map((sentence, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Field name={`example_sentences.${index}`} className="input" />
                    <Button type="button" onClick={() => remove(index)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={() => push('')}>Add Sentence</Button>
              </div>
            )}
          </FieldArray>

          {/* Synonyms */}
          <FieldArray name="synonyms">
            {({ remove, push }) => (
              <div>
                <label>Synonyms</label>
                {values.synonyms.map((synonym, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Field name={`synonyms.${index}`} className="input" />
                    <Button type="button" onClick={() => remove(index)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={() => push('')}>Add Synonym</Button>
              </div>
            )}
          </FieldArray>

          {/* Antonyms */}
          <FieldArray name="antonyms">
            {({ remove, push }) => (
              <div>
                <label>Antonyms</label>
                {values.antonyms.map((antonym, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Field name={`antonyms.${index}`} className="input" />
                    <Button type="button" onClick={() => remove(index)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={() => push('')}>Add Antonym</Button>
              </div>
            )}
          </FieldArray>

          {/* Related Words */}
          <FieldArray name="relatedWords">
            {({ remove, push }) => (
              <div>
                <label>Related Words</label>
                {values.relatedWords.map((word, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Field name={`relatedWords.${index}`} className="input" />
                    <Button type="button" onClick={() => remove(index)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" onClick={() => push('')}>Add Related Word</Button>
              </div>
            )}
          </FieldArray>

          <Button type="submit">Update</Button>
        </Form>
      )}
    </Formik>
  );
}
