'use client'
import { formUrlQuery, removeKeysFromQuery } from '@/utils/formUrlQuery';
import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import Loading from './Loading';

interface SearchBarProps {
  route: string
}
export const SearchBar = ({ route }: SearchBarProps) => {

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
  }, [query, pathname, search, router, searchParams]);


  return (
    <Suspense fallback={<Loading />}>
      <div className='flex items-center justify-between  pt-5 pb-5  object-cover dark:bg-transparent px-4  bg-zinc-50 '>
        <div>
          <h2 className='font-bold '>

            All Words list
          </h2>
        </div>
        <div className='max-w-lg w-full border rounded-xl relative'>
          <input type="text" placeholder='Search' className='w-full p-3 rounded-xl'
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className='absolute top-3 right-3 ml-2' />
        </div>
      </div>
    </Suspense>
  );
};

export default SearchBar; // ✅ Default export
