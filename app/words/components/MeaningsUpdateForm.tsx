'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { updateWordMeaningInfo } from '../service/updateWord';
import { RelationsManager } from './RelationsManager';

interface CommonUsage {
  context: string;
  example: string;
  _id?: string;
}

interface Meaning {
  pos: string;
  subtitle?: string;
  pronunciation: string;
  common_usage: CommonUsage[];
  tone?: string;
  category?: string;
  difficulty?: string;
  meaning: string;
  mnemonic?: string;
  easyMeaning?: string;
  kiddefinition?: string;
  example_sentences: string[];
  synonyms?: string[] | Array<{ wordId: string; word: string; pronunciation?: string; meaning?: string }>;
  antonyms?: string[];
  _id?: string;
}

// Helper to convert synonyms to/from API format
const convertSynonymsToItems = (synonyms: Meaning['synonyms']): Array<{ wordId: string; word: string; pronunciation?: string; meaning?: string }> => {
  if (!synonyms || synonyms.length === 0) return [];

  // Handle string array format
  if (typeof synonyms[0] === 'string') {
    return (synonyms as string[]).map((word, index) => ({
      wordId: `temp-${index}-${word}`,
      word: word,
    }));
  }

  // Handle WordReference format (with _id.$oid or _id as string)
  const refs = synonyms as Array<{ _id?: { $oid?: string } | string; wordId?: string; word?: string; pronunciation?: string; meaning?: string }>;
  return refs.map((ref) => {
    const wordId: string = typeof ref._id === 'object' && ref._id?.$oid
      ? ref._id.$oid
      : (typeof ref._id === 'string' ? ref._id : (ref.wordId || `temp-${ref.word || 'unknown'}`));

    return {
      wordId,
      word: typeof ref.word === 'string' ? ref.word : (typeof ref === 'string' ? ref : ''),
      pronunciation: ref.pronunciation,
      meaning: ref.meaning,
    };
  });
};

const convertSynonymsToStrings = (synonyms: Array<{ wordId: string; word: string; pronunciation?: string; meaning?: string }>): string[] => {
  return synonyms.map((s) => s.word);
};

// Helper to convert antonyms to/from API format (similar to synonyms)
const convertAntonymsToItems = (antonyms: Meaning['antonyms']): Array<{ wordId: string; word: string; pronunciation?: string; meaning?: string }> => {
  if (!antonyms || antonyms.length === 0) return [];

  // Handle string array format
  if (typeof antonyms[0] === 'string') {
    return (antonyms as string[]).map((word, index) => ({
      wordId: `temp-${index}-${word}`,
      word: word,
    }));
  }

  // Handle WordReference format (with _id.$oid or _id as string)
  const refs = antonyms as Array<{ _id?: { $oid?: string } | string; wordId?: string; word?: string; pronunciation?: string; meaning?: string }>;
  return refs.map((ref) => {
    const wordId: string = typeof ref._id === 'object' && ref._id?.$oid
      ? ref._id.$oid
      : (typeof ref._id === 'string' ? ref._id : (ref.wordId || `temp-${ref.word || 'unknown'}`));

    return {
      wordId,
      word: typeof ref.word === 'string' ? ref.word : (typeof ref === 'string' ? ref : ''),
      pronunciation: ref.pronunciation,
      meaning: ref.meaning,
    };
  });
};

const convertAntonymsToStrings = (antonyms: Array<{ wordId: string; word: string; pronunciation?: string; meaning?: string }>): string[] => {
  return antonyms.map((a) => a.word);
};

interface MeaningsUpdateFormProps {
  wordId: string;
  initialMeanings: Meaning[];
}

const meaningValidationSchema = Yup.object().shape({
  meanings: Yup.array().of(
    Yup.object().shape({
      pos: Yup.string().required('Part of speech is required'),
      pronunciation: Yup.string().required('Pronunciation is required'),
      meaning: Yup.string().required('Definition is required'),
      common_usage: Yup.array().of(
        Yup.object().shape({
          context: Yup.string().required('Context is required'),
          example: Yup.string().required('Example is required'),
        })
      ),
      example_sentences: Yup.array().of(
        Yup.string().required('Sentence cannot be empty')
      ).min(1, 'At least one example sentence is required'),
      tone: Yup.string(),
      category: Yup.string(),
      difficulty: Yup.string(),
      subtitle: Yup.string(),
      mnemonic: Yup.string(),
      easyMeaning: Yup.string(),
      kiddefinition: Yup.string(),
      synonyms: Yup.array().of(Yup.string()),
      antonyms: Yup.array().of(Yup.string()),
    })
  ),
});

// Normalize initialMeanings to ensure all required fields exist
const normalizeMeanings = (meanings: Meaning[]): Meaning[] => {
  if (!meanings || meanings.length === 0) {
    return [{
      pos: '',
      subtitle: '',
      pronunciation: '',
      common_usage: [{ context: '', example: '' }],
      tone: '',
      category: '',
      difficulty: '',
      meaning: '',
      mnemonic: '',
      easyMeaning: '',
      kiddefinition: '',
      example_sentences: [''],
      synonyms: [],
      antonyms: []
    }];
  }

  return meanings.map((meaning) => ({
    pos: meaning.pos || '',
    subtitle: meaning.subtitle || '',
    pronunciation: meaning.pronunciation || '',
    common_usage: meaning.common_usage && meaning.common_usage.length > 0
      ? meaning.common_usage
      : [{ context: '', example: '' }],
    tone: meaning.tone || '',
    category: meaning.category || '',
    difficulty: meaning.difficulty || '',
    meaning: meaning.meaning || meaning.subtitle || '',
    mnemonic: meaning.mnemonic || '',
    easyMeaning: meaning.easyMeaning || '',
    kiddefinition: meaning.kiddefinition || '',
    example_sentences: meaning.example_sentences && meaning.example_sentences.length > 0
      ? meaning.example_sentences
      : [''],
    synonyms: meaning.synonyms || [],
    antonyms: meaning.antonyms || [],
    _id: meaning._id,
  }));
};

const MeaningsUpdateForm = ({ wordId, initialMeanings }: MeaningsUpdateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const [formMeanings, setFormMeanings] = useState<Meaning[]>([]);

  // Load initial data once on mount - check for data when initialMeanings becomes available
  React.useEffect(() => {
    if (!hasLoadedInitialData) {
      if (initialMeanings && initialMeanings.length > 0) {
        console.log('📥 Loading initial meanings:', initialMeanings.length);
        const normalized = normalizeMeanings(initialMeanings);
        setFormMeanings(normalized);

        const initialState: Record<number, boolean> = {};
        normalized.forEach((_, index) => {
          initialState[index] = true;
        });
        setOpenSections(initialState);
        setHasLoadedInitialData(true);
      } else {
        // Start with empty form if no initial data
        console.log('📥 No initial meanings, starting with empty form');
        setFormMeanings([{
          pos: '',
          subtitle: '',
          pronunciation: '',
          common_usage: [{ context: '', example: '' }],
          tone: '',
          category: '',
          difficulty: '',
          meaning: '',
          mnemonic: '',
          easyMeaning: '',
          kiddefinition: '',
          example_sentences: [''],
          synonyms: [],
          antonyms: []
        }]);
        setHasLoadedInitialData(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMeanings]); // Watch initialMeanings to load when it becomes available

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = async (values: { meanings: Meaning[] }) => {
    setIsSubmitting(true);
    try {
      // Convert meanings to match service's expected format (all required fields as strings)
      const convertedMeanings = values.meanings.map((meaning) => ({
        pos: meaning.pos || '',
        subtitle: meaning.subtitle || '',
        pronunciation: meaning.pronunciation || '',
        common_usage: meaning.common_usage || [{ context: '', example: '' }],
        tone: meaning.tone || '',
        category: meaning.category || '',
        difficulty: meaning.difficulty || '',
        meaning: meaning.meaning || '',
        mnemonic: meaning.mnemonic || '',
        easyMeaning: meaning.easyMeaning || '',
        kiddefinition: meaning.kiddefinition || '',
        example_sentences: meaning.example_sentences || [],
        synonyms: Array.isArray(meaning.synonyms)
          ? (meaning.synonyms.every(s => typeof s === 'string')
            ? meaning.synonyms as string[]
            : (meaning.synonyms as Array<{ word?: string }>).map(s => s.word || '').filter(Boolean))
          : [],
        antonyms: meaning.antonyms || [],
      }));

      // Process each meaning individually
      await updateWordMeaningInfo(wordId, convertedMeanings);
      alert('Meanings updated successfully!');
    } catch (error) {
      console.error('Error updating meanings:', error);
      alert('Failed to update meanings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use formMeanings state - useMemo to update when formMeanings changes
  const initialValues = React.useMemo(() => {
    if (formMeanings.length > 0) {
      console.log('✅ Form initialized with meanings:', formMeanings.length);
      return { meanings: formMeanings };
    }
    console.log('⚠️ Form initialized with empty meaning');
    return {
      meanings: [{
        pos: '',
        subtitle: '',
        pronunciation: '',
        common_usage: [{ context: '', example: '' }],
        tone: '',
        category: '',
        difficulty: '',
        meaning: '',
        mnemonic: '',
        easyMeaning: '',
        kiddefinition: '',
        example_sentences: [''],
        synonyms: [],
        antonyms: []
      }]
    };
  }, [formMeanings]);


  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md font-semibold">Update Meanings</h2>
      </div>
      <Formik
        key={`meanings-form-${hasLoadedInitialData ? 'loaded' : 'empty'}-${formMeanings.length}`}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={meaningValidationSchema}
        validateOnChange={false}
        validateOnBlur={true}
        enableReinitialize={true}
      >
        {({ values, resetForm }) => {
          // Update reset handler to use Formik's resetForm
          const handleResetWithForm = () => {
            resetForm({
              values: {
                meanings: [{
                  pos: '',
                  subtitle: '',
                  pronunciation: '',
                  common_usage: [{ context: '', example: '' }],
                  tone: '',
                  category: '',
                  difficulty: '',
                  meaning: '',
                  mnemonic: '',
                  easyMeaning: '',
                  kiddefinition: '',
                  example_sentences: [''],
                  synonyms: [],
                  antonyms: []
                }]
              }
            });
            setFormMeanings([{
              pos: '',
              subtitle: '',
              pronunciation: '',
              common_usage: [{ context: '', example: '' }],
              tone: '',
              category: '',
              difficulty: '',
              meaning: '',
              mnemonic: '',
              easyMeaning: '',
              kiddefinition: '',
              example_sentences: [''],
              synonyms: [],
              antonyms: []
            }]);
          };

          const handleLoadFromAPIWithForm = () => {
            const normalized = normalizeMeanings(initialMeanings);
            resetForm({
              values: {
                meanings: normalized
              }
            });
            setFormMeanings(normalized);

            // Update open sections
            const newOpenSections: Record<number, boolean> = {};
            normalized.forEach((_, index) => {
              newOpenSections[index] = true;
            });
            setOpenSections(newOpenSections);
          };

          return (
            <>
              <div className="flex items-center justify-end gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLoadFromAPIWithForm}
                  className="text-xs"
                >
                  Load from API
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetWithForm}
                  className="text-xs"
                >
                  Clear Form
                </Button>
              </div>
              <Form className="space-y-6 border rounded-lg p-6">
                <FieldArray name="meanings">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.meanings.map((meaning, meaningIndex) => (
                        <Collapsible
                          key={meaning._id || meaningIndex}
                          open={openSections[meaningIndex]}
                          onOpenChange={() => toggleSection(meaningIndex)}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-9 p-0"
                                >
                                  {openSections[meaningIndex] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Toggle</span>
                                </Button>
                              </CollapsibleTrigger>
                              <h3 className="text-lg font-medium">
                                Meaning #{meaningIndex + 1}
                              </h3>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="cursor-pointer"
                              onClick={() => remove(meaningIndex)}
                              disabled={values.meanings.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <CollapsibleContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Part of Speech */}
                              <div>
                                <Label htmlFor={`meanings.${meaningIndex}.pos`} className="mb-2">
                                  Part of Speech <span className="text-red-500">*</span>
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.pos`}
                                  placeholder="noun, verb, etc."
                                />
                                <ErrorMessage
                                  name={`meanings.${meaningIndex}.pos`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>

                              {/* Pronunciation */}
                              <div>
                                <Label htmlFor={`meanings.${meaningIndex}.pronunciation`} className="mb-2">
                                  Pronunciation <span className="text-red-500">*</span>
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.pronunciation`}
                                  placeholder="/prəˌnʌn.siˈeɪ.ʃən/"
                                />
                                <ErrorMessage
                                  name={`meanings.${meaningIndex}.pronunciation`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                              {/* Subtitle */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.subtitle`} className="mb-2">
                                  Subtitle
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.subtitle`}
                                  placeholder="Enter subtitle"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.notes`} className="mb-2">
                                  Note
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.notes`}
                                  placeholder="Enter note"
                                />
                              </div>


                              {/* Definition */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.meaning`} className="mb-2">
                                  Definition <span className="text-red-500">*</span>
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.meaning`}
                                  placeholder="Enter the definition"
                                />
                                <ErrorMessage
                                  name={`meanings.${meaningIndex}.meaning`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>


                              {/* Mnemonic */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.mnemonic`} className="mb-2">
                                  Mnemonic
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.mnemonic`}
                                  placeholder="Enter mnemonic"
                                />
                              </div>

                              {/* Easy Meaning */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.easyMeaning`} className="mb-2">
                                  Easy Meaning
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.easyMeaning`}
                                  placeholder="Enter easy meaning"
                                />
                              </div>

                              {/* Kid Definition */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.kiddefinition`} className="mb-2">
                                  Kid Definition
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.kiddefinition`}
                                  placeholder="Enter kid-friendly definition"
                                />
                              </div>

                              {/* Tone */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.tone`} className="mb-2">
                                  Tone
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.tone`}
                                  placeholder="Enter tone"
                                />
                              </div>

                              {/* Category */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.category`} className="mb-2">
                                  Category
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.category`}
                                  placeholder="Enter category"
                                />
                              </div>

                              {/* Difficulty */}
                              <div className="md:col-span-2">
                                <Label htmlFor={`meanings.${meaningIndex}.difficulty`} className="mb-2">
                                  Difficulty
                                </Label>
                                <Field
                                  as={Input}
                                  name={`meanings.${meaningIndex}.difficulty`}
                                  placeholder="Enter difficulty"
                                />
                              </div>
                            </div>

                            {/* Common Usage Section */}
                            <div className="space-y-4">
                              <h4 className="font-medium">Common Usage</h4>
                              <FieldArray name={`meanings.${meaningIndex}.common_usage`}>
                                {({ push: pushUsage, remove: removeUsage }) => (
                                  <div className="space-y-4">
                                    {meaning.common_usage.map((usage, usageIndex) => (
                                      <div key={usageIndex} className="border rounded p-4 space-y-2">
                                        <div className="flex justify-end">
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeUsage(usageIndex)}
                                            disabled={meaning.common_usage.length <= 1}
                                            className="cursor-pointer"
                                          >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                          </Button>
                                        </div>
                                        <div>
                                          <Label htmlFor={`meanings.${meaningIndex}.common_usage.${usageIndex}.context`} className="mb-2">
                                            Context
                                          </Label>
                                          <Field
                                            as={Input}
                                            name={`meanings.${meaningIndex}.common_usage.${usageIndex}.context`}
                                            placeholder="Literary, Formal, etc."
                                          />
                                          {usageIndex === 0 && (
                                            <ErrorMessage
                                              name={`meanings.${meaningIndex}.common_usage.${usageIndex}.context`}
                                              component="div"
                                              className="text-red-500 text-sm mt-1"
                                            />
                                          )}
                                        </div>
                                        <div>
                                          <Label htmlFor={`meanings.${meaningIndex}.common_usage.${usageIndex}.example`} className="mb-2">
                                            Example
                                          </Label>
                                          <Field
                                            as={Input}
                                            name={`meanings.${meaningIndex}.common_usage.${usageIndex}.example`}
                                            placeholder="Example sentence"
                                          />
                                          {usageIndex === 0 && (
                                            <ErrorMessage
                                              name={`meanings.${meaningIndex}.common_usage.${usageIndex}.example`}
                                              component="div"
                                              className="text-red-500 text-sm mt-1"
                                            />
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => pushUsage({ context: '', example: '' })}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Common Usage
                                    </Button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>

                            {/* Example Sentences Section */}
                            <div className="space-y-4">
                              <h4 className="font-medium">
                                Example Sentences <span className="text-red-500">*</span>
                              </h4>
                              <FieldArray name={`meanings.${meaningIndex}.example_sentences`}>
                                {({ push: pushSentence, remove: removeSentence }) => (
                                  <div className="space-y-2">
                                    {meaning.example_sentences.map((sentence, sentenceIndex) => (
                                      <div key={sentenceIndex} className="flex items-center gap-2">
                                        <Field
                                          as={Input}
                                          name={`meanings.${meaningIndex}.example_sentences.${sentenceIndex}`}
                                          placeholder="Example sentence"
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="cursor-pointer"
                                          onClick={() => removeSentence(sentenceIndex)}
                                          disabled={meaning.example_sentences.length <= 1}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    ))}
                                    <ErrorMessage
                                      name={`meanings.${meaningIndex}.example_sentences`}
                                      component="div"
                                      className="text-red-500 text-sm mt-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => pushSentence('')}
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Example Sentence
                                    </Button>
                                  </div>
                                )}
                              </FieldArray>
                            </div>

                            {/* Relations Section with Drag-and-Drop (Synonyms & Antonyms) */}
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                              <Field name={`meanings.${meaningIndex}.synonyms`}>
                                {({ field: synonymsField, form: formik }: { field: { value: Meaning['synonyms'] }, form: { setFieldValue: (name: string, value: unknown) => void } }) => {
                                  const synonymItems = convertSynonymsToItems(synonymsField.value);
                                  const currentAntonyms = values.meanings[meaningIndex]?.antonyms || [];
                                  const antonymItems = convertAntonymsToItems(currentAntonyms);

                                  return (
                                    <RelationsManager
                                      synonyms={synonymItems}
                                      antonyms={antonymItems}
                                      onSynonymsChange={(newSynonyms) => {
                                        formik.setFieldValue(
                                          `meanings.${meaningIndex}.synonyms`,
                                          convertSynonymsToStrings(newSynonyms)
                                        );
                                      }}
                                      onAntonymsChange={(newAntonyms) => {
                                        formik.setFieldValue(
                                          `meanings.${meaningIndex}.antonyms`,
                                          convertAntonymsToStrings(newAntonyms)
                                        );
                                      }}
                                      label="Word Relations"
                                    />
                                  );
                                }}
                              </Field>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newIndex = values.meanings.length;
                          push({
                            pos: '',
                            subtitle: '',
                            pronunciation: '',
                            common_usage: [{ context: '', example: '' }],
                            tone: '',
                            category: '',
                            difficulty: '',
                            meaning: '',
                            mnemonic: '',
                            easyMeaning: '',
                            kiddefinition: '',
                            example_sentences: [''],
                            synonyms: [],
                            antonyms: []
                          });
                          setOpenSections(prev => ({ ...prev, [newIndex]: true }));
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Meaning
                      </Button>
                    </div>
                  )}
                </FieldArray>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default MeaningsUpdateForm;