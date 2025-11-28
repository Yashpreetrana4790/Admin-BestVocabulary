import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Languages, AlignLeft, BookOpen, Plus } from 'lucide-react';

export default function CategoriesPage() {
  const categoryTypes = [
    {
      title: 'Homophones',
      description: 'Words that sound the same but have different meanings and spellings',
      href: '/categories/homophones',
      icon: Languages,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Homonyms',
      description: 'Words that are spelled and sound the same but have different meanings',
      href: '/categories/homonyms',
      icon: AlignLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Confused Words',
      description: 'Commonly confused word pairs and their differences',
      href: '/categories/confused-words',
      icon: BookOpen,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Manage and organize your vocabulary with different category types
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Category Button - First Card */}
        <Link href="/categories/word-categories/new">
          <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">
                Create New Category
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Organize words into categories like Biology, Science, Literature, etc.
              </p>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Other Category Types */}
        {categoryTypes.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.href} href={category.href}>
              <Card className={`hover:shadow-lg transition-all cursor-pointer h-full border-2 ${category.borderColor}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${category.bgColor}`}>
                      <Icon className={`h-6 w-6 ${category.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <Button variant="ghost" className="w-full justify-start">
                    View {category.title} →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

