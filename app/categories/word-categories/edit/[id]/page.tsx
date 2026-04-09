import { getCategoryById } from '../../service/categoryService';
import CategoryForm from '../../components/CategoryForm';
import { Edit3, AlertCircle, FolderTree } from 'lucide-react';

interface EditProps {
  params: {
    id: string;
  };
}

export default async function EditCategoryPage({ params }: EditProps) {
  const id = params?.id;

  if (!id) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Invalid Category</h2>
              <p className="text-sm text-muted-foreground">Invalid category ID provided.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  try {
    const response = await getCategoryById(id);
    const category = response.data || response;

    if (!category) {
      return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-destructive mb-2">Category Not Found</h2>
                <p className="text-sm text-muted-foreground">The requested category does not exist.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          {category.image ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-blue-200">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ 
                backgroundColor: category.color ? `${category.color}15` : 'rgb(59 130 246 / 0.1)',
              }}
            >
              {category.icon || <FolderTree className="h-8 w-8 text-blue-600" />}
            </div>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Edit Category</h1>
              <div className="p-1.5 rounded-lg bg-blue-500/10">
                <Edit3 className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <p className="text-muted-foreground">
              Update <span className="font-medium text-foreground">{category.name}</span> category details
            </p>
          </div>
        </div>
        
        <CategoryForm initialData={category} categoryId={id} />
      </div>
    );
  } catch (error) {
    console.error('Error loading category:', error);
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-destructive mb-2">Failed to Load Category</h2>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Please check your connection and try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
