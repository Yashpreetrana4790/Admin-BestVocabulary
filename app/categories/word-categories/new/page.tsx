import CategoryForm from '../components/CategoryForm';
import { FolderPlus } from 'lucide-react';

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-blue-500/10">
          <FolderPlus className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Create New Category</h1>
          <p className="text-muted-foreground">
            Organize words into custom categories for better learning
          </p>
        </div>
      </div>
      
      <CategoryForm />
    </div>
  );
}
