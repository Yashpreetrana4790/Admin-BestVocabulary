"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { CreateNewphrase } from "../service/createPhrase";

// Define validation schema
const validationSchema = Yup.object({
  phrase: Yup.string()
    .min(2, "Phrase must be at least 2 characters")
    .required("Phrase is required"),
  meaning: Yup.string()
    .min(10, "Meaning must be at least 10 characters")
    .required("Meaning is required"),
  example_sentences: Yup.array()
    .of(Yup.string().min(10, "Sentence must be at least 10 characters")),
  synonyms: Yup.array().of(Yup.string().min(2, "Synonym must be at least 2 characters")),
  antonyms: Yup.array().of(Yup.string().min(2, "Antonym must be at least 2 characters")),
  relatedWords: Yup.array().of(Yup.string().min(2, "Related word must be at least 2 characters")),
});

export default function NewPhrasalVerbPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      phrase: "",
      meaning: "",
      example_sentences: [""],
      synonyms: [],
      antonyms: [],
      relatedWords: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await CreateNewphrase(values);
        toast.success("Phrasal verb created successfully!");
        router.push("/phrasal-verbs");
      } catch (error) {
        console.error("Error creating phrasal verb:", error);
        if (error instanceof Error) {
          toast(error.message);
        }
      }
    },
  });

  // Helper functions to manage array fields
  const addExample = () => {
    formik.setFieldValue("example_sentences", [...formik.values.example_sentences, ""]);
  };

  const removeExample = (index: number) => {
    const newExamples = [...formik.values.example_sentences];
    newExamples.splice(index, 1);
    formik.setFieldValue("example_sentences", newExamples);
  };

  const addSynonym = () => {
    formik.setFieldValue("synonyms", [...formik.values.synonyms, ""]);
  };

  const removeSynonym = (index: number) => {
    const newSynonyms = [...formik.values.synonyms];
    newSynonyms.splice(index, 1);
    formik.setFieldValue("synonyms", newSynonyms);
  };

  const addAntonym = () => {
    formik.setFieldValue("antonyms", [...formik.values.antonyms, ""]);
  };

  const removeAntonym = (index: number) => {
    const newAntonyms = [...formik.values.antonyms];
    newAntonyms.splice(index, 1);
    formik.setFieldValue("antonyms", newAntonyms);
  };

  const addRelatedWord = () => {
    formik.setFieldValue("relatedWords", [...formik.values.relatedWords, ""]);
  };

  const removeRelatedWord = (index: number) => {
    const newRelatedWords = [...formik.values.relatedWords];
    newRelatedWords.splice(index, 1);
    formik.setFieldValue("relatedWords", newRelatedWords);
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Phrasal Verbs
      </Button>

      <h1 className="text-3xl font-bold mb-6">Add New Phrasal Verb</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Phrase Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Phrasal Verb <span className="text-red-500">*</span></label>
          <Input
            name="phrase"
            placeholder="e.g. 'look up'"
            value={formik.values.phrase}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="text-lg py-6"
          />
          {formik.touched.phrase && formik.errors.phrase && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.phrase}</p>
          )}
        </div>

        {/* Meaning Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Meaning <span className="text-red-500">*</span></label>
          <Textarea
            name="meaning"
            placeholder="Explain the meaning..."
            value={formik.values.meaning}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="min-h-[120px] text-base"
          />
          {formik.touched.meaning && formik.errors.meaning && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.meaning}</p>
          )}
        </div>

        {/* Example Sentences */}
        <div>
          <label className="block text-sm font-medium mb-2">Example Sentences</label>
          <div className="space-y-4">
            {formik.values.example_sentences.map((sentence, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  name={`example_sentences[${index}]`}
                  placeholder={`Example sentence #${index + 1}`}
                  value={sentence}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="flex-1"
                />
                {formik.values.example_sentences.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeExample(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addExample}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Example
            </Button>
          </div>
          {formik.touched.example_sentences && formik.errors.example_sentences && (
            <p className="mt-1 text-sm text-red-500">
              {typeof formik.errors.example_sentences === 'string'
                ? formik.errors.example_sentences
                : 'Invalid examples'}
            </p>
          )}
        </div>

        {/* Synonyms */}
        <div>
          <label className="block text-sm font-medium mb-2">Synonyms</label>
          <div className="space-y-4">
            {formik.values.synonyms.map((synonym, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  name={`synonyms[${index}]`}
                  placeholder={`Synonym #${index + 1}`}
                  value={synonym}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSynonym(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addSynonym}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Synonym
            </Button>
          </div>
        </div>

        {/* Antonyms */}
        <div>
          <label className="block text-sm font-medium mb-2">Antonyms</label>
          <div className="space-y-4">
            {formik.values.antonyms.map((antonym, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  name={`antonyms[${index}]`}
                  placeholder={`Antonym #${index + 1}`}
                  value={antonym}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeAntonym(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addAntonym}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Antonym
            </Button>
          </div>
        </div>

        {/* Related Words */}
        <div>
          <label className="block text-sm font-medium mb-2">Related Words</label>
          <div className="space-y-4">
            {formik.values.relatedWords.map((word, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  name={`relatedWords[${index}]`}
                  placeholder={`Related word #${index + 1}`}
                  value={word}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeRelatedWord(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addRelatedWord}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Related Word
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Create Phrasal Verb</Button>
        </div>
      </form>
    </div>
  );
}