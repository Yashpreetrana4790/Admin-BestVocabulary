'use client'
import { formUrlQuery, removeKeysFromQuery } from '@/utils/formUrlQuery';
import { Search, Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import Loading from './Loading';
import AdvancedSearchModal from './AdvancedSearchModal';

interface SearchBarProps {
  route: string;
  showAdvanced?: boolean;
  title?: string;
}

const getRoutePlaceholder = (route: string): string => {
  const placeholderMap: { [key: string]: string } = {
    '/words': 'Search words...',
    '/phrasal-verbs': 'Search phrasal verbs...',
    '/questions': 'Search questions...',
    '/idioms': 'Search idioms...',
    '/categories/word-categories': 'Search categories...',
    '/categories/homophones': 'Search homophones...',
    '/categories/homonyms': 'Search homonyms...',
    '/categories/confused-words': 'Search confused words...',
  };
  return placeholderMap[route] || 'Search...';
};

export const SearchBar = ({ route, showAdvanced = true, title }: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const [search, setSearch] = React.useState(query || "");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const isSyncingFromUrlRef = React.useRef(false);
  
  const shouldShowAdvanced = showAdvanced === true;

  useEffect(() => {
    const urlSearchValue = searchParams.get("search") || "";
    if (urlSearchValue !== search) {
      isSyncingFromUrlRef.current = true;
      setSearch(urlSearchValue);
      setTimeout(() => {
        isSyncingFromUrlRef.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  useEffect(() => {
    if (isSyncingFromUrlRef.current) {
      return;
    }

    const currentUrlQuery = searchParams.get("search") || "";
    
    if (search === currentUrlQuery) {
      return;
    }

    const delaydebounce = setTimeout(() => {
      if (isSyncingFromUrlRef.current) {
        return;
      }

      if (search && search.trim()) {
        const newurl = formUrlQuery({
          params: searchParams.toString(),
          key: "search",
          value: search.trim()
        });
        router.push(newurl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            KeysToRemove: ["search"]
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delaydebounce);
  }, [search, pathname, router, route, searchParams]);

  const displayPlaceholder = getRoutePlaceholder(route);

  return (
    <Suspense fallback={<Loading />}>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-card'>
        {title && (
          <h2 className='font-semibold text-foreground'>
            {title}
          </h2>
        )}
        <div className={`flex items-center gap-2 ${shouldShowAdvanced ? 'max-w-lg' : 'max-w-md'} w-full ${title ? 'sm:w-auto' : ''}`}>
          <div className='flex-1 relative'>
            <input 
              type="text" 
              placeholder={displayPlaceholder}
              className='w-full h-11 px-4 pr-10 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className='absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-muted-foreground' />
          </div>
          {shouldShowAdvanced && (
            <>
              <button
                onClick={() => setIsAdvancedSearchOpen(true)}
                className='h-11 px-4 border rounded-xl hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground'
                title="Advanced Search"
              >
                <Filter className='h-4 w-4' />
                <span className='hidden sm:inline'>Filters</span>
              </button>
              <AdvancedSearchModal 
                isOpen={isAdvancedSearchOpen}
                onClose={() => setIsAdvancedSearchOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default SearchBar;
