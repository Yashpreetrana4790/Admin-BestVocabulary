'use client'
import { formUrlQuery, removeKeysFromQuery } from '@/utils/formUrlQuery';
import { Search, Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import Loading from './Loading';
import AdvancedSearchModal from './AdvancedSearchModal';

interface SearchBarProps {
  route: string;
  showAdvanced?: boolean; // Optional prop to show/hide advanced search
  title?: string; // Optional prop to customize title
}
export const SearchBar = ({ route, showAdvanced = true, title }: SearchBarProps) => {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const [search, setSearch] = React.useState(query || "");
  // Only initialize modal state if advanced search is enabled
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  // Track if we're syncing from URL (to prevent loops when filter is removed)
  const isSyncingFromUrlRef = React.useRef(false);
  
  // Explicitly check if advanced search should be shown
  // Only show if explicitly set to true
  const shouldShowAdvanced = showAdvanced === true;

  // Sync search input with URL query parameter when URL changes externally (e.g., when filter is removed)
  // This effect runs when searchParams change, but only updates state if URL value differs
  useEffect(() => {
    const urlSearchValue = searchParams.get("search") || "";
    // Only sync if URL value is actually different from current state
    // This handles cases where filters are removed and URL changes
    if (urlSearchValue !== search) {
      isSyncingFromUrlRef.current = true;
      setSearch(urlSearchValue);
      // Reset flag after state update completes
      setTimeout(() => {
        isSyncingFromUrlRef.current = false;
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]); // Use toString() to detect any URL param changes

  // Handle debounced URL updates when user types in search input
  useEffect(() => {
    // Skip if we're currently syncing from URL to prevent loops
    if (isSyncingFromUrlRef.current) {
      return;
    }

    const currentUrlQuery = searchParams.get("search") || "";
    
    // Don't update URL if search state already matches URL (prevents loops)
    if (search === currentUrlQuery) {
      return;
    }

    const delaydebounce = setTimeout(() => {
      // Double check we're not syncing from URL
      if (isSyncingFromUrlRef.current) {
        return;
      }

      if (search && search.trim()) {
        // User typed something - update URL with search value
        const newurl = formUrlQuery({
          params: searchParams.toString(),
          key: "search",
          value: search.trim()
        });
        router.push(newurl, { scroll: false });
      } else {
        // Search is empty - remove from URL
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
  }, [search, pathname, router, route]); // Removed searchParams to avoid conflicts with sync effect


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
              placeholder='Search' 
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

export default SearchBar; // ✅ Default export
