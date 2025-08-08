import PhrasalVerbEditor from "../../components/PhraseVerbEditor";
import { getPhraseById } from "../../service/getPhrase";


interface EditProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: EditProps) {
  const id = params.id;
  const phrase = await getPhraseById(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Phrasal Verb</h1>
      <PhrasalVerbEditor initialData={phrase} phraseId={id} />
    </div>
  );
}