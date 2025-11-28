'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Book, AlertCircle, FileText, LayoutGrid, FolderTree } from 'lucide-react';

const categoryNavItems = [
  { 
    label: 'All Categories', 
    href: '/categories',
    icon: LayoutGrid,
    description: 'View all category types'
  },
  { 
    label: 'Word Categories', 
    href: '/categories/word-categories',
    icon: FolderTree,
    description: 'Organize words into categories'
  },
  { 
    label: 'Homophones', 
    href: '/categories/homophones',
    icon: Book,
    description: 'Words that sound the same'
  },
  { 
    label: 'Homonyms', 
    href: '/categories/homonyms',
    icon: FileText,
    description: 'Words that are spelled and sound the same'
  },
  { 
    label: 'Confused Words', 
    href: '/categories/confused-words',
    icon: AlertCircle,
    description: 'Commonly confused word pairs'
  },
];

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 p-4 overflow-y-auto">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-4 px-3">Category Management</h2>
          {categoryNavItems.map((item, index) => {
            // Add divider after "All Categories"
            const showDivider = index === 0;
            const Icon = item.icon;
            // For "All Categories", only active on exact match
            // For others, active on exact match or sub-routes
            const isActive = item.href === '/categories' 
              ? pathname === '/categories'
              : pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted text-foreground/70 hover:text-foreground'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5 mt-0.5 shrink-0',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium text-sm',
                      isActive ? 'text-primary-foreground' : ''
                    )}>
                      {item.label}
                    </div>
                    <div className={cn(
                      'text-xs mt-0.5',
                      isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
                {showDivider && (
                  <div className="border-t border-border my-2 mx-3"></div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

