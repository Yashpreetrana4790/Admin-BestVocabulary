'use client'
import { formUrlQuery, removeKeysFromQuery } from '@/utils/formUrlQuery';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import Loading from './Loading';

interface SearchBarProps {
  route: string;
  title?: string;
  placeholder?: string;
}

const getRoutePlaceholder = (route: string): string => {
  const placeholderMap: { [key: string]: string } = {
    '/words': 'Search words...',
    '/phrasal-verbs': 'Search phrasal verbs...',
    '/questions': 'Search questions...',
  };
  return placeholderMap[route] || 'Search...';
};

export const SearchBar = ({ route, placeholder }: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const [search, setSearch] = React.useState(query || "");

  useEffect(() => {
    const delaydebounce = setTimeout(() => {
      if (search) {
        const newurl = formUrlQuery({
          params: searchParams.toString(),
          key: "search",
          value: search || ""
        })
        router.push(newurl, { scroll: false })
      }
      else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            KeysToRemove: ["search"]
          });
          router.push(newUrl, { scroll: false })
        }
      }
    }, 300)

    return () => clearTimeout(delaydebounce)
  }, [query, pathname, search, router, searchParams, route]);

  const displayPlaceholder = placeholder || getRoutePlaceholder(route);

  const clearSearch = () => {
    setSearch("");
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      KeysToRemove: ["search"]
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className='sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b'>
        <div className='container mx-auto px-4 sm:px-6 py-4'>
          <div className='max-w-xl relative group'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
              <Search className='h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors' />
            </div>
            <input 
              type="text" 
              placeholder={displayPlaceholder} 
              value={search}
              className='w-full pl-12 pr-10 py-3 rounded-xl border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200'
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={clearSearch}
                className='absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default SearchBar;
