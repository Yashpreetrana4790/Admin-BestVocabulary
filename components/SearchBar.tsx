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

  // Sync search input with URL query parameter when URL changes externally
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

  // Handle debounced URL updates when user types in search input
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
      <div className='flex items-center justify-between  pt-5 pb-5  object-cover dark:bg-transparent px-4  bg-zinc-50 '>
        <div>
          <h2 className='font-bold '>
            {title || 'All Words list'}
          </h2>
        </div>
        <div className={`flex items-center gap-2 ${shouldShowAdvanced ? 'max-w-lg' : 'max-w-md'} w-full`}>
          <div className='flex-1 border rounded-xl relative'>
            <input 
              type="text" 
              placeholder={displayPlaceholder}
              className='w-full p-3 rounded-xl pr-10'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className='absolute top-3 right-3 h-5 w-5 text-muted-foreground' />
          </div>
          {shouldShowAdvanced ? (
            <>
              <button
                onClick={() => setIsAdvancedSearchOpen(true)}
                className='px-4 py-3 border rounded-xl hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer'
                title="Advanced Search"
              >
                <Filter className='h-5 w-5' />
                <span className='hidden sm:inline'>Advanced</span>
              </button>
              <AdvancedSearchModal 
                isOpen={isAdvancedSearchOpen}
                onClose={() => setIsAdvancedSearchOpen(false)}
              />
            </>
          ) : null}
        </div>
      </div>
    </Suspense>
  );
};

export default SearchBar;
