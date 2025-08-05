'use client'
import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface CommonUsage {
  context: string;
  example: string;
  _id?: { $oid: string };
}

interface Meaning {
  pos: string;
  subtitle: string;
  pronunciation: string;
  common_usage: CommonUsage[];
  tone: string;
  category: string;
  difficulty: string;
  meaning: string;
  mnemonic: string;
  easyMeaning: string;
  kiddefinition: string;
  example_sentences: string[];
  synonyms: string[];
  antonyms: string[];
  _id?: { $oid: string };
}

interface MeaningsUpdateFormProps {
  wordId: string;
  initialMeanings: Meaning[];
}

const MeaningsUpdateForm = ({ wordId, initialMeanings }: MeaningsUpdateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  // Initialize all sections as open by default
  React.useEffect(() => {
    const initialState: Record<number, boolean> = {};
    initialMeanings.forEach((_, index) => {
      initialState[index] = true;
    });
    setOpenSections(initialState);
  }, [initialMeanings]);

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = async (values: { meanings: Meaning[] }) => {
    setIsSubmitting(true);
    try {
      // Call your API to update meanings
      console.log('Submitting:', values);
      // await updateMeanings(wordId, values.meanings);
    } catch (error) {
      console.error('Error updating meanings:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialValues = {
    meanings: initialMeanings.length > 0 ? initialMeanings : [{
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

  return (
    <div className="space-y-6 w-full">
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-6 border rounded-lg p-6">
            <h2 className="text-md font-semibold">Update Meanings</h2>
            <FieldArray name="meanings">
              {({ push, remove }) => (
                <div className="space-y-4">
                  {values.meanings.map((meaning, meaningIndex) => (
                    <Collapsible
                      key={meaningIndex}
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
                          <h3 className="text-lg font-medium">Meaning #{meaningIndex + 1}</h3>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(meaningIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <CollapsibleContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`meanings.${meaningIndex}.pos`}>Part of Speech</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.pos`}
                              placeholder="noun, verb, etc."
                            />
                          </div>

                          <div>
                            <Label htmlFor={`meanings.${meaningIndex}.pronunciation`}>Pronunciation</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.pronunciation`}
                              placeholder="/prəˌnʌn.siˈeɪ.ʃən/"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.meaning`}>Definition</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.meaning`}
                              placeholder="Enter the definition"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.subtitle`}>Subtitle</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.subtitle`}
                              placeholder="Enter subtitle"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.mnemonic`}>Mnemonic</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.mnemonic`}
                              placeholder="Enter mnemonic"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.easyMeaning`}>Easy Meaning</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.easyMeaning`}
                              placeholder="Enter easy meaning"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.kiddefinition`}>Kid Definition</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.kiddefinition`}
                              placeholder="Enter kid-friendly definition"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.tone`}>Tone</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.tone`}
                              placeholder="Enter tone"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.category`}>Category</Label>
                            <Field
                              as={Input}
                              name={`meanings.${meaningIndex}.category`}
                              placeholder="Enter category"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`meanings.${meaningIndex}.difficulty`}>Difficulty</Label>
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
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div>
                                      <Label htmlFor={`meanings.${meaningIndex}.common_usage.${usageIndex}.context`}>Context</Label>
                                      <Field
                                        as={Input}
                                        name={`meanings.${meaningIndex}.common_usage.${usageIndex}.context`}
                                        placeholder="Literary, Formal, etc."
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`meanings.${meaningIndex}.common_usage.${usageIndex}.example`}>Example</Label>
                                      <Field
                                        as={Input}
                                        name={`meanings.${meaningIndex}.common_usage.${usageIndex}.example`}
                                        placeholder="Example sentence"
                                      />
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
                          <h4 className="font-medium">Example Sentences</h4>
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
                                      onClick={() => removeSentence(sentenceIndex)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
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
        )}
      </Formik>
    </div>
  );
};

export default MeaningsUpdateForm;