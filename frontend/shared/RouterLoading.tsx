'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Icons } from '@/utils/icons';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);

  useEffect(() => {
    if (prevPathname !== pathname || prevSearchParams !== searchParams) {
      setLoading(true);
      
      // Set a short timeout to simulate the loading state
      const timer = setTimeout(() => {
        setLoading(false);
        setPrevPathname(pathname);
        setPrevSearchParams(searchParams);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, prevPathname, prevSearchParams]);

  return loading ? <div className='bg-black z-[10000] w-screen h-screen overflow-hidden flex items-center justify-center'>
    <Icons.TwitterX/>

  </div> : null;
}