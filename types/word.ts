export interface WordReference {
  _id: { $oid: string };
  word: string;
  pronunciation?: string;
  pos?: string;
  frequency?: string;
  overall_tone?: string;
  difficulty?: string;
  meaning?: string;
}

export interface WordMeaning {
  pos?: string;
  subtitle?: string;
  pronunciation?: string;
  common_usage?: {
    context: string;
    example: string;
  }[];
  tone?: string;
  category: string;
  difficulty?: string;
  meaning?: string;
  mnemonic?: string;
  easyMeaning?: string;
  kiddefinition?: string;
  example_sentences: string[];
  notes?: string;
  synonyms?: WordReference[];  // Using WordReference instead of WordData
  antonyms?: WordReference[];  // Using WordReference instead of WordData
}

export interface Expression {
  expression: string;
  type: string;
  pronunciation: string;
  meanings?: {
    meaning: string;
    example_sentences: string[];
    notes?: string;
  }
  relatedWords?: string[];
  tags?: string[];
  createdAt?: string;
}

export interface PhrasalVerb {
  phrase: string;
  meaning: string;
  example_sentences: string[];
  synonyms?: string[];
  antonyms?: string[];
  relatedWords?: string[];
}

export interface WordQuestion {
  type: string;
  description: string;
  answer?: string;
  options?: string[];
  hint?: string;
  difficulty?: string;
  category?: string;
}

export interface WordData {
  _id: { $oid: string };
  word: string;
  pronunciation?: string;
  frequency?: string;
  overall_tone?: string;
  etymology: string;
  misspellings: string[];
  usage_distribution?: {
    spoken: number;
    written: number;
  };
  word_family: {
    base: string;
    inflected?: string[];
    derived?: string[];
  };
  meanings: WordMeaning[];
  expressions?: Expression[]
  PhrasalVerbs?: PhrasalVerb[];
  questions?: WordQuestion[];
  collocations?: any[];
  historical_usage?: string;
  root_analysis?: {
    origin_language?: string;
    meaning?: string;
    book?: string;
    store?: string;
  };
}