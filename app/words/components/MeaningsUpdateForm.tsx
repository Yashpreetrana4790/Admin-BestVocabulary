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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { updateWordMeaningInfo } from '../service/updateWord';
import { useRouter } from 'next/navigation';

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
  synonyms?: string[];
  antonyms?: string[];
  _id?: string;
}

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

const MeaningsUpdateForm = ({ wordId, initialMeanings }: MeaningsUpdateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meaningToDelete, setMeaningToDelete] = useState<number | null>(null);
  const router = useRouter();

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
      // Process each meaning individually
     await updateWordMeaningInfo(wordId, values.meanings );
      alert('Meanings updated successfully!');
    } catch (error) {
      console.error('Error updating meanings:', error);
      alert('Failed to update meanings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Store the delete handler ref to access Formik context
  const deleteHandlerRef = React.useRef<{
    remove: (index: number) => void;
    currentMeanings: Meaning[];
  } | null>(null);

  // Handle delete meaning with confirmation
  const handleDeleteMeaning = (
    remove: (index: number) => void,
    currentMeanings: Meaning[],
    indexToDelete: number
  ) => {
    // Store the handler and meaning index
    deleteHandlerRef.current = { remove, currentMeanings };
    setMeaningToDelete(indexToDelete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (meaningToDelete === null || !deleteHandlerRef.current) return;

    const { remove, currentMeanings } = deleteHandlerRef.current;
    setIsSubmitting(true);
    
    try {
      // Remove the meaning from the array
      const updatedMeanings = currentMeanings.filter((_, index) => index !== meaningToDelete);
      
      // Immediately update the backend
      await updateWordMeaningInfo(wordId, updatedMeanings);
      
      // Remove from formik state (this updates the UI immediately)
      remove(meaningToDelete);
      
      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setMeaningToDelete(null);
      deleteHandlerRef.current = null;
      
      // Show success message
      alert('Meaning deleted successfully!');
      
      // Refresh the page after a short delay to get latest data from server
      setTimeout(() => {
        router.refresh();
      }, 500);
    } catch (error) {
      console.error('Error deleting meaning:', error);
      alert('Failed to delete meaning. Please try again.');
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setMeaningToDelete(null);
      deleteHandlerRef.current = null;
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meaning?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this meaning? This action cannot be undone and will permanently remove the meaning from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setMeaningToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={meaningValidationSchema}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({ values, errors }) => (
          <Form className="space-y-6 border rounded-lg p-6">
            <h2 className="text-md font-semibold">Update Meanings</h2>
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
                          onClick={() => handleDeleteMeaning(remove, values.meanings, meaningIndex)}
                          disabled={values.meanings.length <= 1 || isSubmitting}
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
                                        Context {usageIndex === 0 && <span className="text-red-500">*</span>}
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
                                        Example {usageIndex === 0 && <span className="text-red-500">*</span>}
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