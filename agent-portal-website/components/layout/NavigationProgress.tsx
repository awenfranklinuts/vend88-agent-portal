'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({ 
  showSpinner: false, 
  speed: 400, 
  minimum: 0.2,
  trickleSpeed: 200
});

export default function NavigationProgress() {
  const pathname = usePathname();

  useEffect(() => {
    // Start loading bar on route change
    NProgress.start();
    
    // Complete loading bar after render
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
