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
import { createConfusedWords, updateConfusedWords } from '../../service/categoriesService';
import { useRouter } from 'next/navigation';
import ChipInput from '@/components/ChipInput';
import WordSearchWithDrag from '@/components/WordSearchWithDrag';

const ConfusedWordsSchema = Yup.object().shape({
  word1: Yup.object().shape({
    word: Yup.string().required('Word 1 is required'),
    meaning: Yup.string().required('Meaning 1 is required'),
    pronunciation: Yup.string(),
    examples: Yup.array().of(Yup.string()),
  }),
  word2: Yup.object().shape({
    word: Yup.string().required('Word 2 is required'),
    meaning: Yup.string().required('Meaning 2 is required'),
    pronunciation: Yup.string(),
    examples: Yup.array().of(Yup.string()),
  }),
  explanation: Yup.string().required('Explanation is required'),
  commonMistake: Yup.string(),
  difficulty: Yup.string().oneOf(['easy', 'medium', 'hard']),
  tags: Yup.array().of(Yup.string()),
  memoryTip: Yup.string(),
});

type ConfusedWordsFormValues = {
  word1: {
    word: string;
    meaning: string;
    pronunciation?: string;
    examples: string[];
  };
  word2: {
    word: string;
    meaning: string;
    pronunciation?: string;
    examples: string[];
  };
  explanation: string;
  commonMistake?: string;
  difficulty?: string;
  tags: string[];
  memoryTip?: string;
};

type Props = {
  initialData?: any;
  confusedWordsId?: string;
};

export default function ConfusedWordsForm({ initialData, confusedWordsId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggingCardId, setDraggingCardId] = useState<'word1' | 'word2' | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<'word1' | 'word2' | null>(null);
  const isEditMode = !!confusedWordsId;

  const formInitialValues: ConfusedWordsFormValues = {
    word1: {
      word: initialData?.word1?.word || '',
      meaning: initialData?.word1?.meaning || '',
      pronunciation: initialData?.word1?.pronunciation || '',
      examples: initialData?.word1?.examples || [],
    },
    word2: {
      word: initialData?.word2?.word || '',
      meaning: initialData?.word2?.meaning || '',
      pronunciation: initialData?.word2?.pronunciation || '',
      examples: initialData?.word2?.examples || [],
    },
    explanation: initialData?.explanation || '',
    commonMistake: initialData?.commonMistake || '',
    difficulty: initialData?.difficulty || 'medium',
    tags: initialData?.tags || [],
    memoryTip: initialData?.memoryTip || '',
  };

  const handleSubmit = async (values: ConfusedWordsFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && confusedWordsId) {
        await updateConfusedWords(confusedWordsId, values);
        toast.success('Confused word pair updated successfully!');
      } else {
        await createConfusedWords(values);
        toast.success('Confused word pair created successfully!');
      }
      router.push('/categories/confused-words');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving confused words:', error);
      toast.error(error?.message || 'Failed to save confused word pair. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={ConfusedWordsSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue }) => {
        const handleWordDrop = (wordOption: any, targetCardId: 'word1' | 'word2') => {
          const sourceCardId = targetCardId === 'word1' ? 'word2' : 'word1';
          
          // Store the source word data before swapping
          const sourceWord = values[sourceCardId];
          const targetWord = values[targetCardId];
          
          // If both cards have words, swap them
          if (sourceWord.word && targetWord.word) {
            // Set target card with source word
            setFieldValue(`${targetCardId}.word`, sourceWord.word);
            setFieldValue(`${targetCardId}.meaning`, sourceWord.meaning);
            setFieldValue(`${targetCardId}.pronunciation`, sourceWord.pronunciation);
            
            // Set source card with dropped word
            setFieldValue(`${sourceCardId}.word`, wordOption.word);
            if (wordOption.meanings && wordOption.meanings.length > 0) {
              setFieldValue(`${sourceCardId}.meaning`, wordOption.meanings[0].meaning);
            }
            if (wordOption.pronunciation) {
              setFieldValue(`${sourceCardId}.pronunciation`, wordOption.pronunciation);
            }
          } else {
            // Just set the dropped word in the target card
            setFieldValue(`${targetCardId}.word`, wordOption.word);
            if (wordOption.meanings && wordOption.meanings.length > 0) {
              setFieldValue(`${targetCardId}.meaning`, wordOption.meanings[0].meaning);
            }
            if (wordOption.pronunciation) {
              setFieldValue(`${targetCardId}.pronunciation`, wordOption.pronunciation);
            }
          }
          
          setDragOverCardId(null);
          setDraggingCardId(null);
        };

        const handleDragOver = (cardId: 'word1' | 'word2') => {
          if (draggingCardId && draggingCardId !== cardId) {
            setDragOverCardId(cardId);
          }
        };

        const handleWordChange = (wordOption: any, cardId: 'word1' | 'word2') => {
          if (wordOption) {
            setFieldValue(`${cardId}.word`, wordOption.word);
            if (wordOption.meanings && wordOption.meanings.length > 0 && !values[cardId].meaning) {
              setFieldValue(`${cardId}.meaning`, wordOption.meanings[0].meaning);
            }
            if (wordOption.pronunciation && !values[cardId].pronunciation) {
              setFieldValue(`${cardId}.pronunciation`, wordOption.pronunciation);
            }
          } else {
            setFieldValue(`${cardId}.word`, '');
          }
        };

        return (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Word 1 Card */}
            <Card className={`transition-all ${dragOverCardId === 'word1' ? 'ring-2 ring-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle>Word 1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggingCardId === 'word2') {
                    setDragOverCardId('word1');
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    const data = JSON.parse(e.dataTransfer.getData('application/json'));
                    if (data && data.word && data.cardId === 'word2') {
                      handleWordDrop(data.word, 'word1');
                    }
                  } catch (error) {
                    console.error('Error handling drop:', error);
                  }
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverCardId(null);
                  }
                }}
              >
                <div className="space-y-2">
                  <WordSearchWithDrag
                    cardId="word1"
                    value={values.word1.word}
                    onChange={(wordOption) => handleWordChange(wordOption, 'word1')}
                    onDragStart={(word, cardId) => {
                      setDraggingCardId(cardId);
                    }}
                    onDrop={(wordOption, targetCardId) => {
                      handleWordDrop(wordOption, targetCardId);
                    }}
                    onDragOver={(cardId) => {
                      if (draggingCardId && draggingCardId !== cardId) {
                        setDragOverCardId(cardId);
                      }
                    }}
                    onDragLeave={() => {
                      setDragOverCardId(null);
                    }}
                    isDragging={draggingCardId === 'word1'}
                    dragOver={dragOverCardId === 'word1'}
                    placeholder="Search existing words or type manually..."
                    label="Word *"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Search for words from your database, type manually, or drag to swap
                  </p>
                </div>
                {touched.word1?.word && errors.word1?.word && (
                  <p className="text-sm text-red-500">{errors.word1.word}</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="word1.pronunciation">Pronunciation</Label>
                  <Field
                    as={Input}
                    id="word1.pronunciation"
                    name="word1.pronunciation"
                    placeholder="e.g., /əˈfekt/"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="word1.meaning">Meaning *</Label>
                  <Field
                    as={Textarea}
                    id="word1.meaning"
                    name="word1.meaning"
                    placeholder="Enter the meaning (or it will auto-fill from word database)"
                    className="min-h-[80px]"
                  />
                  {touched.word1?.meaning && errors.word1?.meaning && (
                    <p className="text-sm text-red-500">{errors.word1.meaning}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Examples</Label>
                  <FieldArray name="word1.examples">
                    {({ remove, push }) => (
                      <div className="space-y-2">
                        {values.word1.examples.map((example, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              as={Input}
                              name={`word1.examples.${index}`}
                              placeholder={`Example ${index + 1}`}
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
                          size="sm"
                          onClick={() => push('')}
                          className="gap-2"
                        >
                          <PlusCircle className="h-3 w-3" />
                          Add Example
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </CardContent>
            </Card>

            {/* Word 2 Card */}
            <Card className={`transition-all ${dragOverCardId === 'word2' ? 'ring-2 ring-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle>Word 2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggingCardId === 'word1') {
                    setDragOverCardId('word2');
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    const data = JSON.parse(e.dataTransfer.getData('application/json'));
                    if (data && data.word && data.cardId === 'word1') {
                      handleWordDrop(data.word, 'word2');
                    }
                  } catch (error) {
                    console.error('Error handling drop:', error);
                  }
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverCardId(null);
                  }
                }}
              >
                <div className="space-y-2">
                  <WordSearchWithDrag
                    cardId="word2"
                    value={values.word2.word}
                    onChange={(wordOption) => handleWordChange(wordOption, 'word2')}
                    onDragStart={(word, cardId) => {
                      setDraggingCardId(cardId);
                    }}
                    onDrop={(wordOption, targetCardId) => {
                      handleWordDrop(wordOption, targetCardId);
                    }}
                    onDragOver={(cardId) => {
                      if (draggingCardId && draggingCardId !== cardId) {
                        setDragOverCardId(cardId);
                      }
                    }}
                    onDragLeave={() => {
                      setDragOverCardId(null);
                    }}
                    isDragging={draggingCardId === 'word2'}
                    dragOver={dragOverCardId === 'word2'}
                    placeholder="Search existing words or type manually..."
                    label="Word *"
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Search for words from your database, type manually, or drag to swap
                  </p>
                </div>
                {touched.word2?.word && errors.word2?.word && (
                  <p className="text-sm text-red-500">{errors.word2.word}</p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="word2.pronunciation">Pronunciation</Label>
                  <Field
                    as={Input}
                    id="word2.pronunciation"
                    name="word2.pronunciation"
                    placeholder="e.g., /ɪˈfekt/"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="word2.meaning">Meaning *</Label>
                  <Field
                    as={Textarea}
                    id="word2.meaning"
                    name="word2.meaning"
                    placeholder="Enter the meaning (or it will auto-fill from word database)"
                    className="min-h-[80px]"
                  />
                  {touched.word2?.meaning && errors.word2?.meaning && (
                    <p className="text-sm text-red-500">{errors.word2.meaning}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Examples</Label>
                  <FieldArray name="word2.examples">
                    {({ remove, push }) => (
                      <div className="space-y-2">
                        {values.word2.examples.map((example, index) => (
                          <div key={index} className="flex gap-2">
                            <Field
                              as={Input}
                              name={`word2.examples.${index}`}
                              placeholder={`Example ${index + 1}`}
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
                          size="sm"
                          onClick={() => push('')}
                          className="gap-2"
                        >
                          <PlusCircle className="h-3 w-3" />
                          Add Example
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Explanation & Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation *</Label>
                <Field
                  as={Textarea}
                  id="explanation"
                  name="explanation"
                  placeholder="Explain the difference between these two words..."
                  className="min-h-[100px]"
                />
                {touched.explanation && errors.explanation && (
                  <p className="text-sm text-red-500">{errors.explanation}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="commonMistake">Common Mistake</Label>
                <Field
                  as={Textarea}
                  id="commonMistake"
                  name="commonMistake"
                  placeholder="Describe common mistakes people make..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memoryTip">Memory Tip</Label>
                <Field
                  as={Textarea}
                  id="memoryTip"
                  name="memoryTip"
                  placeholder="Provide a tip to remember the difference..."
                  className="min-h-[80px]"
                />
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
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Confused Words' : 'Create Confused Words'}
            </Button>
          </div>
        </Form>
      );
      }}
    </Formik>
  );
}

