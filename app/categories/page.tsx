import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Languages, AlignLeft, BookOpen, Plus, ArrowRight, Sparkles, FolderTree, LayoutGrid } from 'lucide-react';

export default function CategoriesPage() {
  const categoryTypes = [
    {
      title: 'Word Categories',
      description: 'Organize words into custom categories like Biology, Science, Literature, Technology, and more',
      href: '/categories/word-categories',
      icon: FolderTree,
      gradient: 'from-blue-500/10 to-blue-500/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      borderColor: 'hover:border-blue-300',
      count: '12 categories'
    },
    {
      title: 'Homophones',
      description: 'Words that sound the same but have different meanings and spellings',
      href: '/categories/homophones',
      icon: Languages,
      gradient: 'from-purple-500/10 to-purple-500/5',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      borderColor: 'hover:border-purple-300',
      count: '45 groups'
    },
    {
      title: 'Homonyms',
      description: 'Words that are spelled and sound the same but have different meanings',
      href: '/categories/homonyms',
      icon: AlignLeft,
      gradient: 'from-emerald-500/10 to-emerald-500/5',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      borderColor: 'hover:border-emerald-300',
      count: '32 words'
    },
    {
      title: 'Confused Words',
      description: 'Commonly confused word pairs and their differences',
      href: '/categories/confused-words',
      icon: BookOpen,
      gradient: 'from-amber-500/10 to-amber-500/5',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      borderColor: 'hover:border-amber-300',
      count: '28 pairs'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-primary/10">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">All Categories</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and organize your vocabulary with different category types
          </p>
        </div>
      </div>

      {/* Category Types Grid - Main Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categoryTypes.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.href} href={category.href} className="group">
              <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${category.gradient} p-6 hover:shadow-lg ${category.borderColor} transition-all duration-300 h-full`}>
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${category.iconBg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${category.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                        <p className={`text-sm ${category.iconColor}`}>{category.count}</p>
                      </div>
                    </div>
                    <ArrowRight className={`h-5 w-5 ${category.iconColor} opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all`} />
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5 bg-background/50">
                      Manage
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    {category.title === 'Word Categories' && (
                      <Button size="sm" className="gap-1.5" asChild>
                        <Link href="/categories/word-categories/new">
                          <Plus className="h-3.5 w-3.5" />
                          New
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/categories/word-categories/new" className="group">
          <div className="rounded-2xl border-2 border-dashed border-blue-300/50 bg-blue-500/5 p-5 hover:border-blue-400 hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">New Category</h3>
                <p className="text-xs text-muted-foreground">Create word category</p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/categories/homophones/new" className="group">
          <div className="rounded-2xl border-2 border-dashed border-purple-300/50 bg-purple-500/5 p-5 hover:border-purple-400 hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">New Homophone</h3>
                <p className="text-xs text-muted-foreground">Add homophone group</p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/categories/confused-words/new" className="group">
          <div className="rounded-2xl border-2 border-dashed border-amber-300/50 bg-amber-500/5 p-5 hover:border-amber-400 hover:shadow-md transition-all duration-300 h-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">New Word Pair</h3>
                <p className="text-xs text-muted-foreground">Add confused words</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Help Section */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-muted">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Understanding Categories</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Word Categories</strong> are custom groups you create. <strong>Homophones</strong>, <strong>Homonyms</strong>, and <strong>Confused Words</strong> are linguistic categories for learning word relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
